/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {DatatypesService} from "../datatypes.service";


@Injectable()
export  class DatatypeEditPostdefResolver implements Resolve<any>{
    constructor(private http: HttpClient,private datatypeService: DatatypesService) {

    }

    resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
        let datatypeId= route.params["datatypeId"];
        return this.datatypeService.getDatatypePostDef(datatypeId);
    }
}



