import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {SegmentsService} from "../segments.service";


@Injectable()
export  class SegmentEditConformanceStatementsResolver implements Resolve<any>{
    constructor(private http: HttpClient,private segmentService: SegmentsService) {}

    resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
        let segmentId= route.params["segmentId"];
        return this.segmentService.getSegmentConformanceStatements(segmentId);
    }
}



