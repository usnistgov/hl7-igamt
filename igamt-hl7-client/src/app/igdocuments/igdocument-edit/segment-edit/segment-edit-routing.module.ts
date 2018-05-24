/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {SegmentEditMetadataComponent} from "./segment-metadata/segment-edit-metadata.component";
import {SegmentEditPredefComponent} from "./segment-predef/segment-edit-predef.component";
import {SegmentEditPostdefComponent} from "./segment-postdef/segment-edit-postdef.component";
import {SegmentEditStructureComponent} from "./segment-structure/segment-edit-structure.component";
import {SegmentEditConformanceStatementsComponent} from "./segment-conformancestatements/segment-edit-conformancestatements.component";
import {SegmentEditMetadatResolver} from "./segment-metadata/segment-edit-metadata.resolver";
import {SaveFormsGuard} from "../../../guards/save.guard";

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':segmentId'
        },
        {
            path: ':segmentId/metadata', component: SegmentEditMetadataComponent,  canDeactivate: [SaveFormsGuard] ,resolve: { segmentMetadata : SegmentEditMetadatResolver}
        },
        {
            path: ':segmentId/preDef', component: SegmentEditPredefComponent,
        },
        {
            path: ':segmentId/structure', component: SegmentEditStructureComponent,
        },
        {
            path: ':segmentId/postDef', component: SegmentEditPostdefComponent,
        },
        {
            path: ':segmentId/conformanceStatement', component: SegmentEditConformanceStatementsComponent,
        },{
        path:'',component: SegmentEditStructureComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SegmentEditRoutingModule {}
