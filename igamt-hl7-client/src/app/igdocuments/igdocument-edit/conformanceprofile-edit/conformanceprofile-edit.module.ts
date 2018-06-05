import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ConformanceprofileEditMetadataComponent} from "./conformanceprofile-metadata/conformanceprofile-edit-metadata.component";
import {ConformanceprofileEditRoutingModule} from "./conformanceprofile-edit-routing.module";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {TreeTableModule} from "primeng/components/treetable/treetable";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/components/dialog/dialog";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {ButtonModule} from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';
import {UtilsModule} from "../../../utils/utils.module";
import {ConformanceprofileEditMetadatResolver} from "./conformanceprofile-metadata/conformanceprofile-edit-metadata.resolver";
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {MessageModule} from 'primeng/message';
import {ConformanceprofileEditPostdefResolver} from "./conformanceprofile-postdef/conformanceprofile-edit-postdef.resolver";
import {ConformanceprofileEditPostdefComponent} from "./conformanceprofile-postdef/conformanceprofile-edit-postdef.component";
import {ConformanceprofileEditPredefResolver} from "./conformanceprofile-predef/conformanceprofile-edit-predef.resolver";
import {ConformanceprofileEditPredefComponent} from "./conformanceprofile-predef/conformanceprofile-edit-predef.component";
import {ConformanceprofileEditStructureResolver} from "./conformanceprofile-structure/conformanceprofile-edit-structure.resolver";
import {ConformanceprofileEditStructureComponent} from "./conformanceprofile-structure/conformanceprofile-edit-structure.component";
import {ConformanceprofileEditConformancestatementsResolver} from "./conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.resolver";
import {ConformanceprofileEditConformancestatementsComponent} from "./conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabMenuModule,
        DialogModule,
        DropdownModule,
        ConformanceprofileEditRoutingModule,
        UtilsModule,
        TreeTableModule,
        ButtonModule,
        AccordionModule,
        SelectButtonModule,
        TableModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        MessageModule
    ],
    providers : [ConformanceprofileEditMetadatResolver, ConformanceprofileEditPostdefResolver, ConformanceprofileEditPredefResolver, ConformanceprofileEditStructureResolver, ConformanceprofileEditConformancestatementsResolver],
    declarations: [ConformanceprofileEditMetadataComponent, ConformanceprofileEditPostdefComponent, ConformanceprofileEditPredefComponent, ConformanceprofileEditStructureComponent, ConformanceprofileEditConformancestatementsComponent],
    schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ConformanceprofileEditModule {}
