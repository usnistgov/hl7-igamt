/**
 * Created by ena3 on 6/13/18.
 */
/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {observable} from "rxjs/symbol/observable";
import {forEach} from "@angular/router/src/utils/collection";
import {TocService} from "../../service/toc.service";

@Injectable()
export  class DatatypeCrossRefResolver implements Resolve<any>{
  constructor(private http: HttpClient,private router : Router ,private tocService :TocService, private acr:ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{

    let datatypeId= route.params["datatypeId"];
    let igId= route.parent.parent.params["igId"];

    return this.http.get( "api/igdocuments/"+igId+"/datatypes/"+datatypeId+"/crossref");

  }
}
