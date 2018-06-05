/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {ConformanceprofileEditMetadataComponent} from "./conformanceprofile-metadata/conformanceprofile-edit-metadata.component";
import {ConformanceprofileEditMetadatResolver} from "./conformanceprofile-metadata/conformanceprofile-edit-metadata.resolver";
import {SaveFormsGuard} from "../../../guards/save.guard";
import {ConformanceprofileEditPostdefComponent} from "./conformanceprofile-postdef/conformanceprofile-edit-postdef.component";
import {ConformanceprofileEditPostdefResolver} from "./conformanceprofile-postdef/conformanceprofile-edit-postdef.resolver";
import {ConformanceprofileEditPredefComponent} from "./conformanceprofile-predef/conformanceprofile-edit-predef.component";
import {ConformanceprofileEditPredefResolver} from "./conformanceprofile-predef/conformanceprofile-edit-predef.resolver";
import {ConformanceprofileEditStructureComponent} from "./conformanceprofile-structure/conformanceprofile-edit-structure.component";
import {ConformanceprofileEditStructureResolver} from "./conformanceprofile-structure/conformanceprofile-edit-structure.resolver";

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':conformanceprofileId', component: ConformanceprofileEditStructureComponent,  canDeactivate: [SaveFormsGuard],  resolve: { conformanceprofileStructure : ConformanceprofileEditStructureResolver}
        },
        {
            path: ':conformanceprofileId/metadata', component: ConformanceprofileEditMetadataComponent,  canDeactivate: [SaveFormsGuard] ,resolve: { conformanceprofileMetadata : ConformanceprofileEditMetadatResolver}
        },
        {
            path: ':conformanceprofileId/postDef', component: ConformanceprofileEditPostdefComponent,  canDeactivate: [SaveFormsGuard],  resolve: { conformanceprofilePostdef : ConformanceprofileEditPostdefResolver}
        },
        {
            path: ':conformanceprofileId/preDef', component: ConformanceprofileEditPredefComponent,  canDeactivate: [SaveFormsGuard],  resolve: { conformanceprofilePredef : ConformanceprofileEditPredefResolver}
        },
        {
            path: ':conformanceprofileId/structure', component: ConformanceprofileEditStructureComponent,  canDeactivate: [SaveFormsGuard],  resolve: { conformanceprofileStructure : ConformanceprofileEditStructureResolver}
        }
        // {
        //     path: ':segmentId/conformanceStatement', component: SegmentEditConformanceStatementsComponent,  canDeactivate: [SaveFormsGuard],  resolve: { segmentConformanceStatements : SegmentEditConformanceStatementsResolver}
        // }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ConformanceprofileEditRoutingModule {}
