import { Injectable } from '@angular/core';
import {Types} from "../../constants/types";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class DatatypeColService {

  constructor(private http: HttpClient) { }

  public getDatatypeFlavorsOptions( documentId , documentType , viewScope, datatypeId): Promise<any> {
    let url= "/"+documentId+"/"+viewScope+"/falvorOptions/"+datatypeId;
    if(documentType==Types.IGDOCUMENT){
      url= 'api/igdocuments'+url;
    }else{
      url= 'api/dataype-library'+url;

    }

    const promise = new Promise<any>((resolve, reject) => {
      this.http.get(url).toPromise().then(serverDatatypeLabels => {
        resolve(serverDatatypeLabels);
      }, error => {
      });
    });
    return promise;
  }

}
