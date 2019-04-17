import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../../validators/password-validator';

@Component({
  selector: 'app-new-password-form',
  templateUrl: './new-password-from.component.html',
  styleUrls: ['./new-password-from.component.css'],
})
export class NewPasswordFromComponent implements OnInit {

  updatePasswordForm: FormGroup;
  @Output() submitEvent = new EventEmitter<string>();

  constructor() {
    this.updatePasswordForm = new FormGroup({
      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ),
      confirm: new FormControl(''),
    });
    this.updatePasswordForm.get('confirm').setValidators(
      [
        Validators.required,
        passwordValidator(this.updatePasswordForm),
      ],
    );
  }

  refreshConfirmPasswordValidation() {
    this.updatePasswordForm.get('confirm').updateValueAndValidity();
  }

  submit() {
    this.submitEvent.emit(this.updatePasswordForm.getRawValue().password);
  }

  ngOnInit() {

  }

}
