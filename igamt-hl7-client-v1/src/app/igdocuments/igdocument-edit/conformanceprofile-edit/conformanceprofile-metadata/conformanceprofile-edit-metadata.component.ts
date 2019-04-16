/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd} from "@angular/router";

import * as _ from 'lodash';

import 'rxjs/add/operator/filter';
import {TocService} from "../../service/toc.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {IgErrorService} from "../../ig-error/ig-error.service";
import {HasFroala} from "../../../../configuration/has-froala";
import {ConformanceProfilesService} from "../conformance-profiles.service";


@Component({
    selector : 'conformanceprofile-edit',
    templateUrl : './conformanceprofile-edit-metadata.component.html',
    styleUrls : ['./conformanceprofile-edit-metadata.component.css']
})
export class ConformanceprofileEditMetadataComponent extends HasFroala implements WithSave {
    conformanceprofileId:any;
    conformanceprofileMetadata:any;
    backup:any;
    currentNode:any;
    changeItems: any[]=[];



  @ViewChild('editForm')
  private editForm: NgForm;

    constructor(private route: ActivatedRoute, private conformanceProfilesService : ConformanceProfilesService, private tocService:TocService, private igErrorService:IgErrorService ){
        super();
    }

    ngOnInit() {
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(data =>data.conformanceprofileMetadata).subscribe(x=>{
            this.backup=x;
            this.conformanceprofileMetadata=_.cloneDeep(this.backup);
        });
    }

    reset(){
        this.conformanceprofileMetadata=_.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();
    }

    getCurrent(){
        return  this.conformanceprofileMetadata;
    }
    getBackup(){
        return this.backup;
    }


  canSave(){
    if(this.conformanceprofileMetadata.readOnly){
      return false;
    }else{
      return  this.conformanceprofileMetadata.name!==null||this.conformanceprofileMetadata !=="";
    }

  }
    hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

    }

    save(): Promise<any>{
      this.createChanges(this.conformanceprofileMetadata,this.backup);
      return new Promise((resolve, reject)=>{
                let treeModel=this.tocService.getTreeModel();
                let node = treeModel.getNodeById(this.conformanceprofileId);
                node.data.data.label= this.conformanceprofileMetadata.name;
                node.data.data.ext= this.conformanceprofileMetadata.identifier;
                this.tocService.setTreeModelInDB(treeModel).then(x=>{
                    this.conformanceProfilesService.save(this.conformanceprofileId,this.changeItems).then(saved => {
                      this.conformanceprofileMetadata.label=this.conformanceprofileMetadata.name+"-"+this.conformanceprofileMetadata.identifier;
                            this.backup = _.cloneDeep(this.conformanceprofileMetadata);

                            this.editForm.control.markAsPristine();
                            resolve(true);
                        }, error => {
                            console.log("Error Saving");
                            this.igErrorService.showError(error);
                        }
                    );
                }, tocError=>{
                    console.log("TOC NOT SAVED")
                    this.igErrorService.showError(tocError);
                })
            }
        )
    };

  createChanges(elm, backup){
    this.changeItems=[];

    if(elm.identifier !== backup.identifier){

      let obj:any={};
      obj.location=this.conformanceprofileId;
      obj.propertyType="IDENTIFIER";
      obj.propertyValue=elm.identifier;
      obj.oldPropertyValue=backup.identifier;
      obj.position=-1;
      obj.changeType="UPDATE";
      this.changeItems.push(obj);
    }
    if(elm.usageNote!==backup.usageNote){

      let obj:any={};
      obj.location=this.conformanceprofileId;
      obj.propertyType="USAGENOTES";
      obj.propertyValue=elm.usageNote;
      obj.oldPropertyValue=backup.usageNote;
      obj.position=-1;
      obj.changeType="UPDATE";
      this.changeItems.push(obj);
    }

    if(elm.authorNote!==backup.authorNote){

      let obj:any={};
      obj.location=this.conformanceprofileId;
      obj.propertyType="AUTHORNOTES";
      obj.propertyValue=elm.authorNote;
      obj.oldPropertyValue=backup.authorNote;
      obj.position=-1;
      obj.changeType="UPDATE";
      this.changeItems.push(obj);
    }

  }
}
