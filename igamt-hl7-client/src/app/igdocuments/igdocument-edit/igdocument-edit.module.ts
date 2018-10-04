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
import {TocService} from "./service/toc.service";
import {ConstraintService} from "./service/constraint.service";
import {TreeDragDropService} from "primeng/components/common/treedragdropservice";
import {DragDropModule} from "primeng/components/dragdrop/dragdrop";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {IgDocumentAddingService} from "./service/adding.service";
import { AddSegmentComponent } from './add-segment/add-segment.component';
import {TableModule} from "primeng/components/table/table";
import { AddDatatypeComponent } from './add-datatype/add-datatype.component';
import { AddValueSetComponent } from './add-value-set/add-value-set.component';
import { CopyElementComponent } from './copy-element/copy-element.component';
import {SplitButtonModule} from "primeng/components/splitbutton/splitbutton";
import {ExportService} from "./service/export.service";
import {CopyService} from "./copy-element/copy.service";
import {NamingConventionModule} from "../../common/naming-convention/naming-convention.module";
import {IgDocumentService} from "./ig-document.service";
import { IgErrorComponent } from './ig-error/ig-error.component';
import {IgErrorService} from "./ig-error/ig-error.service";
import {IgErrorResolver} from "./ig-error/ig-error.resolver";
import {LoadingService} from "./service/loading.service";
import { DeleteElementComponent } from './delete-element/delete-element.component';
import {DeleteElementService} from "./delete-element/delete-element.service";


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
    FormsModule,ReactiveFormsModule,
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
    SplitButtonModule,
    NamingConventionModule,
    ModalModule.forRoot()

  ],
	declarations: [
		IgDocumentEditComponent, IgDocumentMetadataComponent, SectionComponent, TocComponent,AddConformanceProfileComponent, AddSegmentComponent, AddDatatypeComponent, AddValueSetComponent, CopyElementComponent, IgErrorComponent, DeleteElementComponent
  ],
  entryComponents: [

  ],
  providers : [
      ConstraintService, TocService, TreeDragDropService, IgdocumentEditResolver, SectionResolver, IgMetaDataResolver,SaveFormsGuard,ConfirmationService, IgDocumentAddingService,ExportService,CopyService,IgDocumentService, IgErrorService,IgErrorResolver, LoadingService,DeleteElementService
  ],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IgDocumentEditModule {}
