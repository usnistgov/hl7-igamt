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
import {LibDatatypesService} from "../lib-datatypes.service";
import {HasFroala} from "../../../../configuration/has-froala";
import {LibErrorService} from "../../lib-error/lib-error.service";
import {Types} from "../../../../common/constants/types";



@Component({
  selector : 'datatype-edit',
  templateUrl : './datatype-edit-metadata.component.html',
  styleUrls : ['./datatype-edit-metadata.component.css']
})
export class LibDatatypeEditMetadataComponent extends HasFroala implements WithSave {
  datatypeId:any;
  datatypeMetadata:any;
  backup:any;
  currentNode:any;
  namingIndicators : any[];

  @ViewChild('editForm')
  private editForm: NgForm;

  constructor(private route: ActivatedRoute, private  router : Router, private datatypesService : LibDatatypesService, private tocService:TocService, private libErrorService:LibErrorService ){
    super();
  }

  ngOnInit() {
    this.datatypeId = this.route.snapshot.params["datatypeId"];
    this.route.data.map(data =>data.datatypeMetadata).subscribe(x=>{
      this.backup=x;
      this.datatypeMetadata=_.cloneDeep(this.backup);
    });
   this.namingIndicators=this.tocService.getNodeNames(Types.DATATYPEREGISTRY);
   console.log(this.namingIndicators);
  }

  reset(){
    this.datatypeMetadata=_.cloneDeep(this.backup);
    this.editForm.control.markAsPristine();
  }

  getCurrent(){

    return  this.datatypeMetadata;
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
          let node = treeModel.getNodeById(this.datatypeId);
          node.data.data.label= this.datatypeMetadata.name;
          node.data.data.ext= this.datatypeMetadata.ext;
          this.tocService.setTreeModelInDB(treeModel).then(x=>{
            this.datatypesService.saveDatatypeMetadata(this.datatypeId,this.datatypeMetadata).then( saved => {
                  this.backup = _.cloneDeep(this.datatypeMetadata);
                  this.editForm.control.markAsPristine();
                  resolve(true);
                }, error => {
                  console.log("Error Saving");
                  this.libErrorService.showError(error);
                }
            );
          }, tocError=>{
            console.log("TOC NOT SAVED")
            this.libErrorService.showError(tocError);
          })
        }
    )
  };

  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

  }
}
