import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'mymicds-bookmarks',
	templateUrl: './bookmarks.component.html',
	styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

	@Input() label: string;
	@Input() icon: string;
	@Input() url: string;

	constructor() { }

	ngOnInit() {
		const isOutlineIcon = this.icon.substring(this.icon.length - 2, this.icon.length) == '-o'
		if (this.icon.includes('fa-') && isOutlineIcon) { // If it's an outline icon from FA4 (fa-envelope-o), remove the 'fa' and 'o'
			this.icon = this.icon.substring(3, this.icon.length - 2)
		} else if (this.icon.includes('fa-')) {
			this.icon = this.icon.substring(3);
		}
	}

}
