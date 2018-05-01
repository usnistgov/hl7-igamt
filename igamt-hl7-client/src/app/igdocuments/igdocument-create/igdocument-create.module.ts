import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';


import {IgDocumentCreateRoutingModule} from "./igdocument-create-routing.module";
import {IgDocumentCreateComponent} from "./igdocument-create.component";

import {IgDocumentCreateService} from "./igdocument-create.service";
import {TreeTableModule,SharedModule} from 'primeng/primeng';
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
import {StepsModule} from "primeng/components/steps/steps";
import {RadioButtonModule} from 'primeng/radiobutton';


@NgModule({
  imports: [
    TreeTableModule,SharedModule,
    CommonModule,
    StepsModule,
    IgDocumentCreateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule

  ],
  declarations: [
    IgDocumentCreateComponent
  ],
  providers:[IgDocumentCreateService]
})
export class IgDocumentCreateModule {


}
