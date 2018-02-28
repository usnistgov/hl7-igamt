import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ConfigurationComponent} from './configuration.compronent';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path:'',component: ConfigurationComponent}
		])
	],
	exports: [
		RouterModule
	]
})
export class ConfigurationRoutingModule {}
