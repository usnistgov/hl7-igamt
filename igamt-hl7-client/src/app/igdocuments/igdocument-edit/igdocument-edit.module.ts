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
import {ActivatedRouteSnapshot} from "@angular/router";
import {PanelModule} from 'primeng/panel';
import {MultiSelectModule} from 'primeng/multiselect';

import {DropdownModule} from 'primeng/dropdown';
import {SectionResolver} from "./section/sectionResolver.resolver";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import {PanelMenuModule} from 'primeng/panelmenu';
import {DisplayMenuComponent} from './displayMenu/display-menu.component';
import { ToolbarModule } from 'primeng/primeng';
import {IgMetaDataResolver} from "./igdocument-metadata/IgMetaDataResolver.resolver";
import {SegmentEditModule} from "./segment-edit/segment-edit.module";


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
        SegmentEditModule



],
	declarations: [
		IgDocumentEditComponent, IgDocumentMetadataComponent, SectionComponent, TocComponent,DisplayMenuComponent
	],
  providers : [
   TocService,TreeDragDropService,IgdocumentEditResolver,SectionResolver,IgMetaDataResolver
  ],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IgDocumentEditModule {}
