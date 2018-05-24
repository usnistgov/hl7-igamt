/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {SegmentsService} from "../../../../service/segments/segments.service";



@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-predef.component.html',
  styleUrls : ['./segment-edit-predef.component.css']
})
export class SegmentEditPredefComponent {
    currentUrl:any;
    segmentId:any;
    segmentPredef:any;

    constructor(private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService, private http:HttpClient){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.segmentsService.getSegmentPreDef(this.segmentId).then( data  => {

            this.segmentPredef = data;

        });
    }
}
