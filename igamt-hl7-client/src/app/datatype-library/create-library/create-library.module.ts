import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatatypeLibraryCreateService} from "./datatype-library.service";
import {DatatypeLibraryCreateComponent} from "./datatype-library-create.component";
import {CreateLibraryRoutingModule} from "./create-library-routing.module";
import {SharedModule} from "primeng/components/common/shared";
import {StepsModule} from "primeng/components/steps/steps";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RadioButtonModule} from "primeng/components/radiobutton/radiobutton";
import {ButtonModule} from "primeng/components/button/button";
import {BlockUIModule} from "primeng/components/blockui/blockui";
import {FileUploadModule} from "primeng/components/fileupload/fileupload";
import {MessageModule} from "primeng/components/message/message";
import {BreadcrumbModule} from "primeng/components/breadcrumb/breadcrumb";
import {FroalaEditorModule, FroalaViewModule} from "angular-froala-wysiwyg";
import {UtilsModule} from "../../utils/utils.module";

@NgModule({
  imports: [
   SharedModule,
    CommonModule,
    StepsModule,
    FormsModule,
    UtilsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    CreateLibraryRoutingModule,
    ButtonModule,
    BlockUIModule,
    FileUploadModule,
    MessageModule,
    BreadcrumbModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
  ],
  declarations: [DatatypeLibraryCreateComponent],
  providers:[DatatypeLibraryCreateService]
})
export class CreateLibraryModule { }
