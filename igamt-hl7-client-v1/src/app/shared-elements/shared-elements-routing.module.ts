import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {SharedElementsComponent} from './shared-elements.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path:'',component: SharedElementsComponent}
		])
	],
	exports: [
		RouterModule
	]
})
export class SharedElementsRoutingModule {}
