import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SectionsService} from "../../../service/sections/sections.service";
import {Types} from "../../../common/constants/types";
import {TocService} from "../service/toc.service";
import {Observable} from "rxjs";

@Injectable()
export class LibDeleteElementService  {

  constructor(private http: HttpClient) {

  }




  deleteDatatype(libId, id){
    return this.http.delete('/api/datatype-library/'+libId+'/datatypes/'+id+'/delete');
  }

  deleteElement(libId, id, type){
    if(type==Types.DATATYPE){
      return this.deleteDatatype(libId, id);
    }
    else{
      return null;
    }
  }







}
