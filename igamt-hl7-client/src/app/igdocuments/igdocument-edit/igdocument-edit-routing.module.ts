import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IgDocumentEditComponent} from './igdocument-edit.component';
import {IgDocumentMetadataComponent} from './igdocument-metadata/igdocument-metadata.component';
import {SectionComponent} from './section/section.component';
import {IgdocumentEditResolver} from './igdocument-edit.resolver';
import {SectionResolver} from './section/sectionResolver.resolver';
import {IgMetaDataResolver} from './igdocument-metadata/IgMetaDataResolver.resolver';
import {SaveFormsGuard} from "../../guards/save.guard";
import { IgErrorComponent } from './ig-error/ig-error.component';
import { IgErrorResolver } from './ig-error/ig-error.resolver';



@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: ':igId', resolve: { currentIg: IgdocumentEditResolver }, component: IgDocumentEditComponent,
				children: [
					{ path: 'metadata', component: IgDocumentMetadataComponent, resolve: { metadata : IgMetaDataResolver} ,canDeactivate: [SaveFormsGuard] },
					{ path: 'section/:sectionId', component: SectionComponent, resolve: { currentSection : SectionResolver}, canDeactivate: [SaveFormsGuard]},
					{ path: '', component: IgDocumentMetadataComponent, resolve: { metadata : IgMetaDataResolver} ,canDeactivate: [SaveFormsGuard]},
					{ path: 'segment', loadChildren: './segment-edit/segment-edit.module#SegmentEditModule' },
					{ path: 'datatype', loadChildren: './datatype-edit/datatype-edit.module#DatatypeEditModule' },
					{ path: 'error', component: IgErrorComponent , resolve:{error : IgErrorResolver}},
					{ path: 'valueset', loadChildren: './valueset-edit/valueset-edit.module#ValuesetEditModule' },
					{ path: 'conformanceprofile', loadChildren: './conformanceprofile-edit/conformanceprofile-edit.module#ConformanceprofileEditModule' }
				]
			},
			// {
			//   path : '**',
			//   redirectTo: '/'
			// }
		])
	],
	exports: [
		RouterModule
	]
})
export class IgDocumentEditRoutingModule {}
