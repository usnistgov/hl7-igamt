import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {DatatypeLibraryComponent} from "./datatype-library.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{path:'',component: DatatypeLibraryComponent}
		])
	],
	exports: [
		RouterModule
	]
})
export class DatatypeLibraryRoutingModule {}
