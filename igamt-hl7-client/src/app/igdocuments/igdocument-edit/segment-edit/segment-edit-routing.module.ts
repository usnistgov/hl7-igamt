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
import {SegmentEditStructureResolver} from "./segment-structure/segment-edit-structure.resolver";
import {SegmentEditPredefResolver} from "./segment-predef/segment-edit-predef.resolver";
import {SegmentEditPostdefResolver} from "./segment-postdef/segment-edit-postdef.resolver";
import {SegmentEditConformanceStatementsResolver} from "./segment-conformancestatements/segment-edit-conformancestatements.resolver";

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':segmentId', component: SegmentEditStructureComponent,  resolve: { segmentStructure : SegmentEditStructureResolver}
        },
        {
            path: ':segmentId/metadata', component: SegmentEditMetadataComponent,  resolve: { segmentMetadata : SegmentEditMetadatResolver}
        },
        {
            path: ':segmentId/preDef', component: SegmentEditPredefComponent,  resolve: { segmentPredef : SegmentEditPredefResolver}
        },
        {
            path: ':segmentId/structure', component: SegmentEditStructureComponent,  resolve: { segmentStructure : SegmentEditStructureResolver}
        },
        {
            path: ':segmentId/postDef', component: SegmentEditPostdefComponent,  resolve: { segmentPostdef : SegmentEditPostdefResolver}
        },
        {
            path: ':segmentId/conformanceStatement', component: SegmentEditConformanceStatementsComponent,  resolve: { segmentConformanceStatements : SegmentEditConformanceStatementsResolver}
        }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SegmentEditRoutingModule {}
