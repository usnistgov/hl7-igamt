/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {DatatypeEditStructureComponent} from "./datatype-structure/datatype-edit-structure.component";
import {DatatypeEditConformanceStatementsComponent} from "./datatype-conformancestatements/datatype-edit-conformancestatements.component";

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':datatypeId', component: DatatypeEditStructureComponent,
        },
        {
            path: ':datatypeId/structure', component: DatatypeEditStructureComponent,
        },
        // {
        //     path: ':datatypeId/metadata', component: DatatypeEditMetadataComponent,
        // },
        // {
        //     path: ':datatypeId/preDef', component: DatatypeEditPredefComponent,
        // },
        // {
        //     path: ':datatypeId/postDef', component: DatatypeEditPostdefComponent,
        // },
        {
            path: ':datatypeId/conformanceStatement', component: DatatypeEditConformanceStatementsComponent,
        }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class DatatypeEditRoutingModule {}
