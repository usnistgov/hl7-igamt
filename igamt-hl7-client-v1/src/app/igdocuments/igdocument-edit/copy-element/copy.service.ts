import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Types} from "../../../common/constants/types";
import {SectionsService} from "../../../service/sections/sections.service";
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

@Injectable()
export class CopyService {

  constructor(private http: HttpClient,private sectionsService:SectionsService) {

  }



  copyConformanceProfile(wrapper){
    return this.http.post('/api/igdocuments/'+wrapper.igId+'/conformanceprofiles/'+wrapper.id+'/clone', wrapper);
  }
  copySegment(wrapper){
    return this.http.post('/api/igdocuments/'+wrapper.igId+'/segments/'+wrapper.id+'/clone', wrapper);
  }
  copyDatatype(wrapper){
    return this.http.post('/api/igdocuments/'+wrapper.igId+'/datatypes/'+wrapper.id+'/clone', wrapper);
  }
  copyValueSet(wrapper){
    return this.http.post('/api/igdocuments/'+wrapper.igId+'/valuesets/'+wrapper.id+'/clone', wrapper);
  }

  copySection(sectionWrapper){
    return this.http.post('api/ig/copySection', sectionWrapper);
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
    }else if(type==Types.TEXT){
      return this.copySection(wrapper);
    }
    else{
      return null;
    }
  }

  copySectionClient(sectionId){
    return new Promise((resolve, reject)=>{
      this.sectionsService.getSection(sectionId).then( section =>{
          let result: any =section;
          this.cloneSection(result);
        },
        error =>{
        }
      );
    })

  }

  cloneSection(section: any){
        let ret : any;
        ret.id = UUID.UUID();
        ret.description= section.description;
        ret.type=Types.TEXT;
        ret.position=0;
        ret.label=section.label;
        ret.children=[];
        if(section.children && section.children.length>0) {
          _.forEach(section.children, function (s) {
            ret.children.push(this.cloneSection(s));

          })

        }
        return ret;
  }





}
