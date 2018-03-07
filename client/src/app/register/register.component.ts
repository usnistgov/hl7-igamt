import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../service/userService/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private userService: UserService) { }

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
