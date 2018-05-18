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

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':segmentId', component: SegmentEditStructureComponent,
        },
        {
            path: ':segmentId/metadata', component: SegmentEditMetadataComponent,
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
        }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SegmentEditRoutingModule {}
