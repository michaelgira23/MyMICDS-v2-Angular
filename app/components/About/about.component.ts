import {Component} from '@angular/core';

@Component({
	selector: 'about',
	templateUrl: 'app/components/About/about.html',
	styleUrls: ['dist/app/components/About/about.css'],
})
export class AboutComponent {
	developers:any[] = [
		{
			firstName: 'Michael',
			lastName : 'Gira',
			gradYear : 2019,
			title    : 'Creator and Lead Developer',
			image    : 'dist/app/resources/developers/michaels-ugly-face-new.jpg'
		},
		{
			firstName: 'Nick',
			lastName : 'Clifford',
			gradYear : 2020,
			title    : 'System Administrations',
			image    : 'dist/app/resources/developers/nicks-ugly-face-new.jpg'
		},
		{
			firstName: 'Jack',
			lastName : 'Cai',
			gradYear : 2019,
			title    : 'Front-End Developer',
			image    : 'dist/app/resources/developers/jacks-ugly-face-new.jpg'
		},
		{
			firstName: 'Bob',
			lastName : 'Sforza',
			gradYear : 2017,
			title    : 'Developer',
			image    : 'dist/app/resources/developers/bobs-ugly-face-new.jpg'
		}
	];
}
