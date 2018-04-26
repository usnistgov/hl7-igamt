/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {observable} from "rxjs/symbol/observable";
import {forEach} from "@angular/router/src/utils/collection";

@Injectable()
export  class SectionResolver implements Resolve<any>{
  constructor(private http: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Observable<any>{
    console.log("Calling resolver Section");
    console.log(route);

    let path = route.params["sectionId"];
      let splitted= path.split(".");
      let ig:any = localStorage.getItem("currentIg");

    let intTable=[];
    splitted.forEach(x=>{
      intTable.push(parseInt(x));
    });

    //return Observable.of(true);


    return null;
  }



  findSectionInIG(ig:any,  path: string[]){
    let sections=ig.content.toc.children[0].children;








  }

}
