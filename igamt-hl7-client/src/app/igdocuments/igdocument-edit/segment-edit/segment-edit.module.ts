/**
 * Created by hnt5 on 10/23/17.
 */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SegmentEditMetadataComponent} from "./segment-metadata/segment-edit-metadata.component";
import {SegmentEditStructureComponent} from "./segment-structure/segment-edit-structure.component";
import {SegmentEditConformanceStatementsComponent} from "./segment-conformancestatements/segment-edit-conformancestatements.component";
import {SegmentEditPredefComponent} from "./segment-predef/segment-edit-predef.component";
import {SegmentEditPostdefComponent} from "./segment-postdef/segment-edit-postdef.component";
import {SegmentEditRoutingModule} from "./segment-edit-routing.module";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {TreeTableModule} from "primeng/components/treetable/treetable";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "primeng/components/dialog/dialog";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {ButtonModule} from 'primeng/button';
import {FieldsetModule} from 'primeng/fieldset';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';
import {UtilsModule} from "../../../utils/utils.module";
import {SegmentEditMetadatResolver} from "./segment-metadata/segment-edit-metadata.resolver";
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {MessageModule} from 'primeng/message';
import {SegmentEditStructureResolver} from "./segment-structure/segment-edit-structure.resolver";
import {SegmentEditPredefResolver} from "./segment-predef/segment-edit-predef.resolver";
import {SegmentEditPostdefResolver} from "./segment-postdef/segment-edit-postdef.resolver";
import {SegmentEditConformanceStatementsResolver} from "./segment-conformancestatements/segment-edit-conformancestatements.resolver";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabMenuModule,
        DialogModule,
        DropdownModule,
        SegmentEditRoutingModule,
        UtilsModule,
        TreeTableModule,
        FieldsetModule,
        ButtonModule,
        AccordionModule,
        SelectButtonModule,
        TableModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        MessageModule
    ],
    providers : [SegmentEditMetadatResolver, SegmentEditStructureResolver, SegmentEditPredefResolver, SegmentEditPostdefResolver, SegmentEditConformanceStatementsResolver],
    declarations: [SegmentEditMetadataComponent, SegmentEditStructureComponent, SegmentEditPredefComponent, SegmentEditPostdefComponent, SegmentEditConformanceStatementsComponent],
    schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SegmentEditModule {}
