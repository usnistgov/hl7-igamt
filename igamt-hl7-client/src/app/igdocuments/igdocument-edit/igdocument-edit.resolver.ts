/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export  class IgdocumentEditResolver implements Resolve<any>{
  constructor(private http: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{
    console.log("Calling resolver");

    let igId= route.params["igId"];
    console.log(igId);

    console.log("calling url with "+igId);
    console.log(route);

    return this.http.get("/api/igdocuments/"+igId+"/display");
  }

}
