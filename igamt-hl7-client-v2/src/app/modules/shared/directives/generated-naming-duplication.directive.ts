import {Directive, Input, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';
import {validateGeneratedFlavorsUnicity} from '../functions/unicity-factory';
import {IDisplayElement} from '../models/display-element.interface';
import {IDomainInfo} from '../models/domain-info.interface';


@Directive({
  selector: '[appGeneratedNamingDuplicationDirective]',
  providers: [{provide: NG_VALIDATORS, useExisting: GeneratedNamingDuplicationDirective, multi: true}],
})
export class GeneratedNamingDuplicationDirective  implements Validator, OnInit {
  @Input() existing: IDisplayElement[] = [];
  @Input() domainInfo: IDomainInfo;
  fn: ValidatorFn;
  constructor() {
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.fn(control);
  }
  ngOnInit(): void {
    this.fn = validateGeneratedFlavorsUnicity(this.existing);
  }
}
