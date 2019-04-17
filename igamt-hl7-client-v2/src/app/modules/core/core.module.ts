import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BlockUIModule } from 'primeng/blockui';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { NotificationEffects } from 'src/app/root-store/notification/notification.effects';
import { RegistrationEffects } from '../../root-store/registration/registration.effects';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationEffects } from './../../root-store/authentication/authentication.effects';
import { AlertsContainerComponent } from './components/alerts-container/alerts-container.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordRequestComponent } from './components/reset-password-request/reset-password-request.component';
import { UserManagementHeaderComponent } from './components/user-management-header/user-management-header.component';
import { NewPasswordResolver } from './resolvers/new-password.resolver';
import { AuthenticatedGuard, NotAuthenticatedGuard } from './services/auth-guard.guard';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    UserManagementHeaderComponent,
    ResetPasswordRequestComponent,
    NewPasswordComponent,
    HomeComponent,
    AlertsContainerComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CardModule,
    ProgressBarModule,
    BlockUIModule,
    StoreModule,
    EffectsModule.forFeature([AuthenticationEffects, RegistrationEffects, NotificationEffects]),
    SharedModule.forRoot(),
  ],
  providers: [
    NewPasswordResolver,
    AuthenticatedGuard,
    NotAuthenticatedGuard,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    SharedModule,
    ProgressBarModule,
    BlockUIModule,
    HomeComponent,
    AlertsContainerComponent,
  ],
})
export class CoreModule { }
