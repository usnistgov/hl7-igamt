/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";

@Injectable()
export  class IgdocumentEditResolver implements Resolve<any>{
  ig: any =null;
  segments:any[];
  datatypes:any[];
  profileComponents:any[];

  conformanceProfiles:any[];
  compositeProfiles: any[];
  valueSets: any[];

  constructor(private http: HttpClient,public indexedDbService: IndexedDbService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{
    console.log("Calling resolver");

    let igId= route.params["igId"];
    console.log(igId)
      this.http.get("/api/igdocuments/"+igId+"/display").subscribe(x=>{
       this.ig= x;
        this.parseToc(this.ig.toc);

    });

    console.log("Calling db ");

    this.indexedDbService.addTocElements(this.profileComponents,this.conformanceProfiles,this.compositeProfiles,this.segments,this.valueSets);

    return Observable.of(this.ig);
  }


  parseToc(toc:any){


    for(let i =0 ; i<toc.children.length; i++){
      let node= toc.children[i];
      if(node.data.type=='PROFILE'){
        this.parseProfile(node);

      }


    }
  }

  parseProfile(profile:any) {
    for (let i = 0; i < profile.children.length; i++) {
      let node = profile.children[i];
      if (node.data.type == 'CONFORMANCEPROFILEREGISTRY'){
        this.conformanceProfiles = node.children;
      }
      else if (node.data.type == 'PROFILECOMPONENTSREGISTRY'){
        this.profileComponents = node.children;
      }
      else if (node.data.type == 'COMPOSITEPROFILEREGISTRY'){
        this.compositeProfiles = node.children;
      }
      else if (node.data.type == 'SEGMENTRGISTRY'){
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





}



