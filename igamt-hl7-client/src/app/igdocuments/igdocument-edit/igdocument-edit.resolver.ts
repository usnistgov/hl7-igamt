/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import {ConformanceProfilesTocService} from "../../service/indexed-db/conformance-profiles/conformance-profiles-toc.service";
import {TocDbService} from "../../service/indexed-db/toc-db.service";

@Injectable()
export  class IgdocumentEditResolver implements Resolve<any>{
  ig: any;
  segments:any[]=[];
  datatypes:any[]=[];
  profileComponents:any[]=[];

  conformanceProfiles:any[]=[];
  compositeProfiles: any[]=[];
  valueSets: any[]=[];

  constructor(private http: HttpClient,public indexedDbService: IndexedDbService,public saveService:TocDbService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
    return new Promise(
      (resolve , reject) =>{
        let igId= route.params["igId"];

        this.http.get<any>("/api/igdocuments/"+igId+"/display").subscribe(x=>{
          this.parseToc(x.toc);
          console.log(x.toc);
          console.log(this.valueSets);
          console.log(this.datatypes);
          this.indexedDbService.initializeDatabase(igId).then( ()=>{



            this.saveService.bulkAddToc(this.valueSets, this.datatypes, this.segments, this.conformanceProfiles, this.profileComponents, this.compositeProfiles).then(
              ()=>{
                resolve(x);
              },(error)=>{
                console.log("Could not add elements to client db");
                reject();

              }
            );
          },

            (error)=>{
            console.log("Could not load Ig : "+error);
            reject();
            }
          );


        });

      }
    )



  }


  parseToc(toc:any){


    for(let i =0 ; i<toc.length; i++){
      let node= toc[i];
      if(node.data.type=='PROFILE'){
        this.parseProfile(node);

      }

    }
  }

  parseProfile(profile:any) {
    for (let i = 0; i < profile.children.length; i++) {
      let node = profile.children[i];
      let converted= this.convertList(node.children);
      if (node.data.type == 'CONFORMANCEPROFILEREGISTRY'){
        this.conformanceProfiles =converted

      }
      else if (node.data.type == 'PROFILECOMPONENTSREGISTRY'){
        this.profileComponents =converted;
      }
      else if (node.data.type == 'COMPOSITEPROFILEREGISTRY'){
        this.compositeProfiles = converted;
      }
      else if (node.data.type == 'SEGMENTREGISTRY'){
        this.segments = converted;
      }
      else if (node.data.type == 'DATATYPEREGISTRY'){
        this.datatypes = converted;

        console.log(this.datatypes);
      }
      else if (node.data.type == 'VALUESETREGISTRY'){
        this.valueSets =converted;
      }

    }


  }

  convertList(list : any[]){
    let ret : any[]=[];
      for (let i=0; i<list.length;i++ ){
        ret.push({id:list[i].id,treeNode:list[i].data});
      }
    return ret;
  }





}



