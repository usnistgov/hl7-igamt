/**
 * Created by hnt5 on 10/23/17.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LibDatatypeEditRoutingModule} from "./lib-datatype-edit-routing.module";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/components/dialog/dialog";
import {DropdownModule} from "primeng/components/dropdown/dropdown";

import {UtilsModule} from "../../../utils/utils.module";
import {ButtonModule} from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';

import {LibDatatypeEditStructureComponent} from "./datatype-structure/lib-datatype-edit-structure.component";
import {LibDatatypeEditConformanceStatementsComponent} from "./datatype-conformancestatements/lib-datatype-edit-conformancestatements.component";
import {LibDatatypeEditMetadataComponent} from "./datatype-metadata/lib-datatype-edit-metadata.component";
import {LibDatatypeEditPostdefComponent} from "./datatype-postdef/lib-datatype-edit-postdef.component";
import {LibDatatypeEditPredefComponent} from "./datatype-predef/lib-datatype-edit-predef.component";

import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {MessageModule} from "primeng/components/message/message";
import {NamingConventionModule} from "../../../common/naming-convention/naming-convention.module";
import { LibDatatypeCrossRefComponent } from './datatype-cross-ref/lib-datatype-cross-ref.component';
import {LibDatatypeCrossRefResolver} from "./datatype-cross-ref/lib-datatype-cross-ref.resolver";
import {LibDatatypesService} from "./lib-datatypes.service";

import {LibDatatypeEditPostdefResolver} from "./datatype-postdef/lib-datatype-edit-postdef.resolver";
import {LibDatatypeEditPredefResolver} from "./datatype-predef/lib-datatype-edit-predef.resolver";
import {LibDatatypeEditMetadataResolver} from "./datatype-metadata/lib-datatype-edit-metadata.resolver";
import {LibDatatypeEditStructureResolver} from "./datatype-structure/lib-datatype-edit-structure.resolver";
import {LibDatatypeEditConformanceStatementsResolver} from "./datatype-conformancestatements/lib-datatype-edit-conformancestatements.resolver";
import {TreeTableModule} from 'primeng/primeng';
import {LibraryExportService} from "../service/lib-export.service";
import {MultiSelectModule} from "primeng/components/multiselect/multiselect";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabMenuModule,
    DialogModule,
    DropdownModule,
    LibDatatypeEditRoutingModule,
    UtilsModule,
    TreeTableModule,
    ButtonModule,
    AccordionModule,
    SelectButtonModule,
    TableModule,
    MessageModule,
    NamingConventionModule,
    MultiSelectModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers : [LibDatatypeCrossRefResolver,LibDatatypesService, LibDatatypeEditPostdefResolver, LibDatatypeEditPredefResolver, LibDatatypeEditMetadataResolver, LibDatatypeEditStructureResolver, LibDatatypeEditConformanceStatementsResolver,LibraryExportService],
  declarations: [LibDatatypeEditStructureComponent, LibDatatypeEditConformanceStatementsComponent, LibDatatypeEditMetadataComponent, LibDatatypeEditPostdefComponent, LibDatatypeEditPredefComponent, LibDatatypeCrossRefComponent],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LibDatatypeEditModule {}

