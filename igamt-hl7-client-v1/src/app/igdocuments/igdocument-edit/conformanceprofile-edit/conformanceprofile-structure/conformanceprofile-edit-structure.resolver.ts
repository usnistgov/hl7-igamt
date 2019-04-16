import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ConformanceProfilesService} from "../conformance-profiles.service";


@Injectable()
export  class ConformanceprofileEditStructureResolver implements Resolve<any>{
    constructor(private http: HttpClient,private conformanceProfilesService: ConformanceProfilesService) {

    }

    resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
        let conformanceprofileId= route.params["conformanceprofileId"];
        return this.conformanceProfilesService.getConformanceProfileStructure(conformanceprofileId);
    }
}



