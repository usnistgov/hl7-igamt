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
import {SegmentsService} from "../../../../service/segments/segments.service";


@Injectable()
export  class SegmentEditStructureResolver implements Resolve<any>{


  constructor(private http: HttpClient,private segmentService: SegmentsService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{
    return new Promise(
      (resolve , reject) =>{
        let segmentId= route.params["segmentId"];
        this.segmentService.getSegmentStructure(segmentId, structure  => {
            console.log(structure);
          resolve(structure);
        });
      }
    )
  }
}



