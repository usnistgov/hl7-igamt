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
import {HttpParams} from "@angular/common/http";

@Injectable()
export  class Igsresolver implements Resolve<any>{
  constructor(private http: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{
    console.log(route);
    let params= route.queryParams;


    if (params.type && params.type == "USER") {
      let httpParams = new HttpParams().append("type", "PRIVATE");

      return this.http.get("api/igdocuments", {params:httpParams});

    }else if (params.type && params.type == "ALL") {

      let httpParams = new HttpParams().append("type", "ALL");

      return this.http.get("api/igdocuments", {params:httpParams});

    }else if (params.type && params.type == "PRELOADED") {
      let httpParams = new HttpParams().append("type", "PUBLIC");

      return this.http.get("api/igdocuments/preloaded");

    }



  }

}
