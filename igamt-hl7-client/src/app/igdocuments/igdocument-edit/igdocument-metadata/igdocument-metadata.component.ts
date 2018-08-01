import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {WithSave} from "../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';

import {TocService} from "../service/toc.service";
import {MessageService} from "primeng/components/common/messageservice";
import {HasFroala} from "../../../configuration/has-froala";
@Component({
  templateUrl: './igdocument-metadata.component.html'
})

export class IgDocumentMetadataComponent extends HasFroala implements OnInit ,WithSave{

  metaData:any;
  backup:any;
  uploadedFiles: any[] = [];


  @ViewChild('editForm')
  private editForm: NgForm;


  constructor(private sp: ActivatedRoute, private  router : Router,private tocService:TocService, private messageService:MessageService) {
    super();
  }

  ngOnInit() {
    this.sp.data.map(data =>data.metadata).subscribe(x=>{
      this.metaData= x;
      this.backup=_.cloneDeep(this.metaData);
    });
  }


  save(): Promise<any>{
    this.showError();
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
  showError() {
    this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
  }



}
