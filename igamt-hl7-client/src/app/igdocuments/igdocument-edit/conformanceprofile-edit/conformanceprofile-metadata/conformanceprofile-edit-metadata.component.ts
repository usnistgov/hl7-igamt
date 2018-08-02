/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import * as _ from 'lodash';

import 'rxjs/add/operator/filter';
import {TocService} from "../../service/toc.service";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {ConformanceProfilesService} from "../conformance-profiles.service";
import {HasFroala} from "../../../../configuration/has-froala";



@Component({
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

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private conformanceProfilesService : ConformanceProfilesService,private tocService:TocService){
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



  save(): Promise<any> {
    return new Promise((resolve, reject) => {

        let treeModel = this.tocService.getTreeModel();
        let node = treeModel.getNodeById(this.conformanceprofileId);

        console.log(node);

        node.data.data.label = this.conformanceprofileMetadata.name;
        node.data.data.ext = this.conformanceprofileMetadata.identifier;
        this.tocService.setTreeModel(treeModel).then(x => {


          this.conformanceProfilesService.saveConformanceProfileConformanceStatements(this.conformanceprofileId, this.conformanceprofileMetadata).then(saved => {


              this.backup = _.cloneDeep(this.conformanceprofileMetadata);

              this.editForm.control.markAsPristine();


              resolve(true);
            }, error => {
              console.log("Error Saving");

            }
          );

        })


      }
    )


  }






}
