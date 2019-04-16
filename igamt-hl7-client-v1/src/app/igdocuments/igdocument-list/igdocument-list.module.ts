import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {IgDocumentListComponent} from './igdocument-list.component';
import {TabMenuModule} from 'primeng/primeng';
import {OrderListModule} from 'primeng/primeng';
import {PickListModule} from 'primeng/primeng';
import {NgModel, FormsModule} from '@angular/forms';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';


@NgModule({
	imports: [
		CommonModule,
    ButtonModule,
		TabMenuModule,
    OrderListModule,PickListModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    DataViewModule
	],
	declarations: [
		IgDocumentListComponent
	]
})
export class IgDocumentListModule {}
