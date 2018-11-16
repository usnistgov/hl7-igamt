import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';


import {IgDocumentCreateRoutingModule} from "./igdocument-create-routing.module";
import {IgDocumentCreateComponent} from "./igdocument-create.component";

import {IgDocumentCreateService} from "./igdocument-create.service";
import {TreeTableModule,SharedModule} from 'primeng/primeng';
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
import {StepsModule} from "primeng/components/steps/steps";
import {RadioButtonModule} from 'primeng/radiobutton';
import {MessageModule} from "primeng/components/message/message";
import {FroalaViewModule, FroalaEditorModule} from "angular-froala-wysiwyg";
import {ButtonModule} from "primeng/components/button/button";
import {FileUploadModule} from 'primeng/fileupload';

import {BreadcrumbModule} from 'primeng/breadcrumb';

@NgModule({
  imports: [
    TreeTableModule,SharedModule,
    CommonModule,
    StepsModule,
    IgDocumentCreateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    ButtonModule,
    FileUploadModule,
    MessageModule,
    BreadcrumbModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),



],
  declarations: [
    IgDocumentCreateComponent
  ],
  providers:[IgDocumentCreateService]
})
export class IgDocumentCreateModule {


}
