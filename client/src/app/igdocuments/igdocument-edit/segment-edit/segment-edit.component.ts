/**
 * Created by hnt5 on 10/23/17.
 */
import {Component, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {WorkspaceService, Entity} from "../../../service/workspace/workspace.service";
import {Md5} from "ts-md5/dist/md5";
import {Observable} from "rxjs";

import 'rxjs/add/operator/filter';



@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit.component.html',
  styleUrls : ['./segment-edit.component.css']
})
export class SegmentEditComponent {

  _segment;
  segmentEditTabs : any[];
  private currentHash;




  @Input() set segment(segment : any){
    this._segment = segment;
  }

  constructor(private _ws : WorkspaceService,    private route: ActivatedRoute,
              private router: Router){

     _ws.getCurrent(Entity.SEGMENT).subscribe(data =>this.segment=data);



  };

  ngOnInit(){
    this.segmentEditTabs = [
      {label: 'Metadata', icon: 'fa-info-circle', routerLink:'./metadata'},
      {label: 'Definition', icon: 'fa-table', routerLink:'./definition'},
      {label: 'Delta', icon: 'fa-table', routerLink:'./delta'},
      {label: 'Cross-Reference', icon: 'fa-link', routerLink:'./crossref'}
    ];
  }
  ngOnDestroy(){

  }

  hash(){
    let str=JSON.stringify(this._segment);
    console.log("Calling Hash ");
    console.log(Md5.hashStr(str));
    return Md5.hashStr(str);
  }

}
