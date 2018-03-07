import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../service/userService/user.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {EqualValidator, equalValidator} from "../formValidators/equal-validator.directive";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  model: any = {};
  loading = false;
  confirmPassword: any;
  registrationForm:FormGroup;

  constructor(
    private router: Router,
    private userService: UserService) {
    this.registrationForm= new FormGroup({
      'fullname': new FormControl(this.model.fullname,[Validators.required] ),
      'email':new FormControl(this.model.email, [Validators.email, Validators.required]),
      'username': new FormControl(this.model.username, [Validators.required,  Validators.minLength(4)]),
      'password':new FormControl(this.model.password, [Validators.required,  Validators.minLength(8)]),
      'confirmPasswordForm':new FormControl(
        this.confirmPassword,
        [Validators.required,  Validators.minLength(8),
          equalValidator(this.model.password)] )
    });





  }

  get fullname(){
    return this.registrationForm.get('fullname');

  }
  get email(){
    return this.registrationForm.get('email');

  }


  get confirmPasswordForm(){
    return this.registrationForm.get('confirmPasswordForm');

  }

  get username(){
    return this.registrationForm.get('username');

  }



  get password(){
    return this.registrationForm.get('password');

  }




  register() {
    this.loading = true;
    this.userService.create(this.model)
      .subscribe(
        data => {
        console.log("success");
          this.router.navigate(['/login']);
        },
        error => {
          console.log("error");

            this.loading = false;
        });
  }
}
