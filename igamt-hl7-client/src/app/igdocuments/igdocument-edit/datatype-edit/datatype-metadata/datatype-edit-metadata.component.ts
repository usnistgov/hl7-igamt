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

  @ViewChild('editForm')
  private editForm: NgForm;

  constructor(private route: ActivatedRoute, private  router : Router, private datatypesService : DatatypesService,private tocService:TocService,private igErrorService:IgErrorService ){
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
                    reject(error);
                }
            );
          }, tocError=>{
            reject(tocError);
          })
        }
    )
  };
  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

  }
}
