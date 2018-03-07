import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LocationStrategy, HashLocationStrategy, CommonModule} from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DocumentationComponent } from './documentation/documentation.component'

import {WorkspaceService} from "./service/workspace/workspace.service";
import {AlertModule} from "ngx-bootstrap";
import {NotFoundComponent} from "./common/404/404.component";

import {AppInfoService} from './appinfo.service';
import {IndexedDbService} from './service/indexed-db/indexed-db.service';
import {DatatypesService} from './service/datatypes/datatypes.service';
import {ValueSetsService} from './service/valueSets/valueSets.service';
import {MenubarModule,PanelModule} from 'primeng/primeng';
import {AppRoutes} from './app.routes';
import {AppMenuComponent} from './app.menu.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {GeneralConfigurationService} from "./service/general-configuration/general-configuration.service";
import {SegmentsService} from "./service/segments/segments.service";
import {ProfileComponentsService} from "./service/profilecomponents/profilecomponents.service";
import {LoginComponent} from "./login/login.component"
import {AuthService} from "./login/auth.service";
import {AuthGuard} from "./login/auth-guard.service";
import {HttpClientModule} from "@angular/common/http";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "./requestInterceptor";
import { RegisterComponent } from './register/register.component';
import {UserService} from "./service/userService/user.service";

import { FlexLayoutModule } from "@angular/flex-layout";
import {EqualValidator} from "./formValidators/equal-validator.directive";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    DocumentationComponent,
    AppMenuComponent,
    AppTopBarComponent,
    AppFooterComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
    EqualValidator

  ],
  exports : [ ],
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    BrowserModule,
    FlexLayoutModule,
    PanelModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MenubarModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
     AppInfoService,
    WorkspaceService,
    GeneralConfigurationService,
    IndexedDbService,
    DatatypesService,
    ValueSetsService,
    SegmentsService,
    ProfileComponentsService,
    AuthService,
    AuthGuard,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
