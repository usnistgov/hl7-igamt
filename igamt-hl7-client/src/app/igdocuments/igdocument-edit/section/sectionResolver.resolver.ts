/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {observable} from "rxjs/symbol/observable";
import {forEach} from "@angular/router/src/utils/collection";
import {SectionsService} from "../../../service/sections/sections.service";

@Injectable()
export  class SectionResolver implements Resolve<any>{
  constructor(private http: HttpClient,private router : Router,private sectionService: SectionsService ) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{

          let sectionId= route.params["sectionId"];

          return this.sectionService.getSection(sectionId);

  }



  findSectionById(sections:any[], id){

    console.log(sections);
    console.log(id);
    for(let i=0;i<sections.length;i++){
      let section = this.findInSideSection(sections[i],id);
      if(section!=null){
        return section;
      }

    }
    return null;

  }

  findInSideSection(section, id){
      if(section.id&& section.id==id){
        return section;
      }
      if(section.children && section.children.length>0){
          for(let i=0;i<section.children.length;i++){
            let s= this.findInSideSection(section.children[i],id);
            if(s!=null){
              return s;
            }

          }

        }


      return null;
  }




}
