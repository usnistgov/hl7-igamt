import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {IgDocumentEditComponent} from './igdocument-edit.component';
import {IgDocumentMetadataComponent} from './igdocument-metadata/igdocument-metadata.component';
import {SectionComponent} from './section/section.component';
import {IgdocumentEditResolver} from "./igdocument-edit.resolver";
import {SectionResolver} from "./section/sectionResolver.resolver"

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: ':igId', resolve:{currentIg:IgdocumentEditResolver}, component: IgDocumentEditComponent,
        children: [
          { path: 'igdocument-metadata', component: IgDocumentMetadataComponent },
          { path: "section/:sectionId", component: SectionComponent,resolve:{SectionResolver} },
          { path: '', component: IgDocumentMetadataComponent },
          { path: 'segment', loadChildren: './segment-edit/segment-edit.module#SegmentEditModule' }
          // { path: 'datatype', loadChildren: './datatype-edit/datatype-edit.module#DatatypeEditModule' }

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
