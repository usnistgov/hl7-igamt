/**
 * Created by hnt5 on 10/23/17.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DatatypeEditRoutingModule} from "./datatype-edit-routing.module";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {TreeTableModule} from "primeng/components/treetable/treetable";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/components/dialog/dialog";
import {DropdownModule} from "primeng/components/dropdown/dropdown";

import {UtilsModule} from "../../../utils/utils.module";
import {ButtonModule} from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';

import {DatatypeEditStructureComponent} from "./datatype-structure/datatype-edit-structure.component";
import {DatatypeEditConformanceStatementsComponent} from "./datatype-conformancestatements/datatype-edit-conformancestatements.component";
import {DatatypeEditMetadataComponent} from "./datatype-metadata/datatype-edit-metadata.component";
import {DatatypeEditPostdefComponent} from "./datatype-postdef/datatype-edit-postdef.component";
import {DatatypeEditPredefComponent} from "./datatype-predef/datatype-edit-predef.component";

import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabMenuModule,
    DialogModule,
    DropdownModule,
    DatatypeEditRoutingModule,
    UtilsModule,
    TreeTableModule,
    ButtonModule,
    AccordionModule,
    SelectButtonModule,
    TableModule,
      FroalaEditorModule.forRoot(),
      FroalaViewModule.forRoot()
  ],
  providers : [],
  declarations: [DatatypeEditStructureComponent, DatatypeEditConformanceStatementsComponent, DatatypeEditMetadataComponent, DatatypeEditPostdefComponent, DatatypeEditPredefComponent],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DatatypeEditModule {}
