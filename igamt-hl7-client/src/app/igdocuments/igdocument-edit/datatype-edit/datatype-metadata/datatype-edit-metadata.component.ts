/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

import * as _ from 'lodash';

import 'rxjs/add/operator/filter';
import {TocService} from "../../service/toc.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {DatatypesService} from "../datatypes.service";
import {IgErrorService} from "../../ig-error/ig-error.service";
import {HasFroala} from "../../../../configuration/has-froala";



@Component({
  selector : 'datatype-edit',
  templateUrl : './datatype-edit-metadata.component.html',
  styleUrls : ['./datatype-edit-metadata.component.css']
})
export class DatatypeEditMetadataComponent extends HasFroala implements WithSave {
   datatypeId:any;
   datatypeMetadata:any;
  backup:any;
  currentNode:any;
  changeItems: any[]=[];


  @ViewChild('editForm')
  private editForm: NgForm;

  constructor(private route: ActivatedRoute, private  router : Router, private  datatypesService : DatatypesService,private tocService:TocService,private igErrorService:IgErrorService ){
    super();

  }

  ngOnInit() {
    this.datatypeId = this.route.snapshot.params["datatypeId"];
    this.route.data.map(data =>data.datatypeMetadata).subscribe(x=>{


      this.backup=x;
      this.datatypeMetadata=_.cloneDeep(this.backup);


    });
  }

  reset(){
    this.datatypeMetadata=_.cloneDeep(this.backup);

  }

  getCurrent(){

    return  this.datatypeMetadata;
  }
  getBackup(){
    return this.backup;
  }

  canSave(){
    if(this.datatypeMetadata.readOnly){
      return false;
    }else{
      return  this.datatypeMetadata.ext!==null&&this.datatypeMetadata.ext !=="";
    }

  }

  save(): Promise<any>{
    this.createChanges(this.datatypeMetadata,this.backup);
    return new Promise((resolve, reject)=>{

        let treeModel=this.tocService.getTreeModel();
        let node = treeModel.getNodeById(this.datatypeId);

        console.log(node);

        node.data.data.label= this.datatypeMetadata.name;
        node.data.data.ext= this.datatypeMetadata.ext;
        this.tocService.setTreeModelInDB(treeModel).then(x=>{


          this.datatypesService.save(this.datatypeId,this.changeItems).then( saved => {

              this.datatypeMetadata.label=this.datatypeMetadata.name+"_"+this.datatypeMetadata.ext;
              this.backup = _.cloneDeep(this.datatypeMetadata);

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
    return  this.datatypeMetadata.ext !== this.backup.ext||this.datatypeMetadata.authorNote!==this.backup.authorNote;

  }

  createChanges(elm, backup){
    this.changeItems=[];

    if(elm.ext !== backup.ext){

      let obj:any={};
      obj.location=this.datatypeId;
      obj.propertyType="EXT";
      obj.propertyValue=elm.ext;
      obj.oldPropertyValue=backup.ext;
      obj.position=-1;
      obj.changeType="UPDATE";
      this.changeItems.push(obj);
    }
    if(elm.authorNote!==backup.authorNote){

      let obj:any={};
      obj.location=this.datatypeId;
      obj.propertyType="AUTHORNOTES";
      obj.propertyValue=elm.ext;
      obj.oldPropertyValue=backup.ext;
      obj.position=-1;
      obj.changeType="UPDATE";
      this.changeItems.push(obj);
    }

  }
}
