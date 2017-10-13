import {FilterDef, FilterType} from './filters';

export interface SearchCommandFilter {
	field: string;
	value: Array<string | boolean | number>;
	type: string;
	sort?: string;
	mode?: string;
	and?: SearchCommandFilter[];
}

export interface SearchCommandAggregation {
	field: string;
	size?: number;
	type: string;
	aggregations?: SearchCommandAggregation[];
}

export class SearchCommand {
	filters: Array<SearchCommandFilter> = [];
	aggregations: Array<SearchCommandAggregation> = [];
	size?: number;
	from?: number;
	sort?: {
		field: string;
		ascend: boolean;
	};
}

export interface Filter {
	def: FilterDef;
	aggregation_id?: string; // auto build field->id (xyz.xzy -> xyz_xyz as made be elastic aggregation result)
	value?: string; // the actual user search value
	values?: Array<any>; // the actual user search values, eg. range [year_start,year_end]
	enabled?: {}; // the additional filter strings based on user choosen aggregation
	buckets?: any; // the result of aggregation
	active?: boolean;
	mode?: string;
	minmax?: null | [number, number];
}

export class Search {
	filters: Array<Filter> = [];
	searches: Array<Filter> = [];
	country: string;
	entity: string;

	constructor(entity: string, filterDefs?: Array<FilterDef>) {
		this.entity = entity;
		this.filters = (filterDefs || []).map(this.buildFilter);
	}

	public build(filterDefs: Array<FilterDef>) {
		this.filters = (filterDefs || []).map(this.buildFilter);
	}

	public getActiveFilterDefs(): Array<FilterDef> {
		return this.filters.map(f => f.def);
	}

	public toggleFilter(filterdef: FilterDef): void {
		let filter = this.filters.filter(f => {
			return filterdef === f.def;
		})[0];
		if (!filter) {
			this.filters.push(this.buildFilter(filterdef));
		} else {
			this.filters.splice(this.filters.indexOf(filter), 1);
		}
	}

	public addSearch(filterdef: FilterDef): void {
		this.searches.push(this.buildFilter(filterdef));
	}

	public removeSearch(search: Filter): void {
		this.searches = this.searches.filter(s => s !== search);
	}

	public fillAggregationResults(aggregations): void {
		this.filters.forEach(filter => {
			let missing = Object.keys(filter.enabled).filter(key => {
				return filter.enabled[key];
			});
			filter.buckets = [];
			if (aggregations) {
				let agg = aggregations[filter.aggregation_id];
				if (agg) {
					filter.buckets = agg.buckets;
					if (filter.def.valuesFilter) {
						filter.buckets = filter.def.valuesFilter(agg.buckets);
					}
					agg.buckets.forEach(bucket => {
						let i = missing.indexOf(bucket.key);
						if (i >= 0) {
							missing.splice(i, 1);
						}
					});
				}
			}
			missing.forEach((key) => {
				filter.buckets.unshift({key: key, doc_count: 0});
			});
		});
	}

	public getCommand(): SearchCommand {
		let cmd = new SearchCommand();
		cmd.aggregations = this.filters.filter((f) => {
			return f.active;
		}).map((f) => {
			return {type: FilterType[f.def.aggregation_type || f.def.type], field: f.def.aggregation_field || f.def.field, size: f.def.size};
		});
		this.filters.forEach((f) => {
			if (f.active) {
				let list = [];
				if (f.enabled) {
					let others = [];
					Object.keys(f.enabled).forEach((key) => {
						if (f.enabled[key]) {
							if (f.def.aggregation_type && (f.def.aggregation_type !== f.def.type)) {
								others.push(key);
							} else {
								list.push(key);
							}
						}
					});
					if (others.length > 0) {
						cmd.filters.push({field: f.def.aggregation_field || f.def.field, value: others, type: FilterType[f.def.aggregation_type]});
					}
				}
				if (f.value && f.value.length > 0) {
					list.push(f.value);
				}
				if (f.values) {
					list = list.concat(f.values);
				}
				if (list.length > 0) {
					cmd.filters.push({field: f.def.field, value: list, type: FilterType[f.def.type]});
				}
			}
		});
		this.searches.forEach((f) => {
			if (f.def.type === FilterType.text) {
				if (f.value && f.value !== '') {
					let s: SearchCommandFilter = cmd.filters.find(item => {
						return (item.field == f.def.field);
					});
					if (s) {
						s.value.push(f.value);
					} else {
						cmd.filters.push({field: f.def.field, value: [f.value], type: FilterType[f.def.type]});
					}
				}
			} else if (f.def.type === FilterType.value) {
				cmd.filters.push({field: f.def.field, value: [f.value], type: FilterType[f.def.type], mode: f.mode});
			}
		});
		return cmd;
	}

	private buildFilter(fd: FilterDef) {
		return {
			def: fd,
			aggregation_id: (fd.aggregation_field || fd.field).replace(/\./g, '_'),
			value: '',
			enabled: {},
			buckets: null,
			active: true
		};
	}

}
