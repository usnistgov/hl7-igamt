/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export  class SegmentMetadataResolver implements Resolve<any>{
  constructor(private http: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{
    let segmentId= route.params["segmentId"];
    return this.http.get("/api/segments/"+segmentId+"/metadata");
  }
}
