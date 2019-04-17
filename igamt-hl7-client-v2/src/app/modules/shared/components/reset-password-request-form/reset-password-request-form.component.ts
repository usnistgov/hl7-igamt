import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password-request-form',
  templateUrl: './reset-password-request-form.component.html',
  styleUrls: ['./reset-password-request-form.component.css'],
})
export class ResetPasswordRequestFormComponent implements OnInit {
  resetForm: FormGroup;
  @Output() submitEvent = new EventEmitter<string>();

  constructor() {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
    });
  }

  submit() {
    this.submitEvent.emit(this.resetForm.getRawValue().email);
  }

  ngOnInit() {

  }
}
