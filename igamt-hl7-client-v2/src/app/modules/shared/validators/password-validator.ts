import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function passwordValidator(formGroup: FormGroup): ValidatorFn {
  return (control: AbstractControl): { notMatch: string } => {
    return control.value !== formGroup.get('password').value ? { notMatch: 'Confirmation does not match password' } : null;
  };
}
