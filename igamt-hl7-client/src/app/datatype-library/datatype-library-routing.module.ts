import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
	imports: [
		RouterModule.forChild([
      { path: 'datatype-libraries', loadChildren: './library-list/library-list.module#LibraryListModule' },
      { path: 'create', loadChildren: './create-library/create-library.module#CreateLibraryModule' },

      { path: 'evolution', redirectTo : './datatype-evolution/datatype-evolution.module#DatatypeEvolutionModule'}
		])
	],
	exports: [
		RouterModule
	]
})
export class DatatypeLibraryRoutingModule {

}
