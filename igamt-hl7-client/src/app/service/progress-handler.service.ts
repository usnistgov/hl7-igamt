import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {MessageService} from "primeng/components/common/messageservice";
import {Message} from "primeng/components/common/message";

@Injectable()
export class ProgressHandlerService {

  private requestInFlight$: BehaviorSubject<boolean>;

  constructor(private messageService: MessageService) {
    this.requestInFlight$ = new BehaviorSubject(false);
  }

  setHttpStatus(inFlight: boolean) {
    this.requestInFlight$.next(inFlight);
  }

  getHttpStatus(): Observable<boolean> {
    return this.requestInFlight$.asObservable();
  }

  showNotification(error, id) {
    if(!error.hide){
      this.messageService.add(this.convertResponseToMessage(error, id));
    }

  }


  clear() {
    this.messageService.clear();
  }

  convertResponseToMessage(obj : any, id ): any{
    let m: any ={};


      if (obj.status) {
        m.severity = this.convertSeverityToPrimeNg(obj.status);
      }
      if (obj.type) {
        m.summary = obj.type;
      }
      if (obj.text) {
        m.detail = obj.text;
      }
      if (obj.data) {
        m.data = obj.data;
      }
        m.id = id
        m.key=id;

      return m;
  }

  convertSeverityToPrimeNg( status:any){

    console.log("Parsing status")
  if(status==Status.SUCCESS){
    return "success";
  }else if(status==Status.FAILED){
    return "error";
  }else if (status==Status.WARNING){
    return "warn"
  }else if(status==Status.INFO){
    return "info"
  }
  else{
    return "success";
  }
  }
}


export enum Status {
  SUCCESS="SUCCESS", WARNING="WARNING", INFO="INFO", FAILED="FAILED"
}


export class MessageImpl implements  Message{

}
