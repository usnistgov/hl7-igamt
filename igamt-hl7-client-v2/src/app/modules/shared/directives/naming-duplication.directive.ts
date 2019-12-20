import {Directive, Input, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';
import {isDuplicated} from '../functions/naming-functions';
import {IDisplayElement} from '../models/display-element.interface';
import {IDomainInfo} from '../models/domain-info.interface';
import {validateUnity} from '../functions/unicity-factory';

@Directive({
  selector: '[appNamingDuplication]',
  providers: [{provide: NG_VALIDATORS, useExisting: NamingDuplicationDirective, multi: true}],

})
export class NamingDuplicationDirective implements Validator, OnInit {
  @Input() existing: IDisplayElement[] = [];
  @Input() fixedName = '';
  @Input() domainInfo: IDomainInfo;
  fn: ValidatorFn;
  constructor() {
  }
  validate(control: AbstractControl): ValidationErrors| null {
    return this.fn(control);
  }
  ngOnInit() {
    this.fn = validateUnity(this.existing, this.fixedName, this.domainInfo);
  }
}
