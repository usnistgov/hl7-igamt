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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TabMenuModule,
    StepsModule,
    MessageModule,
    MessagesModule,
    RadioButtonModule,
    DatatypeLibraryRoutingModule
  ],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: []
})
export class DatatypeLibraryModule {}
