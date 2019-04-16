import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Types} from "../../../common/constants/types";
import {SectionsService} from "../../../service/sections/sections.service";
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

@Injectable()
export class LibCopyService {

  constructor(private http: HttpClient,private sectionsService:SectionsService) {

  }


  copyDatatype(wrapper){
    return this.http.post('/api/datatype-library/'+wrapper.libId+'/datatypes/'+wrapper.id+'/clone', wrapper);
  }
  copySection(sectionWrapper){
    return this.http.post('api/ig/datatype-library', sectionWrapper);
  }

  copyElement(wrapper,type){

    if(type==Types.DATATYPE){
      return this.copyDatatype(wrapper);
    }else if(type==Types.TEXT){
      return this.copySection(wrapper);
    }
    else{
      return null;
    }
  }




}
