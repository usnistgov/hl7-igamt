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

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=>{
                let treeModel=this.tocService.getTreeModel();
                let node = treeModel.getNodeById(this.conformanceprofileId);
                node.data.data.label= this.conformanceprofileMetadata.name;
                node.data.data.ext= this.conformanceprofileMetadata.identifier;
                this.tocService.setTreeModelInDB(treeModel).then(x=>{
                    this.conformanceProfilesService.saveConformanceProfileMetadata(this.conformanceprofileId,this.conformanceprofileMetadata).then(saved => {
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
}
