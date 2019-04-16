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
import {SegmentsService} from "../segments.service";
import {CoConstraintTable} from './coconstraint.domain';
import {CoConstraintTableService} from './coconstraint-table.service';


@Injectable()
export  class CoConstraintTableResolver implements Resolve<CoConstraintTable>{


    constructor(private http: HttpClient, private ccService: CoConstraintTableService) {

    }

    resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
        let segmentId = route.params["segmentId"];
        return this.ccService.fetch_coconstraint_table(segmentId);
    }
}



