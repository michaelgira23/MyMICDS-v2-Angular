import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import '../../common/rxjs-operators';
import moment from 'moment';
import { contains } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { BulletinService } from '../../services/bulletin.service';

@Component({
	selector: 'mymicds-daily-bulletin',
	templateUrl: './daily-bulletin.component.html',
	styleUrls: ['./daily-bulletin.component.scss']
})
export class DailyBulletinComponent implements OnInit {

	loading = true;

	bulletins: string[] = [];
	bulletinBaseURL: string = '';
	bulletinURL: string = '';
	bulletinDate: any = moment();
	bulletinIndex: number = 0;

	constructor(private route: ActivatedRoute, private alertService: AlertService, private bulletinService: BulletinService) { }

	ngOnInit() {
		let source = Observable.combineLatest([
			this.bulletinService.listBulletins(),
			this.route.params
		]);

		source.subscribe(
			(data: any) => {
				this.loading = false;
				this.bulletinBaseURL = data[0].baseURL;
				this.bulletins = data[0].bulletins;

				// Check if a specific bulletin was supplied in the url. By default use most recent bulletin.
				let bulletinParam = data[1]['bulletin'];
				if (typeof bulletinParam !== 'undefined' && contains(this.bulletins, bulletinParam)) {
					// Bulletin parameter is valid! Use that instead.
					this.bulletinIndex = this.bulletins.indexOf(bulletinParam);
				}

				this.setBulletin(this.bulletinIndex);

			},
			error => {
				this.alertService.addAlert('danger', 'Get Bulletins Error!', error);
			}
		);
	}

	setBulletin(index) {
		this.bulletinURL = this.bulletinBaseURL + '/' + this.bulletins[index] + '.pdf';
		this.bulletinDate = moment(this.bulletins[index]);
	}

	previousBulletin() {
		if (this.bulletinIndex < this.bulletins.length - 1) {
			this.bulletinIndex++;
			this.setBulletin(this.bulletinIndex);
		}
	}

	currentBulletin() {
		this.bulletinIndex = 0;
		this.setBulletin(this.bulletinIndex);
	}

	nextBulletin() {
		if (this.bulletinIndex > 0) {
			this.bulletinIndex--;
			this.setBulletin(this.bulletinIndex);
		}
	}

}