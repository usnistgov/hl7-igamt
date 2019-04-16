import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {MessageService} from "primeng/components/common/messageservice";

@Injectable()
export class ErrorService {
  error:any;

  constructor(private  router:Router){


  }

  getError(){
    return this.error;
  }



  setError(error){
    this.error=error;
  }

  redirect(error){
    this.setError(error);
    this.router.navigate(['/error']);

  }







}
