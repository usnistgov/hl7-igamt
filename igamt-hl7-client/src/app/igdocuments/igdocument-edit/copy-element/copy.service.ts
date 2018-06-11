import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Types} from "../../../common/constants/types";

@Injectable()
export class CopyService {

  constructor(private http: HttpClient) {

  }



  copyConformanceProfile(wrapper){
    return this.http.post('api/ig/copyConformanceProfile', wrapper);

  }
  copySegment(wrapper){
    return this.http.post('api/ig/copySegment', wrapper);

  }
  copyDatatype(wrapper){
    return this.http.post('api/ig/copyDatatype', wrapper);

  }
  copyValueSet(wrapper){
    return this.http.post('api/ig/copyValueSet', wrapper);

  }

  copyElement(wrapper,type){

    if(type==Types.DATATYPE){
      return this.copyDatatype(wrapper);
    }else if(type==Types.SEGMENT){
      return this.copySegment(wrapper);

    }else if(type==Types.VALUESET){
      return this.copyValueSet(wrapper);

    }else if (type==Types.CONFORMANCEPROFILE){
      return this.copyConformanceProfile(wrapper);
    }else{
      return null;
    }
  }
}
