import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {IgDocumentListComponent} from './igdocument-list.component';
import {MyIgsComponent} from './my-igs/my-igs.component';
import {PreloadedIgsComponent} from './preloaded-igs/preloaded-igs.component';
import {SharedIgsComponent} from './shared-igs/shared-igs.component';
import {AllIgsComponent} from './all-igs/all-igs.component';
import {IgDocumentListRoutingModule} from './igdocument-list-routing.module';
import {TabMenuModule} from 'primeng/primeng';

import {OrderListModule} from 'primeng/primeng';
import {PickListModule} from 'primeng/primeng';
import {NgModel, FormsModule} from '@angular/forms';

import {IgListService} from "./igdocument-list.service";
import {MyIGsresolver} from "../igdocument-list/my-igs/my-igs.resolver";
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';


@NgModule({
	imports: [
		CommonModule,
    ButtonModule,
		IgDocumentListRoutingModule,
		TabMenuModule,
    OrderListModule,PickListModule,
    DropdownModule,
    FormsModule,
    InputTextModule,

    // MatButtonModule,MatListModule,MatIconModule
    DataViewModule
	],
	declarations: [
		IgDocumentListComponent, MyIgsComponent, PreloadedIgsComponent, SharedIgsComponent, AllIgsComponent
	],
  providers:[IgListService,MyIGsresolver]
})
export class IgDocumentListModule {}
