import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ExportService {

  constructor(private http:HttpClient) {


  }

  exportAsWord(igId){
    console.log("Exporting");
   return  this.http.get<any>("api/igdocuments/" + igId + "/export/word");
  }

  exportAsHtml(igId){
    return  this.http.get<any>("api/igdocuments/" + igId + "/export/html");

  }

}
