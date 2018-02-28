import {NgModule, CUSTOM_ELEMENTS_SCHEMA}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {IgDocumentEditComponent} from './igdocument-edit.component';
import {IgDocumentMetadataComponent} from './igdocument-metadata/igdocument-metadata.component';
import {SectionComponent} from './section/section.component';
import {IgDocumentEditRoutingModule} from './igdocument-edit-routing.module';
import {AccordionModule, ButtonModule, TabViewModule, GrowlModule} from 'primeng/primeng';
import {IgDocumentGuard} from "./igdocument-edit.guard";
import {TocComponent} from "./toc/toc.component";
import {MenubarModule} from "primeng/components/menubar/menubar";
import {TooltipModule} from "primeng/components/tooltip/tooltip";
import {TieredMenuModule} from "primeng/components/tieredmenu/tieredmenu";
import {UtilsModule} from "../../utils/utils.module";
import {TocService} from "./toc/toc.service";
import {TreeModule} from "primeng/components/tree/tree";
import {TreeDragDropService} from "primeng/components/common/treedragdropservice";
import {DragDropModule} from "primeng/components/dragdrop/dragdrop";
import {MenuItem} from 'primeng/primeng';
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import { FormsModule } from '@angular/forms';
import {ContextMenuModule} from "ngx-contextmenu";


@NgModule({
	imports: [
		CommonModule,
		IgDocumentEditRoutingModule,
    AccordionModule,
    ButtonModule,
    TabViewModule,
    GrowlModule,
    MenubarModule,
    TooltipModule,
    TieredMenuModule,
    UtilsModule,
    TreeModule,
    DragDropModule,
    FormsModule,
    ContextMenuModule.forRoot({
      autoFocus: true,
      // useBootstrap4: true,
    })


	],
	declarations: [
		IgDocumentEditComponent, IgDocumentMetadataComponent, SectionComponent, TocComponent
	],
  providers : [
    IgDocumentGuard, TocService,TreeDragDropService
  ],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IgDocumentEditModule {}
