import {Directive, Input, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';
import {validateAddIngUnity, validateUnity} from '../functions/unicity-factory';
import {IDomainInfo} from '../models/domain-info.interface';
import { IAddingInfo } from './../models/adding-info';

@Directive({
  selector: '[appAddingDuplication]',
  providers: [{provide: NG_VALIDATORS, useExisting: AddingDuplicationDirective, multi: true}],

})
export class AddingDuplicationDirective implements Validator, OnInit {
  @Input() added: IAddingInfo[] = [];
  @Input() fixedName = '';
  @Input() domainInfo: IDomainInfo;
  @Input() id: string;
  fn: ValidatorFn;
  constructor() {
  }
  validate(control: AbstractControl): ValidationErrors| null {
    return this.fn(control);
  }
  ngOnInit() {
    this.fn = validateAddIngUnity(this.added, this.fixedName, this.domainInfo, this.id);
  }
}
