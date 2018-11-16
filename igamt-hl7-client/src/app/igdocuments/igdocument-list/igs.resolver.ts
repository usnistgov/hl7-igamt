/**
 * Created by ena3 on 4/16/18.
 */
/**
 * Created by ena3 on 12/6/17.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export  class Igsresolver implements Resolve<any>{
  constructor(private http: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{
    console.log(route);
    let params= route.queryParams;

    if (params.type && params.type == "USER") {

      return this.http.get("api/igdocuments");

    }else if (params.type && params.type == "ALL") {

      return this.http.get("api/igdocuments/all");

    }else if (params.type && params.type == "PRELOADED") {

      return this.http.get("api/igdocuments/preloaded");

    }



  }

}
