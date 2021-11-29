import {Directive, Input, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';
import {validateStructureUnicity} from '../../shared/functions/unicity-factory';
import {IDisplayElement} from '../../shared/models/display-element.interface';
import {IDomainInfo} from '../../shared/models/domain-info.interface';

@Directive({
  selector: '[appStructureNamingDuplication]',
  providers: [{provide: NG_VALIDATORS, useExisting: StructureNamingDuplicationDirective, multi: true}],

})
export class StructureNamingDuplicationDirective implements Validator, OnInit {
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
    this.fn = validateStructureUnicity(this.existing, this.fixedName, this.domainInfo);
  }
}
