import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LibraryListComponent} from "./library-list.component";
import {LibraryListResolver} from "./library-list.resolver";
import {ButtonModule} from "primeng/components/button/button";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {OrderListModule} from "primeng/components/orderlist/orderlist";
import {PickListModule} from "primeng/components/picklist/picklist";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/components/inputtext/inputtext";
import {DataViewModule} from "primeng/components/dataview/dataview";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';


@NgModule({
    imports: [
      CommonModule,
      ButtonModule,
      TabMenuModule,
      OrderListModule,PickListModule,
      DropdownModule,
      FormsModule,
      InputTextModule,
      DataViewModule,
      ConfirmDialogModule
    ],
  declarations: [LibraryListComponent,ConfirmDialogModule],
  providers:[LibraryListResolver]
})
export class LibraryListModule { }
