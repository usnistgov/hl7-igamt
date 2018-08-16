import {NgModule, CUSTOM_ELEMENTS_SCHEMA}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccordionModule, ButtonModule, TabViewModule, GrowlModule} from 'primeng/primeng';
import {MenubarModule} from "primeng/components/menubar/menubar";
import {TooltipModule} from "primeng/components/tooltip/tooltip";
import {TieredMenuModule} from "primeng/components/tieredmenu/tieredmenu";
import {UtilsModule} from "../../utils/utils.module";
import {TocService} from "./service/toc.service";
import {TreeDragDropService} from "primeng/components/common/treedragdropservice";
import {DragDropModule} from "primeng/components/dragdrop/dragdrop";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ContextMenuModule} from "ngx-contextmenu";
import {PanelModule} from 'primeng/panel';
import {MultiSelectModule} from 'primeng/multiselect';

import {DropdownModule} from 'primeng/dropdown';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import {PanelMenuModule} from 'primeng/panelmenu';
import { ToolbarModule } from 'primeng/primeng';
import {FileUploadModule} from "primeng/components/fileupload/fileupload";
import {ConfirmationService} from "primeng/components/common/confirmationservice";
import {ConfirmDialogModule} from "primeng/components/confirmdialog/confirmdialog";
import {MessageModule} from "primeng/components/message/message";
import {SaveFormsGuard} from "../../guards/save.guard";

import {DialogModule} from 'primeng/dialog';
import {TreeTableModule} from "primeng/components/treetable/treetable";
import {SharedModule} from "primeng/components/common/shared";
import {ModalModule} from "ngx-bootstrap";
import {RadioButtonModule} from "primeng/components/radiobutton/radiobutton";
import {BlockUIModule} from "primeng/components/blockui/blockui";
import {TableModule} from "primeng/components/table/table";

import {SplitButtonModule} from "primeng/components/splitbutton/splitbutton";
import {NamingConventionModule} from "../../common/naming-convention/naming-convention.module";
import {LibErrorComponent} from "./lib-error/lib-error.component";
import {EditLibraryComponent} from "./edit-library.component";
import {DatatypeLibraryMetadataComponent} from "./datatype-library-metadata/datatype-library-metadata.component";
import {LibSectionComponent} from "./section/lib-section.component";
import {DatatypeLibraryEditRoutingModule} from "./edit-library-routing.module";
import {DatatypeLibraryEditResolver} from "./edit-library.resolver";
import {LibSectionResolver} from "./section/lib-section.resolver";
import {LibMetaDataResolver} from "./datatype-library-metadata/datatype-library-metadata.resolver";
import {EditLibraryService} from "./edit-library.service";
import {LibErrorService} from "./lib-error/lib-error.service";


@NgModule({
  imports: [
    CommonModule,
    DatatypeLibraryEditRoutingModule,
    AccordionModule,
    OverlayPanelModule,
    ButtonModule,
    TabViewModule,
    GrowlModule,
    MenubarModule,
    TooltipModule,
    TieredMenuModule,
    UtilsModule,
    DragDropModule,
    FormsModule,
    TreeModule,
    PanelModule,
    MultiSelectModule,
    FormsModule,ReactiveFormsModule,
    ContextMenuModule.forRoot(),
    DropdownModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    PanelMenuModule,
    ToolbarModule,
    FileUploadModule,
    ConfirmDialogModule,
    MessageModule,
    DialogModule,
    TreeTableModule
    ,SharedModule,
    TableModule,
    RadioButtonModule,
    ButtonModule,
    BlockUIModule,
    SplitButtonModule,
    NamingConventionModule,
    ModalModule.forRoot()

  ],
  declarations: [
    EditLibraryComponent, DatatypeLibraryMetadataComponent, LibSectionComponent, LibErrorComponent
  ],
  entryComponents: [

  ],
  providers : [
    TocService, TreeDragDropService,EditLibraryService, DatatypeLibraryEditResolver,LibErrorService, LibSectionResolver, LibMetaDataResolver,SaveFormsGuard,ConfirmationService
  ],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EditLibraryModule {}
