import { Injectable } from '@angular/core';
import {Types} from "../../constants/types";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class SegmentColService {

  constructor(private http: HttpClient) { }

  public getSegmentFlavorsOptions(documentId , viewScope, segmentId): Promise<any> {
    let url= "api/igdocuments/"+documentId+"/"+viewScope+"/segmentFalvorOptions/"+segmentId;
    const promise = new Promise<any>((resolve, reject) => {
      this.http.get(url).toPromise().then(serverSegmentLabels => {
        resolve(serverSegmentLabels);
      }, error => {
      });
    });
    return promise;
  }

}
