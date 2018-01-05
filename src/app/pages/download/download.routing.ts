import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DownloadPage} from './download.component';

const routes: Routes = [
	{path: '', component: DownloadPage}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
