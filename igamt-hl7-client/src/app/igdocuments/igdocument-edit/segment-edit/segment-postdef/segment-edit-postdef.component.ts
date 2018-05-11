/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';



@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-postdef.component.html',
  styleUrls : ['./segment-edit-postdef.component.css']
})
export class SegmentEditPostdefComponent {
  currentUrl:any;
  segmentId:any;
  segmentPostdef:any;

  constructor(private route: ActivatedRoute, private  router : Router){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
    this.segmentId= this.route.snapshot.params["segmentId"];
    this.route.data.map(data => data.currentSegmentPostdef).subscribe(x => {
      console.log("SEGMENT Postdef LOADING");
      console.log(x);
      this.segmentPostdef = x;
    });
  }
}
