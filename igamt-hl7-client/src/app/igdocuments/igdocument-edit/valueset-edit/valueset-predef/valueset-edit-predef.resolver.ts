/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ValuesetsService} from "../valuesets.service";


@Injectable()
export  class ValuesetEditPredefResolver implements Resolve<any>{
    constructor(private http: HttpClient,private valuesetService: ValuesetsService) {

    }

    resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
        let valuesetId= route.params["valuesetId"];
        return this.valuesetService.getValuesetPreDef(valuesetId);
    }
}



