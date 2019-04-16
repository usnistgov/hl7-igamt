import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {DatatypeLibraryCreateComponent} from "./datatype-library-create.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: DatatypeLibraryCreateComponent,

			}
		])
	],
	exports: [
		RouterModule
	]
})
export class CreateLibraryRoutingModule {}
