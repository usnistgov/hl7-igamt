/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {observable} from "rxjs/symbol/observable";

@Injectable()
export  class SectionResolver implements Resolve<any>{
  constructor(private http: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{
    console.log("Calling resolver");



    route.data.map(data =>data.currentIg).subscribe(x=>{


      return observable.of(x);

    });
    return observable.of(null);

  }



  findSectionInIG()={}

}
