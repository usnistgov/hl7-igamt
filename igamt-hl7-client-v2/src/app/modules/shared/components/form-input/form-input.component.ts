import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor, OnInit {

  @Output()
  change: EventEmitter<any>;
  @Input()
  type: string;
  @Input()
  name: string;
  @Input()
  formControlName: string;
  @Input()
  value: string;
  @Input()
  id: string;
  @Input()
  required: boolean;
  @Input()
  label: string;
  @Input()
  placeholder: any;
  disabled: boolean;
  control: AbstractControl;
  onChange: any = () => { };
  onTouch: any = () => { };

  constructor(private controlContainer: ControlContainer) {
    this.change = new EventEmitter<any>();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(val: any): void {
    this.value = val;
  }

  valueChange(value: any) {
    this.onChange(value);
    this.change.emit(value);
  }

  convertErrors(): string[] {
    const errors = [];
    for (const property in this.control.errors) {
      if (property === 'required') {
        errors.push(this.name + ' is required');
        break;
      } else if (property === 'minlength') {
        errors.push(this.name + ' is too short');
        break;

      } else if (property === 'maxlength') {
        errors.push(this.name + ' is too long');
        break;

      } else if (property === 'email') {
        errors.push('Please enter a valid e-mail');
        break;

      } else if (this.control.errors[property]) {
        errors.push(this.control.errors[property]);
        break;
      }
    }
    console.log(errors);
    return errors;
  }

  ngOnInit() {
    if (this.controlContainer) {
      if (this.formControlName) {
        this.control = this.controlContainer.control.get(this.formControlName);
      } else {
        console.warn('Missing FormControlName directive from host element of the component');
      }
    } else {
      console.warn('Can\'t find parent FormGroup directive');
    }
  }
}
