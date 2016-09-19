import { Component, OnInit, OnDestroy } from '@angular/core';

import { AlertService } from '../../../services/alert.service';
import { WeatherService } from '../../../services/weather.service';

@Component({
	selector: 'mymicds-weather',
	templateUrl: './weather.component.html',
	styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {

	weather: any = null;
	subscription: any;

	constructor(private alertService: AlertService, private weatherService: WeatherService) { }

	ngOnInit() {
		this.subscription = this.weatherService.getWeather().subscribe(
			(data) => {
				this.weather = data;
			},
			(error) => {
				this.alertService.addAlert('danger', 'Get Weather Error!', error);
			}
		);
	}

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.subscription.unsubscribe();
	}

	// Toggle the format of temperatures between Ferinheight and Celcius
	celcius: boolean = false
	toggleTempFormat() {
		this.celcius = !this.celcius;
		if (this.celcius) {
			this.weather.currently.temperature = ((this.weather.currently.temperature -32) / 1.8).toPrecision(4);
			this.weather.daily.data[0].temperatureMax = ((this.weather.daily.data[0].temperatureMax -32) / 1.8).toPrecision(4);
			this.weather.daily.data[0].temperatureMin = ((this.weather.daily.data[0].temperatureMin -32) / 1.8).toPrecision(4);
		} else {
			this.weather.currently.temperature = (this.weather.currently.temperature * 1.8 + 32).toPrecision(4);
			this.weather.daily.data[0].temperatureMax = (this.weather.daily.data[0].temperatureMax * 1.8 + 32).toPrecision(4);
			this.weather.daily.data[0].temperatureMin = (this.weather.daily.data[0].temperatureMin * 1.8 + 32).toPrecision(4);
		}
	}

}
