/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

import * as _ from 'lodash';

import 'rxjs/add/operator/filter';
import {TocService} from "../../service/toc.service";
import {SegmentsService} from "../../../../service/segments/segments.service";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";



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

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService,private tocService:TocService){
    this.tocService.getActiveNode().subscribe(x=>{
      console.log(x);
      this.currentNode=x;
    });
  }

  ngOnInit() {
    this.segmentId = this.route.snapshot.params["segmentId"];
    this.route.data.map(data =>data.segmentMetadata).subscribe(x=>{


        this.backup=x;
        this.segmentMetadata=_.cloneDeep(this.backup);


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
    console.log("saving segment Meta Data");

    return this.segmentsService.saveSegmentMetadata(this.segmentId,this.segmentMetadata);


  }



}
