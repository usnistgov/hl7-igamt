import {NgModule, CUSTOM_ELEMENTS_SCHEMA}     from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IgDocumentRoutingModule} from './igdocument-routing.module';
import {TabMenuModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {MessageModule} from 'primeng/message';

import {StepsModule} from 'primeng/steps';
import {MessagesModule} from "primeng/components/messages/messages";
import {RadioButtonModule} from "primeng/components/radiobutton/radiobutton";
import {IgDocumentListComponent} from "./igdocument-list/igdocument-list.component";
import {Igsresolver} from "./igdocument-list/igs.resolver";
import {UtilsModule} from "../utils/utils.module";
import {OrderListModule} from "primeng/components/orderlist/orderlist";
import {PickListModule} from "primeng/components/picklist/picklist";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {InputTextModule} from "primeng/components/inputtext/inputtext";
import {DataViewModule} from "primeng/components/dataview/dataview";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {DeltaService} from '../common/delta/service/delta.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
    ButtonModule,
		TabMenuModule,
    StepsModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    RadioButtonModule,
    CommonModule,
    UtilsModule,
    FormsModule,
    ButtonModule,
    TabMenuModule,
    StepsModule,
    MessageModule,
    MessagesModule,
    CommonModule,
    ButtonModule,
    TabMenuModule,
    OrderListModule,
    PickListModule,
    DropdownModule,
    InputTextModule,
    DataViewModule,
    RadioButtonModule,
    IgDocumentRoutingModule

	],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ],
	declarations: [IgDocumentListComponent],
  providers:[Igsresolver,ConfirmationService, DeltaService]

})
export class IgDocumentModule {}
