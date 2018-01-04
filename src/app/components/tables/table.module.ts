import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableComponent} from './table.component';
import {TenderTableComponent} from './tender/table-tender.component';
import {AuthorityTableComponent} from './authority/table-authority.component';
import {CompanyTableComponent} from './company/table-company.component';
import {PaginationComponent} from './components/pagination/pagination.component';
import {SelectColumnsButtonComponent} from './components/select-columns-button/select-columns-button.component';
import {SelectColumnsComponent} from './components/select-columns/select-columns.component';
import {GraphModule} from '../graphs/graphs.module';
import {DialogModule} from '../dialog/dialog.module';
import {I18nModule} from '../i18n/i18n.module';
import {RouterModule} from '@angular/router';
import {PipesModule} from '../pipes/pipes.module';
import {FormsModule} from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		GraphModule,
		DialogModule,
		PipesModule,
		I18nModule,
		RouterModule
	],
	declarations: [
		TableComponent,
		TenderTableComponent,
		AuthorityTableComponent,
		CompanyTableComponent,
		PaginationComponent,
		SelectColumnsButtonComponent,
		SelectColumnsComponent
	],
	exports: [
		TableComponent,
		TenderTableComponent,
		AuthorityTableComponent,
		CompanyTableComponent,
		PaginationComponent,
		SelectColumnsButtonComponent,
		SelectColumnsComponent
	]
})
export class TableModule {
}
