/**
 * Created by hnt5 on 10/23/17.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ValuesetEditRoutingModule} from "./valueset-edit-routing.module";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {TreeTableModule} from "primeng/components/treetable/treetable";
import {FieldsetModule} from 'primeng/fieldset';
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/components/dialog/dialog";
import {DropdownModule} from "primeng/components/dropdown/dropdown";

import {UtilsModule} from "../../../utils/utils.module";
import {ButtonModule} from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';


import {ValuesetEditMetadataComponent} from "./valueset-metadata/valueset-edit-metadata.component";
import {ValuesetEditPostdefComponent} from "./valueset-postdef/valueset-edit-postdef.component";
import {ValuesetEditPredefComponent} from "./valueset-predef/valueset-edit-predef.component";
import {ValuesetEditStructureComponent} from "./valueset-structure/valueset-edit-structure.component";

import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {MessageModule} from "primeng/components/message/message";
import {NamingConventionModule} from "../../../common/naming-convention/naming-convention.module";

import {ValuesetsService} from "./valueSets.service";
import {ValuesetCrossRefComponent} from "./valueset-cross-ref/valueset-cross-ref.component";
import {ValuesetCrossRefResolver} from "./valueset-cross-ref/valueset-cross-ref.resolver";
// import {ValuesetCrossRefComponent } from './valueset-cross-ref/valueset-cross-ref.component';
// import {ValuesetCrossRefResolver} from "./valueset-cross-ref/valueset-cross-ref.resolver";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabMenuModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    ValuesetEditRoutingModule,
    UtilsModule,
    TreeTableModule,
    ButtonModule,
    AccordionModule,
    SelectButtonModule,
    TableModule,
    MessageModule,
    NamingConventionModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers : [ValuesetsService,ValuesetCrossRefResolver],
  declarations: [ValuesetEditMetadataComponent, ValuesetEditPostdefComponent, ValuesetEditPredefComponent,ValuesetEditStructureComponent, ValuesetCrossRefComponent],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ValuesetEditModule {}
