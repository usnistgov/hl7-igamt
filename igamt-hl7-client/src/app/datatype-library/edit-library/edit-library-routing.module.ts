import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LibSectionComponent} from './section/lib-section.component';
import {LibSectionResolver} from './section/lib-section.resolver';
import {SaveFormsGuard} from "../../guards/save.guard";
import {EditLibraryComponent} from "./edit-library.component";
import {DatatypeLibraryEditResolver} from "./edit-library.resolver";
import {LibErrorComponent} from "./lib-error/lib-error.component";
import {LibErrorResolver} from "./lib-error/lib-error.resolver";
import {DatatypeLibraryMetadataComponent} from "./datatype-library-metadata/datatype-library-metadata.component";
import {LibMetaDataResolver} from "./datatype-library-metadata/datatype-library-metadata.resolver";



@NgModule({
	imports: [
		RouterModule.forChild([
			{
      path: ':libId', resolve: { currentLib: DatatypeLibraryEditResolver }, component:EditLibraryComponent,

				children: [



          { path: 'metadata', component: DatatypeLibraryMetadataComponent, resolve: { metadata : LibMetaDataResolver} ,canDeactivate: [SaveFormsGuard]},
					{ path: 'section/:sectionId', component: LibSectionComponent, resolve: { currentSection : LibSectionResolver}, canDeactivate: [SaveFormsGuard]},
					{ path: '', component: DatatypeLibraryMetadataComponent, resolve: { metadata : LibMetaDataResolver} ,canDeactivate: [SaveFormsGuard]},
					{ path: 'datatype', loadChildren: './datatype-edit/lib-datatype-edit.module#LibDatatypeEditModule' },
					{ path: 'error', component: LibErrorComponent , resolve:{error : LibErrorResolver}},

				]
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class DatatypeLibraryEditRoutingModule {}
