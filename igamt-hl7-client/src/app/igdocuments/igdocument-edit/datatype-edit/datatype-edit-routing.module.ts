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
import {DatatypeEditPostdefResolver} from './datatype-postdef/datatype-edit-postdef.resolver';
import {DatatypeEditPredefResolver} from './datatype-predef/datatype-edit-predef.resolver';
import {DatatypeEditMetadataResolver} from './datatype-metadata/datatype-edit-metadata.resolver';
import {DatatypeEditStructureResolver} from './datatype-structure/datatype-edit-structure.resolver';
import {DatatypeEditConformanceStatementsResolver} from './datatype-conformancestatements/datatype-edit-conformancestatements.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':datatypeId',
            component: DatatypeEditStructureComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypeStructure: DatatypeEditStructureResolver}
        },
        {
            path: ':datatypeId/metadata',
            component: DatatypeEditMetadataComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypeMetadata: DatatypeEditMetadataResolver}
        },
        {
            path: ':datatypeId/preDef',
            component: DatatypeEditPredefComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypePredef: DatatypeEditPredefResolver}
        },
        {
            path: ':datatypeId/postDef',
            component: DatatypeEditPostdefComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypePostdef: DatatypeEditPostdefResolver}
        },
        {
            path: ':datatypeId/structure',
            component: DatatypeEditStructureComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypeStructure: DatatypeEditStructureResolver}
        },
        {
            path: ':datatypeId/conformanceStatement',
            component: DatatypeEditConformanceStatementsComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypeConformanceStatements: DatatypeEditConformanceStatementsResolver, datatypeStructure: DatatypeEditStructureResolver}
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
