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



@Component({
  templateUrl : './conformanceprofile-edit-metadata.component.html',
  styleUrls : ['./conformanceprofile-edit-metadata.component.css']
})
export class ConformanceprofileEditMetadataComponent implements WithSave {
    conformanceprofileId:any;
    conformanceprofileMetadata:any;
  backup:any;
  currentNode:any;

  @ViewChild('editForm')
  private editForm: NgForm;

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private conformanceProfilesService : ConformanceProfilesService,private tocService:TocService){
    this.tocService.getActiveNode().subscribe(x=>{
      console.log(x);
      this.currentNode=x;
    });
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
  save(): Promise<any>{
    this.tocService.getActiveNode().subscribe(x=>{
      let node= x;
      node.data.data.ext= _.cloneDeep(this.conformanceprofileMetadata.ext);
    });

    return this.conformanceProfilesService.saveConformanceProfileConformanceStatements(this.conformanceprofileId, this.conformanceprofileMetadata);
  }
}
