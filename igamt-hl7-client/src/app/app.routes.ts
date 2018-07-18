import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {DocumentationComponent} from './documentation/documentation.component';
import {NotFoundComponent} from "./common/404/404.component";
import {LoginComponent} from "./login/login.component"
import {RegisterComponent} from "./register/register.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {ResetPasswordRequestComponent} from "./reset-password/reset-password-request/reset-password-request.component";
import {ResetPasswordConfirmComponent} from "./reset-password/reset-password-confirm/reset-password-confirm.component";


export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'ig-documents', loadChildren: './igdocuments/igdocument.module#IgDocumentModule'},
  { path: 'ig', loadChildren: './igdocuments/igdocument-edit/igdocument-edit.module#IgDocumentEditModule' },

  {path: 'datatype-libraries', loadChildren: './datatype-library/datatype-library.module#DatatypeLibraryModule'},
  {path: 'shared-data', loadChildren: './shared-elements/shared-elements.module#SharedElementsModule'},
  {path: 'comparator', loadChildren: './delta/delta.module#DeltaModule'},
  {path: 'configuration',loadChildren:'./configuration/configuration.module#ConfigurationModule'},
  {path: 'search', loadChildren: './search/search.module#SearchModule'},
  {path: 'about', component: AboutComponent},
  {path: 'documentation', component: DocumentationComponent},
  {path: '', component: DocumentationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'reset-password', component: ResetPasswordRequestComponent},
  {path: 'reset-password-confirm/:token', component: ResetPasswordConfirmComponent},


  {path : '**', component: NotFoundComponent}
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
