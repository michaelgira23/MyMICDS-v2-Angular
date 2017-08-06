import { Component, Input, Output, EventEmitter } from '@angular/core';
import { contains } from '../../common/utils';
import { modules, getDefaultOptions } from '../modules/modules-main';
import { OptionsConfig, Options } from '../modules/modules-config';

@Component({
	selector: 'mymicds-module-options',
	templateUrl: './module-options.component.html',
	styleUrls: ['./module-options.component.scss']
})
export class ModuleOptionsComponent {

	@Input()
	get type() {
		return this._type;
	}
	set type(name: string) {
		if (!modules[name] || name === this.type) {
			return;
		}
		this._type = name;
		this.optionsConfig = modules[name].options;
		this.optionKeys = Object.keys(this.optionsConfig);

		console.log('set type', name, getDefaultOptions(name));

		// Fall back to default options if none are provided
		this.options = {};
	}
	private _type: string = null;

	@Input()
	get options() {
		return this._options;
	}
	set options(newOptions: Options) {
		// Instead of replacing options, just override default options
		this._options = Object.assign({}, getDefaultOptions(this.type), this.options, newOptions);
	}
	private _options: Options = {};

	@Output() optionsChange = new EventEmitter<Options>();

	optionKeys: string[];
	optionsConfig: OptionsConfig;

	constructor() { }

	valueChanged() {
		// Loop through all options and only emit ones valid
		const validOptions = {};
		for (const optionKey of Object.keys(this.options)) {
			if (contains(this.optionKeys, optionKey)) {
				validOptions[optionKey] = this.options[optionKey];
			}
		}

		this.optionsChange.emit(validOptions);
	}

}
