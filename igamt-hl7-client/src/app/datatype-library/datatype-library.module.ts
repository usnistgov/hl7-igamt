import {NgModule, CUSTOM_ELEMENTS_SCHEMA}     from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {TabMenuModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {MessageModule} from 'primeng/message';

import {StepsModule} from 'primeng/steps';
import {MessagesModule} from "primeng/components/messages/messages";
import {RadioButtonModule} from "primeng/components/radiobutton/radiobutton";
import {DatatypeLibraryRoutingModule} from "./datatype-library-routing.module";
import {UtilsModule} from "../utils/utils.module";
import {DatatypeLibraryAddingService} from "./service/adding.service";
import {LibraryListResolver} from "./library-list/library-list.resolver";
import {LibraryListComponent} from "./library-list/library-list.component";
import {DataViewModule} from "primeng/components/dataview/dataview";
import {InputTextModule} from "primeng/components/inputtext/inputtext";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {OrderListModule} from "primeng/components/orderlist/orderlist";
import {PickListModule} from "primeng/components/picklist/picklist";

@NgModule({
  imports: [
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
    OrderListModule,PickListModule,
    DropdownModule,
    InputTextModule,
    DataViewModule,
    RadioButtonModule,
    DatatypeLibraryRoutingModule
  ],

  declarations: [LibraryListComponent],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ],
  providers:[DatatypeLibraryAddingService,LibraryListResolver]
})
export class DatatypeLibraryModule {}
