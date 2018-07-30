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
import {CoConstraintTableComponent} from './coconstraint-table/coconstraint-table.component';
import {RegisterFormModelDirective} from '../../../common/form-directive/register-form-model.directive';
import {CoConstraintTableService} from './coconstraint-table/coconstraint-table.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {CCHeaderDialogDmComponent} from './coconstraint-table/header-dialog/header-dialog-dm.component';
import {CCHeaderDialogUserComponent} from './coconstraint-table/header-dialog/header-dialog-user.component';
import {SegmentTreeComponent} from '../../../common/segment-tree/segment-tree.component';
import {SegmentTreeNodeService} from '../../../common/segment-tree/segment-tree.service';
import {TreeModule} from 'primeng/tree';
import {TocService} from '../service/toc.service';
import {ValueSetBindingPickerComponent} from '../../../common/valueset-binding-picker/valueset-binding-picker.component';
import {DataListModule, DataTableModule, PickListModule} from 'primeng/primeng';
import {DndListModule} from 'ngx-drag-and-drop-lists';
import {SegmentsService} from "./segments.service";
import {MessageService} from "primeng/components/common/messageservice";
import {SegmentCrossRefResolver} from "./segment-cross-ref/segment-cross-ref.resolver";
import {SegmentCrossRefComponent} from "./segment-cross-ref/segment-cross-ref.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabMenuModule,
        DialogModule,
        DropdownModule,
        DndListModule,
        SegmentEditRoutingModule,
        UtilsModule,
        TreeModule,
        TreeTableModule,
        FieldsetModule,
        ButtonModule,
        AccordionModule,
        SelectButtonModule,
        HttpClientModule,
        HttpModule,
      DataTableModule,
      DataListModule,
        TableModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        MessageModule
    ],
  exports:[CoConstraintTableComponent],

    providers : [TocService, SegmentTreeNodeService, CoConstraintTableService, SegmentEditMetadatResolver, SegmentEditStructureResolver, SegmentEditPredefResolver, SegmentEditPostdefResolver, SegmentEditConformanceStatementsResolver, SegmentsService,MessageService,SegmentCrossRefResolver],
    declarations: [ValueSetBindingPickerComponent, SegmentTreeComponent, RegisterFormModelDirective, CoConstraintTableComponent, SegmentEditMetadataComponent, SegmentEditStructureComponent, SegmentEditPredefComponent, SegmentEditPostdefComponent, SegmentEditConformanceStatementsComponent, CCHeaderDialogDmComponent, CCHeaderDialogUserComponent,SegmentCrossRefComponent],
    schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SegmentEditModule {}
