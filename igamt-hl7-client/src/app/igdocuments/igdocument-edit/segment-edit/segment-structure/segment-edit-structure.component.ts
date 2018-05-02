/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";



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

  constructor(private route: ActivatedRoute, private  router : Router, private configService : GeneralConfigurationService){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
    this.segmentId= this.route.snapshot.params["segmentId"];
    this.route.data.map(data => data.currentSegmentStructure).subscribe(x => {
      console.log("SEGMENT STRUCTURE LOADING");
      console.log(x);
      this.segmentStructure = x;
    });
    this.usages = this.configService.usages;
  }
}
