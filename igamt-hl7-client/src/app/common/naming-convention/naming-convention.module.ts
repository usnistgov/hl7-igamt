import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NamingDuplicationDirective } from './naming-duplication.directive';
import {DatatypeNamingConventionDirective} from "./datatype-naming-convention.directive";
import { AttachToFormDirective } from './attach-to-form.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NamingDuplicationDirective,DatatypeNamingConventionDirective, AttachToFormDirective],
  exports:[NamingDuplicationDirective,DatatypeNamingConventionDirective,AttachToFormDirective]
})
export class NamingConventionModule {

}
