import {Input, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NamingDuplicationDirective } from './naming-duplication.directive';
import {DatatypeNamingConventionDirective} from "./datatype-naming-convention.directive";
import { AttachToFormDirective } from './attach-to-form.directive';
import {AbstractControl, Validator, ValidatorFn} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NamingDuplicationDirective,DatatypeNamingConventionDirective, AttachToFormDirective],
  exports:[NamingDuplicationDirective,DatatypeNamingConventionDirective,AttachToFormDirective]
})
export class NamingConventionModule implements Validator {

  @Input() scope: string;// without extension

  constructor() { }


  validate(control: AbstractControl): {[key: string]: any} | null {
    return !this.validConvention(control.value) ? {'invalidConvention': {value: control.value}} : null;

  }
  conventionValidator(obj: string): ValidatorFn {
    console.log(obj);
    return (control: AbstractControl): {[key: string]: any}|null => {
      return !this.validConvention(obj) ? {'invalidConvention': {value: control.value}} : null;
    };

  }



  validConvention(obj){
    if(this.scope=='SDTF'){
      return this.validConventionForMASTER(obj);
    }else{
      return this.validConventionForUser(obj);
    }
  }
  validConventionForMASTER(ext){
    if(!ext){
      return true;
    }else{
      return this.isTowDigets(ext);
    }
  }

  validConventionForUser(ext){
    if(!ext){
      return true;
    }else{
      return ext.length>0 && this.isLetter(ext.substring(0,1))|| !ext.length;
    }
  }

  isLetter(str) {

    return str.length === 1 && str.match(/[a-z]/i);

  }

  isTowDigets(str){
    return str.match(/^[0-9]{1,2}?$/)
  }

}
