/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ConformanceProfilesService} from "../conformance-profiles.service";


@Injectable()
export  class ConformanceprofileEditConformancestatementsResolver implements Resolve<any>{
    constructor(private http: HttpClient,private conformanceProfilesService: ConformanceProfilesService) {}

    resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
        let conformanceprofileId= route.params["conformanceprofileId"];
        return this.conformanceProfilesService.getConformanceProfileConformanceStatements(conformanceprofileId);
    }
}



