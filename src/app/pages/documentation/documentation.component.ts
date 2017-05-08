import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Component({
	moduleId: __filename,
	selector: 'documentation',
	templateUrl: 'documentation.template.html'
})
export class DocumentationPage implements OnInit {
	public isRootPage = false;

	constructor(private router: Router) {
	}

	ngOnInit(): void {
		this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.isRootPage = e.url === '/documentation';
			}
		});
	}
}
