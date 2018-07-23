import { Component } from '@angular/core';
import { AppComponent } from './app.component';
import {AuthService} from "./login/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    currentUser:any={};
    constructor(public app: AppComponent,public auth:AuthService ) {

    }

    themeChange(e) {
        const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        const href = themeLink.href;
        const themeFile = href.substring(href.lastIndexOf('/') + 1, href.lastIndexOf('.'));
        const themeTokens = themeFile.split('-');
        const themeName = themeTokens[1];
        const themeMode = themeTokens[2];
        const newThemeMode = (themeMode === 'dark') ? 'light' : 'dark';

        this.app.changeTheme(themeName + '-' + newThemeMode);
    }

  getUsername(){



      if(this.currentUser){
        return this.currentUser.username;

      }else{
        return "Guest";
      }

  }
  ngOnInit(){
  this.auth.getCurrentUser();


  }
  ngAfterViewInit() {
    this.auth.currentUser.subscribe(x=> {
      this.currentUser = x;


    },error=>{
      this.currentUser = "Guest";

    });

  }
  isAuthenticated(){
   return  this.auth.isAuthenticated();
  }

  logout(){

    this.auth.logout();

  }
}
