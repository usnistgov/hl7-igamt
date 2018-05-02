/**
 * Created by hnt5 on 10/23/17.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SegmentEditMetadataComponent} from "./segment-metadata/segment-edit-metadata.component";
import {SegmentEditStructureComponent} from "./segment-structure/segment-edit-structure.component";
import {SegmentEditPredefComponent} from "./segment-predef/segment-edit-predef.component";
import {SegmentEditPostdefComponent} from "./segment-postdef/segment-edit-postdef.component";
import {SegmentEditRoutingModule} from "./segment-edit-routing.module";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {TreeTableModule} from "primeng/components/treetable/treetable";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/components/dialog/dialog";
import {DropdownModule} from "primeng/components/dropdown/dropdown";

import {UtilsModule} from "../../../utils/utils.module";
import {SegmentMetadataResolver} from "./segment-metadata.resolver";
import {SegmentStructureResolver} from "./segment-structure.resolver";
import {SegmentPredefResolver} from "./segment-predef.resolver";
import {SegmentPostdefResolver} from "./segment-postdef.resolver";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabMenuModule,
    DialogModule,
    DropdownModule,
    SegmentEditRoutingModule,
    UtilsModule,
    TreeTableModule
  ],
  providers : [SegmentMetadataResolver, SegmentStructureResolver, SegmentPredefResolver, SegmentPostdefResolver],
  declarations: [SegmentEditMetadataComponent, SegmentEditStructureComponent, SegmentEditPredefComponent, SegmentEditPostdefComponent],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SegmentEditModule {}
