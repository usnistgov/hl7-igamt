import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {DeltaComponent} from './delta.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path:'',component: DeltaComponent}
		])
	],
	exports: [
		RouterModule
	]
})
export class DeltaRoutingModule {}
