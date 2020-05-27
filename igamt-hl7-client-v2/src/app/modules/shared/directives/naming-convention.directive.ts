import {Directive, Input, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';
import {Scope} from '../constants/scope.enum';
import {Type} from '../constants/type.enum';
import {validateConvention} from '../functions/convention-factory';

@Directive({
  selector: '[appNamingConvention]',
  providers: [{provide: NG_VALIDATORS, useExisting: NamingConventionDirective, multi: true}],
})
export class NamingConventionDirective  implements Validator, OnInit {
  @Input()
  scope: Scope;
  @Input()
  type: Type;
  @Input()
  documentType: Type;
  @Input()
  master: boolean;
  fn: ValidatorFn;

  constructor() {
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.fn(control);
  }
  ngOnInit(): void {
    this.fn = validateConvention(this.scope, this.type, this.documentType, this.master);
  }
}
