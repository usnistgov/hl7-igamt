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

@Injectable()
export  class IgMetaDataResolver implements Resolve<any>{
  constructor(private http: HttpClient,private router : Router ) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{

                if(!route.parent.data["currentIg"]){
                  this.router.navigate(["/404"]);
                  return Observable.empty();
                }
                else{

                 return Observable.of(route.parent.data["currentIg"].metadata)
                }

  }






}
