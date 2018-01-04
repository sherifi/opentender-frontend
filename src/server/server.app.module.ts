import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {AppComponent} from '../app/app.component';
import {MainModule} from './server.module';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';

@NgModule({
	bootstrap: [AppComponent],
	imports: [
		MainModule,
		ServerModule,
		ModuleMapLoaderModule
	]
})
export class ServerAppModule {
}
