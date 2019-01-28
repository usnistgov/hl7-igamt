/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {TocService} from "../../service/toc.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {ValuesetsService} from "../valuesets.service";
import {IgErrorService} from "../../ig-error/ig-error.service";
import * as _ from 'lodash';
import {HasFroala} from "../../../../configuration/has-froala";

@Component({
  templateUrl : './valueset-edit-metadata.component.html',
  styleUrls : ['./valueset-edit-metadata.component.css']
})

export class ValuesetEditMetadataComponent extends HasFroala implements WithSave  {
  valuesetId:any;
  valuesetMetadata:any;
  backup:any;
  currentNode:any;

  @ViewChild('editForm')
  private editForm: NgForm;

  constructor(private route: ActivatedRoute, private  router : Router, private valuesetsService : ValuesetsService,private tocService:TocService,private igErrorService:IgErrorService ){
    super();
  }

  ngOnInit() {
    this.valuesetId = this.route.snapshot.params["valuesetId"];
    this.route.data.map(data =>data.valuesetMetadata).subscribe(x=>{
      this.backup=x;
      this.valuesetMetadata=_.cloneDeep(this.backup);
    });
  }

  reset(){
    this.valuesetMetadata=_.cloneDeep(this.backup);
    this.editForm.control.markAsPristine();
  }

  getCurrent(){

    return  this.valuesetMetadata;
  }
  getBackup(){
    return this.backup;
  }

  canSave(){
    return !this.editForm.invalid;
  }

  save(): Promise<any>{
    return new Promise((resolve, reject)=>{
          let treeModel=this.tocService.getTreeModel();
          let node = treeModel.getNodeById(this.valuesetId);
          node.data.data.label= this.valuesetMetadata.bindingIdentifier;
          this.tocService.setTreeModelInDB(treeModel).then(x=>{
            this.valuesetsService.saveValuesetMetadata(this.valuesetId,this.valuesetMetadata).then( saved => {
                  this.backup = _.cloneDeep(this.valuesetMetadata);
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
