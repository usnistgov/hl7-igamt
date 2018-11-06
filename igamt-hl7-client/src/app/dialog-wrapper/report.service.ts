import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ReportService {

  constructor(private http: HttpClient) {

  }

  reportError(obj){

    console.log("Send Error");
   return  this.http.post('/api/errors/report',obj);
  }

}
