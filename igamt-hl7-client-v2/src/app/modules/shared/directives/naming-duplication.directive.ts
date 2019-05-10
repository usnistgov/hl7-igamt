import { Directive, Input } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {IDisplayElement} from '../models/display-element.interface';

@Directive({
  selector: '[NamingDuplication]',
  providers: [{provide: NG_VALIDATORS, useExisting: NamingDuplicationDirective, multi: true}],

})
export class NamingDuplicationDirective implements Validator {
  @Input() existing: IDisplayElement[] = [];
  @Input() fixedName = '';
  constructor() {
  }
  validate(control: AbstractControl): {[key: string]: any} | null {
    return !this.isDuplicated(this.fixedName + control.value) ? null : {duplicated: true};
  }
  isDuplicated(label) {
    return true;
  }

}
