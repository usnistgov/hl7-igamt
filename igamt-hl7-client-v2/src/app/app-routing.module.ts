import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/core/components/home/home.component';
import { LoginComponent } from './modules/core/components/login/login.component';
import { NewPasswordComponent } from './modules/core/components/new-password/new-password.component';
import { RegisterComponent } from './modules/core/components/register/register.component';
import { ResetPasswordRequestComponent } from './modules/core/components/reset-password-request/reset-password-request.component';
import { NewPasswordResolver } from './modules/core/resolvers/new-password.resolver';
import { NotAuthenticatedGuard } from './modules/core/services/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthenticatedGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: 'reset-password-confirm/:token', component: NewPasswordComponent, resolve: { valid: NewPasswordResolver } },

  {
    path: 'reset-password', component: ResetPasswordRequestComponent, canActivate: [NotAuthenticatedGuard],
  },
  {
    path: 'ig',
    loadChildren: './modules/ig/ig.module#IgModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
