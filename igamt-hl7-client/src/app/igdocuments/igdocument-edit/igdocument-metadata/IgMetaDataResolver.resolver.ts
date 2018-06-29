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
import {IndexedDbService} from "../../../service/indexed-db/indexed-db.service";

@Injectable()
export  class IgMetaDataResolver implements Resolve<any>{
  // constructor(private http: HttpClient,private router : Router ) {
  // }
  //
  // resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{
  //   console.log("calling resolver");
  //
  //               if(!route.parent.data["currentIg"]){
  //                 this.router.navigate(["/404"]);
  //                 return Observable.empty();
  //               }
  //               else{
  //                 console.log(route.parent.data["currentIg"].metadata);
  //                return Observable.of(route.parent.data["currentIg"].metadata)
  //               }
  //
  // }
  //
  //
  //


  constructor(private http: HttpClient,private router : Router,private dbService:IndexedDbService) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{

    return this.getMetaData();

  }




  getMetaData(){
    return new Promise((resolve, reject)=>{
      this.dbService.getIgDocument().then(
        x => {


            resolve(x.metadata);

        },
        error=>{

          this.router.navigate(["/404"]);

          //console.log("Could not find the MetaData ")

        }
      )
    })
  };


}
