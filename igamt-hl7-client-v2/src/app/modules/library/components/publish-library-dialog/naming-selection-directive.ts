import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { IPublicationEntry } from './publish-library-dialog.component';

@Directive({
  selector: '[appNamingSelectionDirective]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NamingSelectionDirective, multi: true }],

})
export class NamingSelectionDirective implements Validator, OnInit {
  existing_: string[];

  @Input() set existing(event: IPublicationEntry[]) {
    this.existing_ = event.filter((f) => f.display.id !== this.id).map((x) => x.display.fixedName + x.suggested);
  }

  @Input() fixedName;
  @Input() id;

  constructor() {
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.existing_.indexOf(this.fixedName + control.value) ? null : { duplicated: control.value + 'is already used' };
  }
  ngOnInit() {
  }

  validateUnity(existing: IPublicationEntry[], fixedName: string, id: string): ValidatorFn {
    return (control: AbstractControl) => {
      return !this.isDuplicated(existing, fixedName, control.value, id) ? null : { duplicated: control.value + 'is already used' };
    };
  }
  isDuplicated(existing: IPublicationEntry[], fixedName: string, value: string, id: string) {
    return existing.filter((entry) => entry.display.fixedName === fixedName && value === entry.suggested).length > 1;
  }
}
