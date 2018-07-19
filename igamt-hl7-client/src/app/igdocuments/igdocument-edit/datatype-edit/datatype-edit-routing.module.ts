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
import {SaveFormsGuard} from "../../../guards/save.guard";

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':datatypeId', component: DatatypeEditStructureComponent,canDeactivate: [SaveFormsGuard]
        },
        {
            path: ':datatypeId/structure', component: DatatypeEditStructureComponent,canDeactivate: [SaveFormsGuard]
        },
        {
            path: ':datatypeId/metadata', component: DatatypeEditMetadataComponent,canDeactivate: [SaveFormsGuard]
        },
        {
            path: ':datatypeId/preDef', component: DatatypeEditPredefComponent,canDeactivate: [SaveFormsGuard]
        },
        {
            path: ':datatypeId/postDef', component: DatatypeEditPostdefComponent,canDeactivate: [SaveFormsGuard]
        },
        {
            path: ':datatypeId/conformanceStatement', component: DatatypeEditConformanceStatementsComponent,canDeactivate: [SaveFormsGuard]
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
