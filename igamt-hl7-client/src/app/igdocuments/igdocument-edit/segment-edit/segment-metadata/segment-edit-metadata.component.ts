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
import {SegmentsService} from "../../../../service/segments/segments.service";
// import {SegmentsIndexedDbService} from "../../../../service/indexed-db/segments/segments-indexed-db.service";
import {HttpClient} from "@angular/common/http";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";



@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-metadata.component.html',
  styleUrls : ['./segment-edit-metadata.component.css']
})
export class SegmentEditMetadataComponent {
  currentUrl:any;
  segmentId:any;
  segmentMetadata:any;

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService, private http:HttpClient){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
      this.indexedDbService.initializeDatabase('5a203e2984ae98b394159cb2');
    this.segmentId= this.route.snapshot.params["segmentId"];
    console.log("Segment Metadata init");
    console.log(this.segmentId);

    this.segmentsService.getSegmentMetadata(this.segmentId, function(metadata){
      console.log("CallBack for getSegmentMetadata");
      console.log(metadata);
    });


    this.route.data.map(data => data.currentSegmentMetadata).subscribe(x => {
      this.segmentMetadata = x;
    });
  }
}
