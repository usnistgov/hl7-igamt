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
import {IgErrorService} from "../../ig-error/ig-error.service";
import {HasFroala} from "../../../../configuration/has-froala";



@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-metadata.component.html',
  styleUrls : ['./segment-edit-metadata.component.css']
})
export class SegmentEditMetadataComponent extends HasFroala implements WithSave {
  segmentId:any;
  segmentMetadata:any;
  backup:any;
  currentNode:any;
  changeItems: any[]=[];


  @ViewChild('editForm')
  private editForm: NgForm;

  constructor(private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService,private tocService:TocService,private igErrorService:IgErrorService ){
          super();

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
    this.editForm.control.markAsPristine();

  }

  getCurrent(){

   return  this.segmentMetadata;
  }
  getBackup(){
    return this.backup;
  }

  canSave(){
    if(this.segmentMetadata.readOnly){
      return false;
    }else{
     return  this.segmentMetadata.ext!==null||this.segmentMetadata !=="";
    }

  }

  save(): Promise<any>{
    this.createChanges(this.segmentMetadata,this.backup);
    return new Promise((resolve, reject)=>{

        let treeModel=this.tocService.getTreeModel();
        let node = treeModel.getNodeById(this.segmentId);

        console.log(node);

        node.data.data.label= this.segmentMetadata.name;
        node.data.data.ext= this.segmentMetadata.ext;
        this.tocService.setTreeModelInDB(treeModel).then(x=>{


          this.segmentsService.save(this.segmentId,this.changeItems).then( saved => {

              this.segmentMetadata.label=this.segmentMetadata.name+"_"+this.segmentMetadata.ext;
            this.backup = _.cloneDeep(this.segmentMetadata);

            this.editForm.control.markAsPristine();


            resolve(true);
          }, error => {
            console.log("Error Saving");
            reject(error);
            }
          );

        }, tocError=>{
          console.log("TOC NOT SAVED")
          reject(tocError);
        })
      }
    )

  };

  hasChanged(){
   return  this.segmentMetadata.ext !== this.backup.ext||this.segmentMetadata.authorNote!==this.backup.authorNote;

  }

  createChanges(elm, backup){
    this.changeItems=[];

    if(elm.ext !== backup.ext){

      let obj:any={};
      obj.location=this.segmentId;
      obj.propertyType="EXT";
      obj.propertyValue=elm.ext;
      obj.oldPropertyValue=backup.ext;
      obj.position=-1;
      obj.changeType="UPDATE";
      this.changeItems.push(obj);
    }
    if(elm.authorNote!==backup.authorNote){

      let obj:any={};
      obj.location=this.segmentId;
      obj.propertyType="AUTHORNOTES";
      obj.propertyValue=elm.ext;
      obj.oldPropertyValue=backup.ext;
      obj.position=-1;
      obj.changeType="UPDATE";
      this.changeItems.push(obj);
    }

  }




}
