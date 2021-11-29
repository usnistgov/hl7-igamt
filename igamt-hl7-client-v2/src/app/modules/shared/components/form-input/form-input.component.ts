import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  options: any;
  @Input()
  viewOnly: boolean;
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
  @ViewChild('inputElm', { read: ElementRef }) inputElm: ElementRef;
  disabled: boolean;
  control: AbstractControl;

  constructor(private controlContainer: ControlContainer, private cd: ChangeDetectorRef) {
    this.change = new EventEmitter<any>();
  }

  onChange: any = () => {
  }

  onTouch: any = () => {
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
    if (this.inputElm) {
      this.inputElm.nativeElement.value = val;
    }
  }

  valueChange(value: any) {
    this.onChange(value);
    this.change.emit(value);
  }

  convertErrors(): string[] {
    const errors = [];
    for (const property in this.control.errors) {
      if (property === 'required') {
        errors.push(this.label + ' is required');
        break;
      } else if (property === 'minlength') {
        errors.push(this.label + ' is too short');
        break;

      } else if (property === 'maxlength') {
        errors.push(this.label + ' is too long');
        break;

      } else if (property === 'email') {
        errors.push('Please enter a valid e-mail');
        break;

      } else if (this.control.errors[property]) {
        errors.push(this.control.errors[property]);
        break;
      }
    }
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
