import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class DatatypeEvolutionService {

  constructor(private http : HttpClient) { }

  getClasses(){
    return  this.http.get("api/datatype-library/classification");

  }


  compare(name,version1,version2){

    return this.http.get("api/datatype-library/comparedatatype/"+name+"/"+version1+"/"+version2);

  }





}
