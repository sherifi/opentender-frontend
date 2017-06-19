import {Component, Input} from '@angular/core';
import {ApiService} from '../../../services/api.service';

@Component({
	selector: 'tree-view',
	template: `
		<ul class="data-tree-node" *ngIf="obj"> 
			<li *ngFor="let child of obj.childs" id="{{child.id}}">
					<div class="tree-hover">
						<div class="tree-node" (click)="child.expanded = !child.expanded">
							<span class="tree-node-title"*ngIf="child.name">{{ child.name }}</span> 
							<span class="tree-node-type" *ngIf="child.type">{{child.type}}</span>
							<span *ngIf="(child.childs.length>0 || child.obj.enum)">
								<i *ngIf="!child.expanded" class="icon-chevron-down"></i>
								<i *ngIf="child.expanded" class="icon-chevron-up"></i>
							</span>
						</div>
						<div class="tree-node-desc" *ngIf="child.obj.description">{{child.obj.description}}</div>
						<div class="tree-node-ref" *ngIf="child.ref">see <a pageScroll="#{{child.ref.id}}">{{child.ref.title}}</a></div>
					</div>
					<div *ngIf="(child.childs.length>0 || child.obj.enum) && child.expanded"> 
						<div class="tree-node-enum" *ngIf="child.obj.enum">{{child.obj.enum.join(', ')}}</div>
						<tree-view [obj]="child"></tree-view>
					</div> 
				</li> 
		</ul>
`
})
export class TreeViewComponent {
	@Input() obj: any;
}

@Component({
	moduleId: __filename,
	selector: 'dataformat',
	templateUrl: 'dataformat.template.html'
})
export class AboutDataformatPage {
	schema: any;

	constructor(private api: ApiService) {
	}

	ngOnInit(): void {
		this.api.getSchema().subscribe(
			(data: any) => this.display(data),
			error => console.log(error),
			() => {
				// console.log('schema complete');
			});
	}

	findRef(ref, root): any {
		const r = ref.split('/')[2];
		if (root.definitions[r]) {
			return root.definitions[r];
		}
		console.error('Ref not found ' + ref);
		return {
			type: 'error',
			description: 'Ref not found ' + ref
		};
	}

	build(obj, name, id, root): any {
		let result = {
			id: id,
			name: name,
			obj: obj,
			expanded: true,
			type: obj.enum ? 'enum' : obj.type,
			ref: null,
			childs: []
		};
		if (obj.$ref) {
			result.ref = this.findRef(obj.$ref, root);
			if (!result.type) {
				result.type = result.ref.enum ? 'enum' : result.ref.type;
			}
		}
		if (obj.items) {
			let child = this.build(obj.items, obj.items.title, null, root);
			result.childs.push(child);
			child.type = '[' + child.type + ']';
		}
		if (obj.properties) {
			Object.keys(obj.properties).forEach(key => {
				result.childs.push(this.build(obj.properties[key], key, null, root));
			});
		}
		return result;
	}

	display(data: any) {
		let childs = [];
		Object.keys(data.definitions).forEach(key => {
			let d = data.definitions[key];
			d.id = key;
			childs.push(this.build(d, d.title, key, data));
		});
		childs.push(this.build(data, data.title, null, data));
		childs.forEach(c => c.expanded = false);
		this.schema = {
			childs: childs.reverse()
		};
	}

}
