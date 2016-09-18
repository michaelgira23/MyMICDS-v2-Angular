import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { hexToRgb } from '../../../common/utils';
import { SocketioService } from '../../../services/socketio.service';

declare let Chart: any;

@Component({
	selector: 'mymicds-progress',
	templateUrl: './progress.component.html',
	styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {

	@Input()
	today: any = null;

	@Input()
	schedule: any = null;

	// Circular Progress References
	ctx: any;
	progressBar: any;

	// Current Class Label
	currentClass: string = null;
	currentClassPercent: number = null;
	schoolPercent: number = null;

	// Start / destroy interval that calculates percentages
	timer: any;

	// Socket.io
	socketioConnection: any;
	clickTagListenerSub: any;
	clickTagListener: any;

	constructor(private socketioService: SocketioService) { }

	/*
	 * Configure progress bar
	 */

	// Returns default data for progress bar
	defaultColors(): string[] {
		return ['rgba(0, 0, 0, 0.1)'];
	}
	defaultData(): number[] {
		return [100];
	}
	defaultLabels(): string[] {
		return ['No School'];
	}


	ngOnInit() {
		// Get Progress Bar <canvas>
		this.ctx = document.getElementsByClassName('progress-chart')[0];

		// Initialize Progress Bar
		this.progressBar = new Chart(this.ctx, {
			type: 'doughnut',
			data: {
				labels: this.defaultLabels(),
				datasets: [{
					data: this.defaultData(),
					backgroundColor: this.defaultColors(),
					borderWidth: 0
				}]
			},
			options: {
				animation: {
					easing: 'easeInOutCirc'
				},
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						// title: function(tooltipItems, data) {
						// 	console.log(tooltipItems, data);
						// 	return 'hello'
						// },
						// label: function(tooltipItem, data) {
						// 	let classLabel = data.datasets[tooltipItem.datasetIndex].label;
						// 	return classLabel;
						// }
					}
				},
				cutoutPercentage: 95
			}
		});

		// Start timer
		this.calculatePercentages();
		this.timer = setInterval(() => {
			this.calculatePercentages();
		}, 1000);

		// Socket.io service to spin the spinny
		let tagEl = document.getElementById('progress-day-tag');
		this.clickTagListener = Observable.merge(
			Observable.fromEvent(tagEl, 'mousedown'),
			Observable.fromEvent(tagEl, 'mouseup')
		).debounceTime(100);
		this.clickTagListenerSub = this.clickTagListener
		.subscribe(
			e => {
				this.socketioService.emit('progress label click toggle', null);
			}
		);

		this.socketioConnection = this.socketioService.listen('progress label spin').subscribe(
			pressed => {
				console.log('toggled');
				pressed ? tagEl.classList.add('rotate') : tagEl.classList.remove('rotate');
			}
		);
	}

	ngOnDestroy() {
		// Stop timer
		clearInterval(this.timer);
		// Destroy Progress Bar Instance
		this.progressBar.destroy();
		// Unsubsciribe socket connection
		this.socketioConnection.unsubscribe();
		this.clickTagListenerSub.unsubscribe();
	}

	/*
	 * Calculate schedule data and store to variables
	 */

	calculatePercentages() {
		// Fallback if schedule is not set or no school
		if (!this.schedule || this.schedule.classes.length === 0) {
			// Just set default parameters
			this.progressBar.data.datasets[0].backgroundColor = this.defaultColors();
			this.progressBar.data.datasets[0].data = this.defaultData();
			this.progressBar.data.labels = this.defaultLabels();

			this.progressBar.update();
			return;
		}

		// Create a new array and later assign to progress bar
		let newColors: string[] = [];
		let newData: number[] = [];
		let newLabels: string[] = [];

		let newCurrentClass = null;
		let newCurrentClassPercent = null;

		// Insert a 'break' period in between classes that aren't back-to-back
		let breaks = [];
		for (let i = 0; i < this.schedule.classes.length - 1; i++) {
			let currBlock = this.schedule.classes[i];
			let nextBlock = this.schedule.classes[i + 1];

			if (currBlock.end !== nextBlock.start) {
				breaks.push({
					class : 'Break',
					start: currBlock.end,
					end  : nextBlock.start,
					color: 'rgba(0, 0, 0, 0.4)'
				});
			}
		}

		// Combine classes and breaks array into one
		let formattedSchedule = this.schedule.classes.concat(breaks);
		// Sort classes by start time
		formattedSchedule.sort(function(a, b) {
			return a.start - b.start;
		});

		// Generate colors for each class
		for (let i = 0; i < formattedSchedule.length; i++) {
			if (!formattedSchedule[i].color) {
				let color = hexToRgb(formattedSchedule[i].class.color);
				formattedSchedule[i].color = 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', 0.8)';
			}
		}

		// Get first and last blocks
		let classCount = formattedSchedule.length;
		let firstBlock = formattedSchedule[0];
		let lastBlock  = formattedSchedule[classCount - 1];

		// Get length and percentage of school day
		let schoolLength  = lastBlock.end.getTime() - firstBlock.start.getTime();
		let schoolPercent = this.getPercent(firstBlock.start, lastBlock.end);

		// Set school percentage variable to display inside the circle
		this.schoolPercent = +schoolPercent.toFixed(2);

		// Loop through classes and calculate stuff
		for (let i = 0; i < formattedSchedule.length; i++) {
			let block = formattedSchedule[i];

			let blockName = block.class;
			if (typeof block.class === 'object') {
				blockName = block.class.name;
			}

			// Get class percentage
			// Thanks to Amaan for helping me figure out this algorithim back in v1
			let classLength = block.end.getTime() - block.start.getTime();
			let classRatio = classLength / schoolLength;
			let classPercent = this.getPercent(block.start, block.end);
			let finalPercentage = classPercent * classRatio;

			let roundedPercent = +finalPercentage.toFixed(2);

			// Add values to their respective array if data is more than 0
			if (roundedPercent > 0) {
				newColors.push(block.color);
				newData.push(roundedPercent);
				newLabels.push(blockName);
			}

			// Check if class is the current class
			if (0 < classPercent && classPercent < 100) {
				newCurrentClass = blockName;
				newCurrentClassPercent = +classPercent.toFixed(2);
			}
		}

		// Add a filler block for when school isn't complete yet
		newColors.push('rgba(0, 0, 0, 0.1)');
		newData.push(100 - +schoolPercent.toFixed(2));
		newLabels.push('School Left');

		// Set current class labels in the middle of the progress bar
		this.currentClass = newCurrentClass;
		this.currentClassPercent = newCurrentClassPercent;

		// Assign new arrays to progress bar data
		this.progressBar.data.datasets[0].backgroundColor = newColors;
		this.progressBar.data.datasets[0].data = newData;
		this.progressBar.data.labels = newLabels;

		this.progressBar.update();

	}

	/*
	 * Gets percentage of class completed between two date objects relative to the current time.
	 * Will return 0 if class hasn't started yet or 100 of class has already finished.
	 */

	getPercent(start, end): number {

		const numerator = new Date().getTime() - start.getTime();
		const denominator = end.getTime() - start.getTime();

		let answer = (numerator / denominator) * 100;

		if (0 <= answer && answer <= 100) {
			return answer;
		} else if (answer < 0) {
			return 0;
		} else {
			return 100;
		}
	}

}
