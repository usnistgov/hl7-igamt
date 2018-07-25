import { Injectable } from '@angular/core';
import {IgErrorService} from "../ig-error/ig-error.service";
import {PrimeDialogAdapter} from "../../../common/prime-ng-adapters/prime-dialog-adapter";
import {HttpClient} from "@angular/common/http";
import {SectionsService} from "../../../service/sections/sections.service";
import {Types} from "../../../common/constants/types";

@Injectable()
export class DeleteElementService  {

  constructor(private http: HttpClient,private sectionsService:SectionsService) {

  }



  deleteConformanceProfile(igId, id){
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
      //return this.deleteSection(igId, id);
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
