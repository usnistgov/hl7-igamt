/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';



@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-predef.component.html',
  styleUrls : ['./segment-edit-predef.component.css']
})
export class SegmentEditPredefComponent {
  currentUrl:any;
  segmentId:any;
  segmentPredef:any;

  constructor(private route: ActivatedRoute, private  router : Router){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
    this.segmentId= this.route.snapshot.params["segmentId"];
    this.route.data.map(data => data.currentSegmentPredef).subscribe(x => {
      console.log("SEGMENT Predef LOADING");
      console.log(x);
      this.segmentPredef = x;
    });
  }
}
