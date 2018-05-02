/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {WorkspaceService, Entity} from "../../../../service/workspace/workspace.service";
import {Md5} from "ts-md5/dist/md5";
import {Observable} from "rxjs";

import 'rxjs/add/operator/filter';
import {TocService} from "../../toc/toc.service";



@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-metadata.component.html',
  styleUrls : ['./segment-edit-metadata.component.css']
})
export class SegmentEditMetadataComponent {
  currentUrl:any;
  segmentId:any;
  segmentMetadata:any;

  constructor(private route: ActivatedRoute, private  router : Router){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
    this.segmentId= this.route.snapshot.params["segmentId"];
    this.route.data.map(data => data.currentSegmentMetadata).subscribe(x => {
      console.log("SEGMENT METADATA LOADING");
      console.log(x);
      this.segmentMetadata = x;
    });
  }
}
