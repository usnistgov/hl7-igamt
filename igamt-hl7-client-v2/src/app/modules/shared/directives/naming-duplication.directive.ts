import { Directive, Input } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {isDuplicated} from '../functions/naming-functions';
import {IDisplayElement} from '../models/display-element.interface';
import {IDomainInfo} from '../models/domain-info.interface';

@Directive({
  selector: '[appNamingDuplication]',
  providers: [{provide: NG_VALIDATORS, useExisting: NamingDuplicationDirective, multi: true}],

})
export class NamingDuplicationDirective implements Validator {
  @Input() existing: IDisplayElement[] = [];
  @Input() fixedName = '';
  @Input() domainInfo: IDomainInfo;
  constructor() {
  }
  validate(control: AbstractControl): ValidationErrors| null {
    console.log(this.existing);
    console.log(this.fixedName);
    console.log(this.domainInfo);
    return !isDuplicated(this.fixedName, control.value, this.domainInfo, this.existing) ? null : {duplicated: true};
  }
}
