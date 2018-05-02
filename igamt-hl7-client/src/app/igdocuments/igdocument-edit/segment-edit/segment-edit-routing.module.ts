/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {SegmentEditMetadataComponent} from "./segment-metadata/segment-edit-metadata.component";
import {SegmentEditPredefComponent} from "./segment-predef/segment-edit-predef.component";
import {SegmentEditPostdefComponent} from "./segment-postdef/segment-edit-postdef.component";
import {SegmentEditStructureComponent} from "./segment-structure/segment-edit-structure.component";
import {SegmentMetadataResolver} from "./segment-metadata.resolver";
import {SegmentStructureResolver} from "./segment-structure.resolver";
import {SegmentPredefResolver} from "./segment-predef.resolver";
import {SegmentPostdefResolver} from "./segment-postdef.resolver";

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: ':segmentId', resolve:{currentSegmentMetadata:SegmentMetadataResolver}, component: SegmentEditMetadataComponent,
        },
        {
            path: ':segmentId/metadata', resolve:{currentSegmentMetadata:SegmentMetadataResolver}, component: SegmentEditMetadataComponent,
        },
        {
            path: ':segmentId/preDef', resolve:{currentSegmentPredef:SegmentPredefResolver}, component: SegmentEditPredefComponent,
        },
        {
            path: ':segmentId/structure', resolve:{currentSegmentStructure:SegmentStructureResolver}, component: SegmentEditStructureComponent,
        },
        {
            path: ':segmentId/postDef', resolve:{currentSegmentPostdef:SegmentPostdefResolver}, component: SegmentEditPostdefComponent,
        }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SegmentEditRoutingModule {}
