/**
 * Created by ena3 on 4/16/18.
 */
/**
 * Created by ena3 on 12/6/17.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export  class LibraryListResolver implements Resolve<any> {
  libtype: any;

  constructor(private http: HttpClient, private ar: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {


    console.log(route);
      let params= route.queryParams;
        if (params.libType && params.libType == "USER") {

            return this.http.get('/api/datatype-libraries');

        }else if (params.libType && params.libType == "PUBLISHED") {
          return this.http.get('/api/datatype-libraries/published');

        }


  }
}
