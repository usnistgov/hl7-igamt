import {Directive, Input} from '@angular/core';
import {Validator, AbstractControl, ValidatorFn, NG_VALIDATORS} from "@angular/forms";

@Directive({
  selector: '[DatatypeNamingConvention]',
  providers: [{provide: NG_VALIDATORS, useExisting: DatatypeNamingConventionDirective, multi: true}]

})
export class DatatypeNamingConventionDirective  implements Validator {




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
    console.log(obj);
    console.log(this.scope);
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
