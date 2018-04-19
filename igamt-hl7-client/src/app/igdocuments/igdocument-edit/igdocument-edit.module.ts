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
    ContextMenuModule.forRoot()



],
	declarations: [
		IgDocumentEditComponent, IgDocumentMetadataComponent, SectionComponent, TocComponent
	],
  providers : [
   TocService,TreeDragDropService,IgdocumentEditResolver
  ],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IgDocumentEditModule {}
