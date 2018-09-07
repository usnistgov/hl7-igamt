/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {LibDatatypeEditStructureComponent} from "./datatype-structure/lib-datatype-edit-structure.component";
import {LibDatatypeEditConformanceStatementsComponent} from "./datatype-conformancestatements/lib-datatype-edit-conformancestatements.component";
import {LibDatatypeEditMetadataComponent} from "./datatype-metadata/lib-datatype-edit-metadata.component";
import {LibDatatypeEditPredefComponent} from "./datatype-predef/lib-datatype-edit-predef.component";
import {LibDatatypeEditPostdefComponent} from "./datatype-postdef/lib-datatype-edit-postdef.component";
import {LibDatatypeCrossRefComponent} from "./datatype-cross-ref/lib-datatype-cross-ref.component";
import {LibDatatypeCrossRefResolver} from "./datatype-cross-ref/lib-datatype-cross-ref.resolver";
import {SaveFormsGuard} from "../../../guards/save.guard";
import {LibDatatypeEditPostdefResolver} from './datatype-postdef/lib-datatype-edit-postdef.resolver';
import {LibDatatypeEditPredefResolver} from './datatype-predef/lib-datatype-edit-predef.resolver';
import {LibDatatypeEditMetadataResolver} from './datatype-metadata/lib-datatype-edit-metadata.resolver';
import {LibDatatypeEditStructureResolver} from './datatype-structure/lib-datatype-edit-structure.resolver';
import {LibDatatypeEditConformanceStatementsResolver} from './datatype-conformancestatements/lib-datatype-edit-conformancestatements.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':datatypeId',
            component: LibDatatypeEditStructureComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypeStructure: LibDatatypeEditStructureResolver}
        },
        {
            path: ':datatypeId/metadata',
            component: LibDatatypeEditMetadataComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypeMetadata: LibDatatypeEditMetadataResolver}
        },
        {
            path: ':datatypeId/preDef',
            component: LibDatatypeEditPredefComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypePredef: LibDatatypeEditPredefResolver}
        },
        {
            path: ':datatypeId/postDef',
            component: LibDatatypeEditPostdefComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypePostdef: LibDatatypeEditPostdefResolver}
        },
        {
            path: ':datatypeId/structure',
            component: LibDatatypeEditStructureComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypeStructure: LibDatatypeEditStructureResolver}
        },
        {
            path: ':datatypeId/conformanceStatement',
            component: LibDatatypeEditConformanceStatementsComponent,
            canDeactivate: [SaveFormsGuard],
            resolve: {datatypeConformanceStatements: LibDatatypeEditConformanceStatementsResolver}
        },
      {
        path: ':datatypeId/crossRef', component: LibDatatypeCrossRefComponent,resolve: { refs : LibDatatypeCrossRefResolver}
      }

    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LibDatatypeEditRoutingModule {}
