import {Directive, Input} from '@angular/core';
import {NG_VALIDATORS, AbstractControl, Validator} from "@angular/forms";
import * as _ from 'lodash';

@Directive({
  selector: '[NamingDuplication]',
  providers: [{provide: NG_VALIDATORS, useExisting: NamingDuplicationDirective, multi: true}]
})
export class NamingDuplicationDirective implements Validator {
  @Input() existing: string[];

  @Input() label: string;// without extension

  constructor() {

    console.log("Naming Duplication called");

  }

  validate(control: AbstractControl): {[key: string]: any} | null {

    console.log("Validation Directive === === ==== ");
    console.log(this.existing);

    return !this.isDuplicated(this.label+control.value) ? null: {'duplicated': {value: control.value}};

  }



  isDuplicated(label){
    console.log("Duplication Directive");
    console.log(label);
    console.log(this.existing);
    let exist= _.filter(this.existing, function(o) { return o==label });
    console.log(exist);
    return exist.length>0;
  }
}
