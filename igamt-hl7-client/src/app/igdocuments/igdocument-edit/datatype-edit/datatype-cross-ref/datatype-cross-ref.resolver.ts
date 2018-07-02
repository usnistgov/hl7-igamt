/**
 * Created by ena3 on 6/13/18.
 */
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
export  class DatatypeCrossRefResolver implements Resolve<any>{
  constructor(private http: HttpClient,private router : Router ) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{

    let datatypeId= route.params["datatypeId"];
    let igId=route.parent.params["igId"];
    console.log("igId");
    console.log(igId);
    datatypeId




    return Observable.of(Observable.empty);




}
}
