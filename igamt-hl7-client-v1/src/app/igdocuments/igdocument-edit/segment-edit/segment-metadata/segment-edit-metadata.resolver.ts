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


@Injectable()
export  class SegmentEditMetadatResolver implements Resolve<any> {


  constructor(private http: HttpClient, private segmentService: SegmentsService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Promise<any> {
    const segmentId = route.params['segmentId'];
    return this.segmentService.getSegmentMetadata(segmentId);
  }



}



