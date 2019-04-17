import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from 'src/app/root-store/authentication/authentication.actions';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

  @Output() authenticate: EventEmitter<LoginRequest>;
  loginForm: FormGroup;

  constructor() {
    this.authenticate = new EventEmitter<LoginRequest>();
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  submit() {
    this.authenticate.emit(this.loginForm.getRawValue());
  }

  ngOnInit() {
  }

}
