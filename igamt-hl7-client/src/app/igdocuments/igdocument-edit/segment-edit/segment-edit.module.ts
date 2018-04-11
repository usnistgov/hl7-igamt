/**
 * Created by hnt5 on 10/23/17.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SegmentEditComponent} from "./segment-edit.component";
import {SegmentEditRoutingModule} from "./segment-edit-routing.module";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/components/dialog/dialog";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {SegmentGuard} from "./segment-edit.guard";
import {UtilsModule} from "../../../utils/utils.module";
import {CanDeactivateGuard} from "./segment-can-desactivate.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabMenuModule,
    DialogModule,
    DropdownModule,
    SegmentEditRoutingModule,
    UtilsModule
  ],
  providers : [ SegmentGuard,CanDeactivateGuard ],
  declarations: [
    SegmentEditComponent
  ],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SegmentEditModule {}
