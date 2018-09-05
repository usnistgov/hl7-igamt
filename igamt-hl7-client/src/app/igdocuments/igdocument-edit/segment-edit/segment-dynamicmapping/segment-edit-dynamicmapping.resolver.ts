/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {SegmentsService} from "../segments.service";


@Injectable()
export  class SegmentEditDynamicMappingResolver implements Resolve<any>{
    constructor(private segmentService: SegmentsService) {}

    resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
        let segmentId= route.params["segmentId"];
        return this.segmentService.getSegmentDynamicMapping(segmentId);
    }
}



