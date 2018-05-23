import { Component } from '@angular/core';
import { AppComponent } from './app.component';
import {AuthService} from "./login/auth.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    username="Guest";
    constructor(public app: AppComponent,public auth:AuthService ) {
     this.username= this.auth.getcurrentUser();
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
      console.log(this.username);

    return this.username;
  }
}
