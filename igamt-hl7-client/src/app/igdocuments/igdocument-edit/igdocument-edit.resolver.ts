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
import reject = Q.reject;

@Injectable()
export  class IgdocumentEditResolver implements Resolve<any>{
  ig: any;
  segments:any[];
  datatypes:any[];
  profileComponents:any[];

  conformanceProfiles:any[];
  compositeProfiles: any[];
  valueSets: any[];

  constructor(private http: HttpClient,public indexedDbService: IndexedDbService,public cps:ConformanceProfilesTocService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
    console.log("Calling resolver");
    return new Promise(
      (resolve , reject) =>{
        let igId= route.params["igId"];

        this.http.get<any>("/api/igdocuments/"+igId+"/display").subscribe(x=>{
          this.indexedDbService.initializeDatabase(igId).then( ()=>{

            this.parseToc(x.toc);
            resolve(x);
          });


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
      if (node.data.type == 'CONFORMANCEPROFILEREGISTRY'){
        this.conformanceProfiles =this.convertList(node.children);
        console.log(this.cps.bulkAdd(this.conformanceProfiles));

      }
      else if (node.data.type == 'PROFILECOMPONENTSREGISTRY'){
        this.profileComponents = node.children;
      }
      else if (node.data.type == 'COMPOSITEPROFILEREGISTRY'){
        this.compositeProfiles = node.children;
      }
      else if (node.data.type == 'SEGMENTREGISTRY'){
        this.segments = node.children;
      }
      else if (node.data.type == 'DATATYPEREGISTRY'){
        this.datatypes = node.children;
      }
      else if (node.data.type == 'VALUESETREGISTRY'){
        this.valueSets = node.children;
      }

    }


  }

  convertList(list : any[]){
    let ret : any[]=[];
    for (let i=0; i<list.length;i++ ){
      ret.push({id:list[i].id,treeNode:list[i].data});
    }
    console.log("Object to push ");

    console.log(ret);
    return ret;
  }





}



