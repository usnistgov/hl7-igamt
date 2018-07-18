/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {DatatypeEditStructureComponent} from "./datatype-structure/datatype-edit-structure.component";
import {DatatypeEditConformanceStatementsComponent} from "./datatype-conformancestatements/datatype-edit-conformancestatements.component";
import {DatatypeEditMetadataComponent} from "./datatype-metadata/datatype-edit-metadata.component";
import {DatatypeEditPredefComponent} from "./datatype-predef/datatype-edit-predef.component";
import {DatatypeEditPostdefComponent} from "./datatype-postdef/datatype-edit-postdef.component";
import {DatatypeCrossRefComponent} from "./datatype-cross-ref/datatype-cross-ref.component";
import {DatatypeCrossRefResolver} from "./datatype-cross-ref/datatype-cross-ref.resolver";

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':datatypeId', component: DatatypeEditStructureComponent,
        },
        {
            path: ':datatypeId/structure', component: DatatypeEditStructureComponent,
        },
        {
            path: ':datatypeId/metadata', component: DatatypeEditMetadataComponent,
        },
        {
            path: ':datatypeId/preDef', component: DatatypeEditPredefComponent,
        },
        {
            path: ':datatypeId/postDef', component: DatatypeEditPostdefComponent,
        },
        {
            path: ':datatypeId/conformanceStatement', component: DatatypeEditConformanceStatementsComponent,
        },
      {
        path: ':datatypeId/crossRef', component: DatatypeCrossRefComponent,resolve: { refs : DatatypeCrossRefResolver}
      }

    ])
  ],
  exports: [
    RouterModule
  ]
})
export class DatatypeEditRoutingModule {}
