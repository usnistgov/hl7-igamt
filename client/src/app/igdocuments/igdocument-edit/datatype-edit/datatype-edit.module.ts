/**
 * Created by hnt5 on 10/23/17.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";

import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/components/dialog/dialog";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {UtilsModule} from "../../../utils/utils.module";
import {DatatypeEditComponent} from "./datatype-edit.component";
import {DatatypeGuard} from "./datatype-edit.guard";
import {DatatypeEditRoutingModule} from "./datatype-edit-routing.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabMenuModule,
    DialogModule,
    DropdownModule,
    UtilsModule,
    DatatypeEditRoutingModule
  ],
  providers : [ DatatypeGuard ],
  declarations: [
    DatatypeEditComponent
  ],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DatatypeEditModule {}
