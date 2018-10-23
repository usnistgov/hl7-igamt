import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {EditLibraryComponent} from "./edit-library/edit-library.component";
import {DatatypeLibraryEditResolver} from "./edit-library/edit-library.resolver";
import {LibraryListComponent} from "./library-list/library-list.component";
import {LibraryListResolver} from "./library-list/library-list.resolver";

@NgModule({
	imports: [
		RouterModule.forChild([
      { path: 'list', component:LibraryListComponent,    resolve:{
        libList: LibraryListResolver

       },runGuardsAndResolvers: "always"},
      { path: 'create', loadChildren: './create-library/create-library.module#CreateLibraryModule'},
      {path: 'lib', loadChildren:'./edit-library/edit-library.module#EditLibraryModule'
      },

      { path: 'evolution', loadChildren : './datatype-evolution/datatype-evolution.module#DatatypeEvolutionModule'}
		])
	],
	exports: [
		RouterModule
	]
})
export class DatatypeLibraryRoutingModule {

}
