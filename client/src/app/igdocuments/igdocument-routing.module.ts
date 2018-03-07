import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
	imports: [
		RouterModule.forChild([
      { path: 'igdocuments-list', loadChildren: './igdocument-list/igdocument-list.module#IgDocumentListModule' },
      { path: 'igdocuments-edit', loadChildren: './igdocument-edit/igdocument-edit.module#IgDocumentEditModule' },
      { path: 'create', loadChildren: './igdocument-create/igdocument-create.module#IgDocumentCreateModule' },

      { path: '', redirectTo : 'igdocuments-list'}
		])
	],
	exports: [
		RouterModule
	]
})
export class IgDocumentRoutingModule {}
