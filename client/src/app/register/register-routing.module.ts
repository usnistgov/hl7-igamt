/**
 * Created by ena3 on 3/1/18.
 */


import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./register.component";


const registerRoute: Routes = [
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(registerRoute)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})
export class LoginRoutingModule {}
