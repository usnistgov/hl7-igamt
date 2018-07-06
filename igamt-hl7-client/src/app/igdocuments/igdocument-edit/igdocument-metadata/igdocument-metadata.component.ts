import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {WithSave} from "../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';

import {TocService} from "../service/toc.service";
@Component({
  templateUrl: './igdocument-metadata.component.html'
})

export class IgDocumentMetadataComponent implements OnInit ,WithSave{

  metaData:any;
  backup:any;
  uploadedFiles: any[] = [];


  @ViewChild('editForm')
  private editForm: NgForm;


  constructor(private sp: ActivatedRoute, private  router : Router,private tocService:TocService) { }

  ngOnInit() {
    this.sp.data.map(data =>data.metadata).subscribe(x=>{
      this.metaData= x;
      this.backup=_.cloneDeep(this.metaData);

      console.log(this.metaData);




    });
  }


  save(): Promise<any>{
    return new Promise((resolve, reject)=>{



        this.tocService.setMetaData(this.metaData).then( x =>{

          this.backup=_.cloneDeep(this.metaData);
          this.editForm.control.markAsPristine();


          resolve(true);

        })

      }
    )

  };

  reset(){
    this.metaData=_.cloneDeep(this.backup);
  }
  getCurrent(){
    return this.metaData;
  }
  getBackup(){
    return this.backup;
  }
  isValid(){
    return !this.editForm.invalid;
  }
  upload(event) {
    this.metaData.coverPicture =JSON.parse(event.xhr.response).link;
    for(let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
}
