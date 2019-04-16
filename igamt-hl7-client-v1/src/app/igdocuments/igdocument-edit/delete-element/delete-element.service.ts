import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SectionsService} from "../../../service/sections/sections.service";
import {Types} from "../../../common/constants/types";
import {TocService} from "../service/toc.service";
import {Observable} from "rxjs";

@Injectable()
export class DeleteElementService  {

  constructor(private http: HttpClient,private sectionsService:SectionsService, private  tocService : TocService) {

  }



  deleteConformanceProfile(igId, id){
    console.log(igId+"id");
    return this.http.delete('/api/igdocuments/'+igId+'/conformanceprofiles/'+id+'/delete');

  }
  deleteSegment(igId, id){
    return this.http.delete('/api/igdocuments/'+igId+'/segments/'+id+'/delete');
  }
  deleteDatatype(igId, id){
    return this.http.delete('/api/igdocuments/'+igId+'/datatypes/'+id+'/delete');
  }
  deleteValueSet(igId, id){
    return this.http.delete('/api/igdocuments/'+igId+'/valuesets/'+id+'/delete');


  }

  deleteSection(sectionWrapper){
    return this.http.delete('api/ig/deleteSection', sectionWrapper);
  }
  deleteElement(igId, id, type){

    if(type==Types.DATATYPE){
      return this.deleteDatatype(igId, id);
    }else if(type==Types.SEGMENT){
      return this.deleteSegment(igId, id);

    }else if(type==Types.VALUESET){
      return this.deleteValueSet(igId, id);

    }else if (type==Types.CONFORMANCEPROFILE){
      return this.deleteConformanceProfile(igId, id);
    }else if(type==Types.TEXT){

     return Observable.of(id);
    }
    else{
      return null;
    }
  }

  deleteSectionClient(sectionId){
    return new Promise((resolve, reject)=>{
      this.sectionsService.getSection(sectionId).then( section =>{

          let result: any =section;

          this.deleteSection(result);
        },
        error =>{


        }

      );

    })

  }







}
