import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {WithSave} from "../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';

import {TocService} from "../service/toc.service";
import {MessageService} from "primeng/components/common/messageservice";
import {HasFroala} from "../../../configuration/has-froala";
@Component({
  templateUrl: './igdocument-conformancestatement.component.html'
})

export class IgDocumentConformanceStatementComponent extends HasFroala implements OnInit ,WithSave{

  conformanceStatementData:any;
  backup:any;
  dtKeys : any[] = [];
  segKeys : any[] = [];
  msgKeys : any[] = [];
  cols:any;

  @ViewChild('editForm')
  private editForm: NgForm;

  copyDTDialog = false;

  selectedCS: any;
  selectedKey: any;
  toDT:any;


  constructor(private sp: ActivatedRoute, private  router : Router,private tocService:TocService, private messageService:MessageService) {
    super();
    this.cols = [
      { field: 'identifier', header: 'ID', colStyle: {width: '20em'}, sort:'identifier'},
      { field: 'description', header: 'Description' }
    ];
  }

  ngOnInit() {
    this.sp.data.map(data =>data.igcs).subscribe(x => {
      console.log(x);
      this.conformanceStatementData= x;
      this.backup=_.cloneDeep(this.conformanceStatementData);

      const dtMap = new Map(Object.entries(this.conformanceStatementData.associatedDTConformanceStatementMap));
      this.dtKeys = Array.from( dtMap.keys() );

      const segMap = new Map(Object.entries(this.conformanceStatementData.associatedSEGConformanceStatementMap));
      this.segKeys = Array.from( segMap.keys() );

      const msgMap = new Map(Object.entries(this.conformanceStatementData.associatedMSGConformanceStatementMap));
      this.msgKeys = Array.from( msgMap.keys() );
    });
  }


  save(): Promise<any>{
    return new Promise((resolve, reject)=>{



        // this.tocService.setMetaData(this.conformanceStatementData).then( x =>{
        //
        //   this.backup=_.cloneDeep(this.conformanceStatementData);
        //   this.editForm.control.markAsPristine();
        //
        //
        //   resolve(true);
        //
        // }, error=>{
        //   reject(error);
        // })

      }
    )

  };

  reset(){
    this.conformanceStatementData=_.cloneDeep(this.backup);
  }
  getCurrent(){
    return this.conformanceStatementData;
  }
  getBackup(){
    return this.backup;
  }
  canSave(){
    return true;
  }

  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;
  }

  deleteDTCS(cs, key){
    if(this.conformanceStatementData && this.conformanceStatementData.associatedDTConformanceStatementMap && this.conformanceStatementData.associatedDTConformanceStatementMap[key] && this.conformanceStatementData.associatedDTConformanceStatementMap[key].conformanceStatements){
      this.conformanceStatementData.associatedDTConformanceStatementMap[key].conformanceStatements = _.without(this.conformanceStatementData.associatedDTConformanceStatementMap[key].conformanceStatements, cs);

      if(key !== 'NotAssociated'){
        if(this.isNotUsed(key, cs)){
          if(this.conformanceStatementData.associatedDTConformanceStatementMap['NotAssociated']) {
            this.conformanceStatementData.associatedDTConformanceStatementMap['NotAssociated'].conformanceStatements.push(cs);
          }else {
            this.conformanceStatementData.associatedDTConformanceStatementMap['NotAssociated'] = {
              key: "NotAssociated",
              label: "Not Associated",
              sourceType: "DATATYPE",
              conformanceStatements: []
            };
            this.conformanceStatementData.associatedDTConformanceStatementMap['NotAssociated'].conformanceStatements.push(cs);

            const dtMap = new Map(Object.entries(this.conformanceStatementData.associatedDTConformanceStatementMap));
            this.dtKeys = Array.from( dtMap.keys() );
          }
        }
      }

    }
  }

  isNotUsed(key, cs){

    for(const k of this.dtKeys){
      if(k !== key && this.conformanceStatementData.associatedDTConformanceStatementMap[k].conformanceStatements){
        if(this.conformanceStatementData.associatedDTConformanceStatementMap[k].conformanceStatements.indexOf(cs) > -1) return false;
      }
    }
    return true;
  }

  openDialogForCopyDTCS(cs, key){
    this.selectedCS = cs;
    this.selectedKey = key;
    this.copyDTDialog = true;
  }

  copyCS(){
    if(this.selectedCS && this.selectedKey && this.toDT){
      this.conformanceStatementData.associatedDTConformanceStatementMap[this.toDT.label].conformanceStatements.push(this.selectedCS);
    }
    this.copyDTDialog = false;
  }

}
