import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './modules/core/components/error-page/error-page.component';
import { HomeComponent } from './modules/core/components/home/home.component';
import { NewPasswordComponent } from './modules/core/components/new-password/new-password.component';
import { RegisterComponent } from './modules/core/components/register/register.component';
import { ResetPasswordRequestComponent } from './modules/core/components/reset-password-request/reset-password-request.component';
import { UserManagementComponent } from './modules/core/components/user-management/user-management.component';
import { UserProfileComponent } from './modules/core/components/user-profile/user-profile.component';
import { LoginComponent } from './modules/dam-framework/components/authentication/login/login.component';
import { NotAuthenticatedGuard } from './modules/dam-framework/guards/auth-guard.guard';
import { NewPasswordResolver } from './modules/dam-framework/guards/new-password.resolver';

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
    path: 'configuration',
    loadChildren: 'src/app/modules/export-configuration/export-configuration.module#ExportConfigurationModule',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
  },
  { path: 'reset-password-confirm/:token', component: NewPasswordComponent, resolve: { valid: NewPasswordResolver } },

  {
    path: 'reset-password', component: ResetPasswordRequestComponent, canActivate: [NotAuthenticatedGuard],
  },
  {
    path: 'ig',
    loadChildren: './modules/ig/ig.module#IgModule',
  },
  {
    path: 'datatype-library',
    loadChildren: './modules/library/library.module#LibraryModule',
  },
  {
    path: 'documentation',
    loadChildren: './modules/documentation/documentation.module#DocumentationModule',
  },
  {
    path: 'structure-editor',
    loadChildren: './modules/structure-editor/structure-editor.module#StructureEditorModule',
  },
  {
    path: '**', component: ErrorPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
