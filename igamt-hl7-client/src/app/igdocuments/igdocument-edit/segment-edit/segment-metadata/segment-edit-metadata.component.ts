/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {WorkspaceService, Entity} from "../../../../service/workspace/workspace.service";
import {Md5} from "ts-md5/dist/md5";
import {Observable} from "rxjs";
import * as _ from 'lodash';

import 'rxjs/add/operator/filter';
import {TocService} from "../../toc/toc.service";
import {SegmentsService} from "../../../../service/segments/segments.service";
// import {SegmentsIndexedDbService} from "../../../../service/indexed-db/segments/segments-indexed-db.service";
import {HttpClient} from "@angular/common/http";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {SegmentsTocService} from "../../../../service/indexed-db/segments/segments-toc.service";



@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-metadata.component.html',
  styleUrls : ['./segment-edit-metadata.component.css']
})
export class SegmentEditMetadataComponent implements WithSave {
  segmentId:any;
  segmentMetadata:any;
  backup:any;
  currentNode:any;

  @ViewChild('editForm')
  private editForm: NgForm;

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService, private segmentsTocService:SegmentsTocService,private tocService:TocService){
    this.tocService.getActiveNode().subscribe(x=>{
      console.log(x);
      this.currentNode=x;
    });
  }

  ngOnInit() {
    this.segmentId = this.route.snapshot.params["segmentId"];
    this.route.data.map(data =>data.segmentMetadata).subscribe(x=>{

      this.segmentsTocService.getAll().then(segments=>{
        console.log(segments);
        this.backup=x;
        this.segmentMetadata=_.cloneDeep(this.backup);

      });

    });
  }

  reset(){
    this.segmentMetadata=_.cloneDeep(this.backup);
  }

  getCurrent(){

   return  this.segmentMetadata;
  }
  getBackup(){
    return this.backup;
  }

  isValid(){
    return !this.editForm.invalid;
  }
  save(){
    this.tocService.getActiveNode().subscribe(x=>{

        let node= x;
        node.data.data.ext= _.cloneDeep(this.segmentMetadata.ext);


      }
    );
    return this.segmentsService.saveSegmentMetadata(this.segmentId,this.segmentMetadata);


  }



}
