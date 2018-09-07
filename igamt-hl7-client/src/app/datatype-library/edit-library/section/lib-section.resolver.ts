/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {IndexedDbService} from "../../../service/indexed-db/indexed-db.service";

@Injectable()
export  class LibSectionResolver implements Resolve<any>{
  constructor(private http: HttpClient,private router : Router,private dbService:IndexedDbService) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{

          let sectionId= route.params["sectionId"];



          //return this.sectionService.getSection(sectionId);
          return this.getSection(sectionId);

  }

  findSectionById(sections:any[], id){

    //console.log(sections);
    //console.log(id);
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

  getSection(id){
    return new Promise((resolve, reject)=>{
      this.dbService.getDataTypeLibrary().then(
        x => {
          //console.log(x);
          if(x.toc){
            //console.log(x.toc);
            let section:any=this.findSectionById(x.toc,id).data;
            section.id=id;

            resolve(section);
          }else{
            //console.log("Could not find the toc ")
          }
        },
        error=>{

          //console.log("Could not find the toc ")

        }
      )
    })
  };



}
