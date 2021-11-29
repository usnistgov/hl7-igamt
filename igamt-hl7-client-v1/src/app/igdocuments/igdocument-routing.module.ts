import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {IgDocumentListComponent} from "./igdocument-list/igdocument-list.component";
import {Igsresolver} from "./igdocument-list/igs.resolver";

@NgModule({
	imports: [
		RouterModule.forChild([


      { path: 'list', component:IgDocumentListComponent,    resolve:{
        igList: Igsresolver

      },runGuardsAndResolvers: "always"},
      { path: 'create', loadChildren: './igdocument-create/igdocument-create.module#IgDocumentCreateModule' },
    ])
	],
	exports: [
		RouterModule
	]
})
export class IgDocumentRoutingModule {

}
