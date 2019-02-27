import {Component, Inject, forwardRef, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {MessageService} from "primeng/components/common/messageservice";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  message: string;
  username: string;
  password: string;

  constructor(public authService: AuthService, public router: Router,public sanitizer: DomSanitizer, private hostElement: ElementRef) {
  }


  login() {

    this.authService.login(this.username,this.password).subscribe(x => {
      if (x==true) {
        console.log("test");
        let redirect = this.authService.redirectUrl;
        if(redirect) {
          this.router.navigate([redirect]);
        }
      }
    }
    );
  }

  logout() {
    this.authService.logout();  //?
  }
  register(){
    this.router.navigate(["/register"]);
  }

  ngOnInit() {
  }




}
