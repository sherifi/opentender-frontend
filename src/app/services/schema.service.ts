import {Injectable, Inject} from '@angular/core';

@Injectable()
export class SchemaService {
	private _schema: any;

	constructor(@Inject('schema') externalSchema) {
		this._schema = externalSchema;
	}

	get() {
		return this._schema;
	}
}
