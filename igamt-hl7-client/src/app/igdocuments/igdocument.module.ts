import {NgModule, CUSTOM_ELEMENTS_SCHEMA}     from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IgDocumentRoutingModule} from './igdocument-routing.module';
import {TabMenuModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {MessageModule} from 'primeng/message';

import {StepsModule} from 'primeng/steps';
import {MessagesModule} from "primeng/components/messages/messages";
import { AddConformanceProfileComponent } from './add-conformance-profile/add-conformance-profile.component';
import {RadioButtonModule} from "primeng/components/radiobutton/radiobutton";

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



    IgDocumentRoutingModule
	],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ],
	declarations: []
})
export class IgDocumentModule {}
