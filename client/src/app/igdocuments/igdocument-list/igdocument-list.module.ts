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
import { MatButtonModule } from '@angular/material';
import {MatListModule} from '@angular/material/list';

import {MatIconModule} from '@angular/material/icon';


import {IgListService} from "./igdocument-list.service";
@NgModule({
	imports: [
		CommonModule,
		IgDocumentListRoutingModule,
		TabMenuModule,
    OrderListModule,PickListModule,
    MatButtonModule,MatListModule,MatIconModule

	],
	declarations: [
		IgDocumentListComponent, MyIgsComponent, PreloadedIgsComponent, SharedIgsComponent, AllIgsComponent
	],
  providers:[IgListService]
})
export class IgDocumentListModule {}
