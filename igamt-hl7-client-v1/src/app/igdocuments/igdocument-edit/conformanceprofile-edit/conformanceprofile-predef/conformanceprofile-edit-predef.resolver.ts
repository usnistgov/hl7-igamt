/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ConformanceProfilesService} from "../conformance-profiles.service";



@Injectable()
export  class ConformanceprofileEditPredefResolver implements Resolve<any>{


  constructor(private http: HttpClient,private conformanceProfilesService: ConformanceProfilesService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
      let conformanceprofileId= route.params["conformanceprofileId"];
      return this.conformanceProfilesService.getConformanceProfilePreDef(conformanceprofileId);

  }



}



