import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BlurDirective, WhiteBlurDirective, DarkBlurDirective} from './directives/blur.directive';
import {FaComponent} from 'angular2-fontawesome/components';

import {SafeResourceUrlPipe} from './pipes/safe.pipe';
import {DayRotationPipe} from './pipes/day-rotation.pipe';
import {SchoolPercentagePipe} from './pipes/school-percentage.pipe';
import {CompassDirectionPipe} from './pipes/compass-direction.pipe';
import {RoundPipe} from './pipes/round.pipe';
import {WeatherIconPipe} from './pipes/weather-icon.pipe';
import {ValuesPipe} from './pipes/values.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [
        // Directives
		BlurDirective,           FaComponent,            DarkBlurDirective,
		WhiteBlurDirective,
		// Pipes
		SafeResourceUrlPipe,     DayRotationPipe,        SchoolPercentagePipe,
		CompassDirectionPipe,    RoundPipe,              WeatherIconPipe,
		ValuesPipe,
    ],
    exports: [
        // Directives
		BlurDirective,           FaComponent,            DarkBlurDirective,
		WhiteBlurDirective,
		// Pipes
		SafeResourceUrlPipe,     DayRotationPipe,        SchoolPercentagePipe,
		CompassDirectionPipe,    RoundPipe,              WeatherIconPipe,
		ValuesPipe,
    ]
})
export class SharedModule {}