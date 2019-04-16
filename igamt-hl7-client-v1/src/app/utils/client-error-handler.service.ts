import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClientErrorHandlerService {

    hasError_:BehaviorSubject<Boolean>= new BehaviorSubject<any>(new Boolean(false));
    error_:BehaviorSubject<any>=  new BehaviorSubject<any>(null);

  constructor() {

  }

  report(error){

    console.log("Reporting Error");
    this.hasError_.next(new Boolean(true));
    this.setError(error);

  }
  //
  // ignore(){
  //   this.hasError_.next(false);
  // }
  setError(error){

    this.error_.next(error);

  }
  getHasError():BehaviorSubject<Boolean>{
    return this.hasError_;
  }



  getError(){
    return this.error_;
  }


}
export enum ErrorValue{
  TRUEVALUE="true", FALSEVALUE="false"

}
