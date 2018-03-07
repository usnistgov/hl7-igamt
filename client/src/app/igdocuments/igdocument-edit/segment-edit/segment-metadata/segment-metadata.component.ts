import { Component, OnInit } from '@angular/core';
import {WorkspaceService, Entity} from "../../../../service/workspace/workspace.service";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-segment-metadata',
  templateUrl: './segment-metadata.component.html',
  styleUrls: ['./segment-metadata.component.css']
})
export class SegmentMetadataComponent implements OnInit {
  segment:any;

  constructor(private _ws : WorkspaceService,
              private db : IndexedDbService) { }

  ngOnInit() {
    this._ws.getCurrent(Entity.SEGMENT).subscribe(data=> {this.segment=data});

  }

  saveSegment(){
    console.log(this.segment);
    this.db.saveSegment(this.segment);
    this._ws.setCurrent(Entity.SEGMENT,this.segment);
  }

}
