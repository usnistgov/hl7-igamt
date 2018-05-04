/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";

import {SegmentsService} from "../../../../service/segments/segments.service";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";

@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-structure.component.html',
  styleUrls : ['./segment-edit-structure.component.css']
})
export class SegmentEditStructureComponent {
  currentUrl:any;
  segmentId:any;
  segmentStructure:any;
  usages:any;

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private configService : GeneralConfigurationService, private segmentsService : SegmentsService){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

    ngOnInit() {
        //TODO temp
        this.indexedDbService.initializeDatabase('5a203e2984ae98b394159cb2');
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.segmentsService.getSegmentStructure(this.segmentId, structure  => {
            this.segmentStructure = structure;
        });
    }

}
