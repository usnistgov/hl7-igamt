/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import {TocService} from "../../service/toc.service";
import {DatatypesService} from "../datatypes.service";
import {NgForm} from "@angular/forms";

import * as _ from 'lodash';


@Component({
  templateUrl : './datatype-edit-metadata.component.html',
  styleUrls : ['./datatype-edit-metadata.component.css']
})
export class DatatypeEditMetadataComponent {
  currentUrl:any;
  datatypeId:any;
  datatypeMetadata:any;
  existingNames:any;
  @ViewChild('editForm') editForm: NgForm;
  backup:any;


  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private datatypesService : DatatypesService,private tocService:TocService  ){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
    this.tocService.getDataypeNamesList().then( x=>{
      this.existingNames= x;
      console.log(this.existingNames);
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypeMetadata(this.datatypeId).then( metadata  => {
          this.datatypeMetadata = metadata;
          this.backup=_.cloneDeep(this.datatypeMetadata);
        });
    },
    error=>{
     console.log("Could not load existing names") ;
    })
  }

  print(obj){
    console.log(obj);

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

  isValid(){
    return !this.editForm.invalid;
  }



  save(): Promise<any> {
    return new Promise((resolve, reject) => {

        let treeModel = this.tocService.getTreeModel();
        let node = treeModel.getNodeById(this.datatypeId.id);

        console.log(node);

        node.data.data.label = this.datatypeMetadata.name;
        node.data.data.ext = this.datatypeMetadata.ext;
        this.tocService.setTreeModel(treeModel).then(x => {


          this.datatypesService.saveDatatypeMetadata(this.datatypeId, this.datatypeMetadata).then(saved => {


              this.backup = _.cloneDeep(this.datatypeMetadata);

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
