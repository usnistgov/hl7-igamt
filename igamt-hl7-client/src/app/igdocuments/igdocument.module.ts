import {NgModule, CUSTOM_ELEMENTS_SCHEMA}     from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IgDocumentRoutingModule} from './igdocument-routing.module';
import {TabMenuModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';

import {StepsModule} from 'primeng/steps';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
    ButtonModule,
		TabMenuModule,
    StepsModule,

		IgDocumentRoutingModule
	],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA ],
	declarations: []
})
export class IgDocumentModule {}
