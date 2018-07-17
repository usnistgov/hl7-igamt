/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

import * as _ from 'lodash';

import 'rxjs/add/operator/filter';
import {TocService} from "../../service/toc.service";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {SegmentsService} from "../segments.service";



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

  constructor(private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService,private tocService:TocService){

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

  save(): Promise<any>{
    return new Promise((resolve, reject)=>{

        let treeModel=this.tocService.getTreeModel();
        let node = treeModel.getNodeById(this.segmentId);

        console.log(node);

        node.data.data.label= this.segmentMetadata.name;
        node.data.data.ext= this.segmentMetadata.ext;
        this.tocService.setTreeModel(treeModel).then(x=>{


          this.segmentsService.saveSegmentMetadata(this.segmentId,this.segmentMetadata).then( saved => {


            this.backup = _.cloneDeep(this.segmentMetadata);

            this.editForm.control.markAsPristine();


            resolve(true);
          }, error => {
            console.log("Error Saving");

            }
          );

        })
      }
    )

  };



}
