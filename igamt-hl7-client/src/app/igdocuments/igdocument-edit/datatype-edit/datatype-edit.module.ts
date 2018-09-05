/**
 * Created by hnt5 on 10/23/17.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DatatypeEditRoutingModule} from "./datatype-edit-routing.module";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
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
import {MessageModule} from "primeng/components/message/message";
import {NamingConventionModule} from "../../../common/naming-convention/naming-convention.module";
import { DatatypeCrossRefComponent } from './datatype-cross-ref/datatype-cross-ref.component';
import {DatatypeCrossRefResolver} from "./datatype-cross-ref/datatype-cross-ref.resolver";
import {DatatypesService} from "./datatypes.service";

import {DatatypeEditPostdefResolver} from "./datatype-postdef/datatype-edit-postdef.resolver";
import {DatatypeEditPredefResolver} from "./datatype-predef/datatype-edit-predef.resolver";
import {DatatypeEditMetadataResolver} from "./datatype-metadata/datatype-edit-metadata.resolver";
import {DatatypeEditStructureResolver} from "./datatype-structure/datatype-edit-structure.resolver";
import {DatatypeEditConformanceStatementsResolver} from "./datatype-conformancestatements/datatype-edit-conformancestatements.resolver";
import {MultiSelectModule} from 'primeng/multiselect';


import {TreeTableModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabMenuModule,
    DialogModule,
    DropdownModule,
    DatatypeEditRoutingModule,
    UtilsModule,
    ButtonModule,
    TreeTableModule,
    AccordionModule,
    SelectButtonModule,
    TableModule,
    MessageModule,

    NamingConventionModule,
    MultiSelectModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers : [DatatypeCrossRefResolver,DatatypesService, DatatypeEditPostdefResolver, DatatypeEditPredefResolver, DatatypeEditMetadataResolver, DatatypeEditStructureResolver, DatatypeEditConformanceStatementsResolver],
  declarations: [DatatypeEditStructureComponent, DatatypeEditConformanceStatementsComponent, DatatypeEditMetadataComponent, DatatypeEditPostdefComponent, DatatypeEditPredefComponent, DatatypeCrossRefComponent],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DatatypeEditModule {}
