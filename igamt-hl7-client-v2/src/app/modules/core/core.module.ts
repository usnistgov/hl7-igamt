import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { RegistrationEffects } from '../../root-store/registration/registration.effects';
import { UserProfileEffects } from '../../root-store/user-profile/user-profile.effects';
import { DamAuthenticationModule, DamMessagesModule } from '../dam-framework/dam-framework.module';
import { SharedModule } from '../shared/shared.module';
import { ConfigurationDialogComponent } from './components/configuration-dialog/configuration-dialog.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordRequestComponent } from './components/reset-password-request/reset-password-request.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    ResetPasswordRequestComponent,
    UserProfileComponent,
    UserManagementComponent,
    NewPasswordComponent,
    HomeComponent,
    ErrorPageComponent,
    ConfigurationDialogComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CardModule,
    TableModule,
    ProgressBarModule,
    StoreModule,
    MatProgressBarModule,
    EffectsModule.forFeature([RegistrationEffects]),
    EffectsModule.forFeature([UserProfileEffects]),
    SharedModule.forRoot(),
    DamMessagesModule.forRoot(),
    DamAuthenticationModule.forRoot({
      api: {
        login: 'api/login',
        resetPassword: 'api/password/reset',
        validateToken: 'api/password/validatetoken',
        updatePassword: 'api/password/reset/confirm',
        checkAuthStatus: 'api/authentication',
        logout: 'api/logout',
      },
      loginPageRedirectUrl: '/login',
      unprotectedRedirectUrl: '/home',
      loginSuccessRedirectUrl: '/home',
    }),
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    UserProfileComponent,
    UserManagementComponent,
    SharedModule,
    ProgressBarModule,
    HomeComponent,
    ErrorPageComponent,
    ConfigurationDialogComponent,
  ],
  entryComponents: [
    ConfigurationDialogComponent,
  ],
})
export class CoreModule {
}
