import {NgModule, CUSTOM_ELEMENTS_SCHEMA}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {IgDocumentEditComponent} from './igdocument-edit.component';
import {IgDocumentMetadataComponent} from './igdocument-metadata/igdocument-metadata.component';
import {SectionComponent} from './section/section.component';
import {IgDocumentEditRoutingModule} from './igdocument-edit-routing.module';
import {AccordionModule, ButtonModule, TabViewModule, GrowlModule} from 'primeng/primeng';
import {TocComponent} from "./toc/toc.component";
import {MenubarModule} from "primeng/components/menubar/menubar";
import {TooltipModule} from "primeng/components/tooltip/tooltip";
import {TieredMenuModule} from "primeng/components/tieredmenu/tieredmenu";
import {UtilsModule} from "../../utils/utils.module";
import {TocService} from "./toc/toc.service";
import {TreeDragDropService} from "primeng/components/common/treedragdropservice";
import {DragDropModule} from "primeng/components/dragdrop/dragdrop";
import {MenuItem} from 'primeng/primeng';
// import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import { FormsModule } from '@angular/forms';
import {IgdocumentEditResolver} from "./igdocument-edit.resolver";
import { TreeModule } from 'angular-tree-component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ContextMenuModule} from "ngx-contextmenu";
import {PanelModule} from 'primeng/panel';
import {MultiSelectModule} from 'primeng/multiselect';

import {DropdownModule} from 'primeng/dropdown';
import {SectionResolver} from "./section/sectionResolver.resolver";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import {PanelMenuModule} from 'primeng/panelmenu';
import {DisplayMenuComponent} from './displayMenu/display-menu.component';
import { ToolbarModule } from 'primeng/primeng';
import {IgMetaDataResolver} from "./igdocument-metadata/IgMetaDataResolver.resolver";
import {FileUploadModule} from "primeng/components/fileupload/fileupload";
import {SegmentEditModule} from "./segment-edit/segment-edit.module";
import {DatatypeEditModule} from "./datatype-edit/datatype-edit.module";
import {ConfirmationService} from "primeng/components/common/confirmationservice";
import {ConfirmDialogModule} from "primeng/components/confirmdialog/confirmdialog";
import {MessageModule} from "primeng/components/message/message";
import {SaveFormsGuard} from "../../guards/save.guard";

import {DialogModule} from 'primeng/dialog';
import {TreeTableModule} from "primeng/components/treetable/treetable";
import {SharedModule} from "primeng/components/common/shared";
import {AddConformanceProfileComponent} from "../add-conformance-profile/add-conformance-profile.component";
import {ModalModule} from "ngx-bootstrap";
import {IgDocumentCreateService} from "../igdocument-create/igdocument-create.service";
import {RadioButtonModule} from "primeng/components/radiobutton/radiobutton";
import {BlockUIModule} from "primeng/components/blockui/blockui";
import {IgDocumentAddingService} from "./adding.service";
import { AddSegmentComponent } from './add-segment/add-segment.component';
import {TableModule} from "primeng/components/table/table";


@NgModule({
	imports: [
	  CommonModule,
    IgDocumentEditRoutingModule,
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
    FormsModule,
    ContextMenuModule.forRoot(),
    DropdownModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    PanelMenuModule,
    ToolbarModule,
    FileUploadModule,
    SegmentEditModule,
    DatatypeEditModule,
    ConfirmDialogModule,
    MessageModule,
    DialogModule,
    TreeTableModule
    ,SharedModule,
    TableModule,
    RadioButtonModule,
    ButtonModule,
    BlockUIModule,
    ModalModule.forRoot()

  ],
	declarations: [
		IgDocumentEditComponent, IgDocumentMetadataComponent, SectionComponent, TocComponent, DisplayMenuComponent,AddConformanceProfileComponent, AddSegmentComponent
  ],
  entryComponents: [

  ],
  providers : [
   TocService, TreeDragDropService, IgdocumentEditResolver, SectionResolver, IgMetaDataResolver,SaveFormsGuard,ConfirmationService, IgDocumentAddingService
  ],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IgDocumentEditModule {}
