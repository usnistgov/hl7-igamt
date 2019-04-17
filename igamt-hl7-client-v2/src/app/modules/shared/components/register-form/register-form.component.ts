import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IRegistration } from 'src/app/modules/core/models/user/registration.class';
import { passwordValidator } from '../../validators/password-validator';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent implements OnInit {
  notice = 'Application for the use ' +
    'of the IGAMT does not guarantee that' +
    ' the applicant will be granted approval ' +
    'for use by the National Institute of Standards' +
    ' and Technology (NIST).The IGAMT software is hosted' +
    ' on a NIST server, and your information will not be visible' +
    ' to users other than NIST staff and yourselves. Information provided' +
    ' in the IGAMT does not imply NIST endorsement of any particular product,' +
    ' service, organization, company, information provider, or content' +
    '. This software was developed at the NIST by employees of the Federal Government' +
    ' in the course of their official duties. Pursuant to title 17 Section 105 of the' +
    ' United States Code, this software is not subject to copyright protection and i' +
    's in the public domain. NIST assumes no responsibility whatsoever for its use' +
    ' by other parties, and makes no guarantees, expressed or implied, about its ' +
    'quality, reliability, or any other characteristic. We would appreciate ' +
    'acknowledgment if the software is used. The outcome of the use of IGAMT ' +
    'can be redistributed and/or modified freely provided that any derivative ' +
    'works bear some notice that they are derived from it, and any modified' +
    ' versions bear some notice that they have been modified.';

  registrationForm: FormGroup;
  @Output() submitEvent = new EventEmitter<IRegistration>();

  constructor() {
    this.registrationForm = new FormGroup({
      fullName: new FormControl(
        '',
        [
          Validators.required,
        ],
      ),
      email: new FormControl(
        '',
        [
          Validators.email,
          Validators.required,
        ],
      ),
      username: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ),
      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ),
      confirm: new FormControl(
        '',
      ),
      signedConfidentialityAgreement: new FormControl(
        false,
        [
          this.signedConfidentialityAgreementValidator(),
        ],
      ),
    });
    this.registrationForm.get('confirm').setValidators([Validators.required, passwordValidator(this.registrationForm)]);
  }

  refreshConfirmPasswordValidation() {
    this.registrationForm.get('confirm').updateValueAndValidity();
  }

  submit() {
    this.submitEvent.emit(this.registrationForm.getRawValue());
  }

  signedConfidentialityAgreementValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return !control.value ? { unsigned: { value: control.value } } : null;
    };
  }

  ngOnInit() {
  }
}
