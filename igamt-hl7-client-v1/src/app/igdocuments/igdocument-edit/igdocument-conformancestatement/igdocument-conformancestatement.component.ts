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
  copySEGDialog = false;
  copyMSGDialog = false;

  listSiblingDTs: any[];
  listSiblingSEGs: any[];
  listSiblingMSGs: any[];

  toDT:any;
  toSEG:any;
  toMSG:any;

  selectedCS: any;
  selectedKey: string;

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
        if(this.isNotUsedForDT(key, cs)){
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

  deleteSEGCS(cs, key){
    if(this.conformanceStatementData && this.conformanceStatementData.associatedSEGConformanceStatementMap && this.conformanceStatementData.associatedSEGConformanceStatementMap[key] && this.conformanceStatementData.associatedSEGConformanceStatementMap[key].conformanceStatements){
      this.conformanceStatementData.associatedSEGConformanceStatementMap[key].conformanceStatements = _.without(this.conformanceStatementData.associatedSEGConformanceStatementMap[key].conformanceStatements, cs);

      if(key !== 'NotAssociated'){
        if(this.isNotUsedForSEG(key, cs)){
          if(this.conformanceStatementData.associatedSEGConformanceStatementMap['NotAssociated']) {
            this.conformanceStatementData.associatedSEGConformanceStatementMap['NotAssociated'].conformanceStatements.push(cs);
          }else {
            this.conformanceStatementData.associatedSEGConformanceStatementMap['NotAssociated'] = {
              key: "NotAssociated",
              label: "Not Associated",
              sourceType: "SEGMENT",
              conformanceStatements: []
            };
            this.conformanceStatementData.associatedSEGConformanceStatementMap['NotAssociated'].conformanceStatements.push(cs);

            const segMap = new Map(Object.entries(this.conformanceStatementData.associatedSEGConformanceStatementMap));
            this.segKeys = Array.from( segMap.keys() );
          }
        }
      }
    }
  }

  deleteMSGCS(cs, key){
    if(this.conformanceStatementData && this.conformanceStatementData.associatedMSGConformanceStatementMap && this.conformanceStatementData.associatedMSGConformanceStatementMap[key] && this.conformanceStatementData.associatedMSGConformanceStatementMap[key].conformanceStatements){
      this.conformanceStatementData.associatedMSGConformanceStatementMap[key].conformanceStatements = _.without(this.conformanceStatementData.associatedMSGConformanceStatementMap[key].conformanceStatements, cs);

      if(key !== 'NotAssociated'){
        if(this.isNotUsedForMSG(key, cs)){
          if(this.conformanceStatementData.associatedMSGConformanceStatementMap['NotAssociated']) {
            this.conformanceStatementData.associatedMSGConformanceStatementMap['NotAssociated'].conformanceStatements.push(cs);
          }else {
            this.conformanceStatementData.associatedMSGConformanceStatementMap['NotAssociated'] = {
              key: "NotAssociated",
              label: "Not Associated",
              sourceType: "CONFORMANCEPROFILE",
              conformanceStatements: []
            };
            this.conformanceStatementData.associatedMSGConformanceStatementMap['NotAssociated'].conformanceStatements.push(cs);

            const msgMap = new Map(Object.entries(this.conformanceStatementData.associatedMSGConformanceStatementMap));
            this.msgKeys = Array.from( msgMap.keys() );
          }
        }
      }
    }
  }

  isNotUsedForDT(key, cs){
    for(const k of this.dtKeys){
      if(k !== key && this.conformanceStatementData.associatedDTConformanceStatementMap[k].conformanceStatements){
        if(this.conformanceStatementData.associatedDTConformanceStatementMap[k].conformanceStatements.indexOf(cs) > -1) return false;
      }
    }
    return true;
  }

  isNotUsedForSEG(key, cs){
    for(const k of this.segKeys){
      if(k !== key && this.conformanceStatementData.associatedSEGConformanceStatementMap[k].conformanceStatements){
        if(this.conformanceStatementData.associatedSEGConformanceStatementMap[k].conformanceStatements.indexOf(cs) > -1) return false;
      }
    }
    return true;
  }

  isNotUsedForMSG(key, cs){
    for(const k of this.msgKeys){
      if(k !== key && this.conformanceStatementData.associatedMSGConformanceStatementMap[k].conformanceStatements){
        if(this.conformanceStatementData.associatedMSGConformanceStatementMap[k].conformanceStatements.indexOf(cs) > -1) return false;
      }
    }
    return true;
  }

  openDialogForCopyDTCS(cs, key){
    this.selectedCS = cs;
    this.selectedKey = key;
    this.copyDTDialog = true;
    this.listSiblingDTs = [{label: "Select DT", value: null}];
    let dtName = this.selectedCS.structureId;

    this.conformanceStatementData.usersDatatypesSelectItems.forEach(dtSelectedItem  => {
      if(dtName === dtSelectedItem.value.name && this.selectedKey !== dtSelectedItem.label) {
        if(!this.isContainCSForDT(this.selectedCS, dtSelectedItem.label)) this.listSiblingDTs.push(dtSelectedItem);
      }
    });
  }

  openDialogForCopySEGCS(cs, key){
    this.selectedCS = cs;
    this.selectedKey = key;
    this.copySEGDialog = true;
    this.listSiblingSEGs = [{label: "Select Segment", value: null}];
    let segName = this.selectedCS.structureId;
    this.conformanceStatementData.usersSegmentSelectItems.forEach(segSelectedItem  => {
      if(segName === segSelectedItem.value.name && this.selectedKey !== segSelectedItem.label) {
        if(!this.isContainCSForSEG(this.selectedCS, segSelectedItem.label)) this.listSiblingSEGs.push(segSelectedItem);
      }
    });
  }

  openDialogForCopyMSGCS(cs, key){
    this.selectedCS = cs;
    this.selectedKey = key;
    this.copyMSGDialog = true;
    this.listSiblingMSGs = [{label: "Select Conformance Profile", value: null}];
    let msgName = this.selectedCS.structureId;
    console.log(msgName);
    console.log(this.conformanceStatementData.usersConformanceProfileSelectItems);
    this.conformanceStatementData.usersConformanceProfileSelectItems.forEach(msgSelectedItem  => {
      if(msgName === msgSelectedItem.value.name && this.selectedKey !== msgSelectedItem.label) {
        if(!this.isContainCSForMSG(this.selectedCS, msgSelectedItem.label)) this.listSiblingMSGs.push(msgSelectedItem);
      }
    });
  }

  isContainCSForDT(cs, key){
    if(!this.conformanceStatementData.associatedDTConformanceStatementMap[key]) return false;
    return this.conformanceStatementData.associatedDTConformanceStatementMap[key].conformanceStatements.indexOf(cs) > -1;
  }

  isContainCSForSEG(cs, key){
    if(!this.conformanceStatementData.associatedSEGConformanceStatementMap[key]) return false;
    return this.conformanceStatementData.associatedSEGConformanceStatementMap[key].conformanceStatements.indexOf(cs) > -1;
  }

  isContainCSForMSG(cs, key){
    if(!this.conformanceStatementData.associatedMSGConformanceStatementMap[key]) return false;
    return this.conformanceStatementData.associatedMSGConformanceStatementMap[key].conformanceStatements.indexOf(cs) > -1;
  }

  copyCSForDT(){
    if(this.selectedCS && this.selectedKey && this.toDT){
      if(!this.conformanceStatementData.associatedDTConformanceStatementMap[this.toDT.label]) {
        this.conformanceStatementData.associatedDTConformanceStatementMap[this.toDT.label] = {
          key: this.toDT.label,
          label: this.toDT.label,
          sourceType: "DATATYPE",
          conformanceStatements: []
        };
      }

      this.conformanceStatementData.associatedDTConformanceStatementMap[this.toDT.label].conformanceStatements.push(this.selectedCS);
      if(this.selectedKey === 'NotAssociated'){
        this.conformanceStatementData.associatedDTConformanceStatementMap['NotAssociated'].conformanceStatements = _.without(this.conformanceStatementData.associatedDTConformanceStatementMap['NotAssociated'].conformanceStatements, this.selectedCS);
      }

      const dtMap = new Map(Object.entries(this.conformanceStatementData.associatedDTConformanceStatementMap));
      this.dtKeys = Array.from( dtMap.keys() );
    }
    this.toDT = null;
    this.selectedCS = null;
    this.selectedKey = null;
    this.copyDTDialog = false;
  }

  copyCSForSEG(){
    if(this.selectedCS && this.selectedKey && this.toSEG){
      if(!this.conformanceStatementData.associatedSEGConformanceStatementMap[this.toSEG.label]) {
        this.conformanceStatementData.associatedSEGConformanceStatementMap[this.toSEG.label] = {
          key: this.toSEG.label,
          label: this.toSEG.label,
          sourceType: "SEGMENT",
          conformanceStatements: []
        };
      }

      this.conformanceStatementData.associatedSEGConformanceStatementMap[this.toSEG.label].conformanceStatements.push(this.selectedCS);
      if(this.selectedKey === 'NotAssociated'){
        this.conformanceStatementData.associatedSEGConformanceStatementMap['NotAssociated'].conformanceStatements = _.without(this.conformanceStatementData.associatedSEGConformanceStatementMap['NotAssociated'].conformanceStatements, this.selectedCS);
      }

      const segMap = new Map(Object.entries(this.conformanceStatementData.associatedSEGConformanceStatementMap));
      this.segKeys = Array.from( segMap.keys() );
    }
    this.toSEG = null;
    this.selectedCS = null;
    this.selectedKey = null;
    this.copySEGDialog = false;
  }

  copyCSForMSG(){
    if(this.selectedCS && this.selectedKey && this.toMSG){
      if(!this.conformanceStatementData.associatedMSGConformanceStatementMap[this.toMSG.label]) {
        this.conformanceStatementData.associatedMSGConformanceStatementMap[this.toMSG.label] = {
          key: this.toMSG.label,
          label: this.toMSG.label,
          sourceType: "CONFORMANCEPROFILE",
          conformanceStatements: []
        };
      }

      this.conformanceStatementData.associatedMSGConformanceStatementMap[this.toMSG.label].conformanceStatements.push(this.selectedCS);
      if(this.selectedKey === 'NotAssociated'){
        this.conformanceStatementData.associatedMSGConformanceStatementMap['NotAssociated'].conformanceStatements = _.without(this.conformanceStatementData.associatedMSGConformanceStatementMap['NotAssociated'].conformanceStatements, this.selectedCS);
      }

      const msgMap = new Map(Object.entries(this.conformanceStatementData.associatedMSGConformanceStatementMap));
      this.msgKeys = Array.from( msgMap.keys() );
    }
    this.toMSG = null;
    this.selectedCS = null;
    this.selectedKey = null;
    this.copyMSGDialog = false;
  }

  discardCopyCSForDT(){
    this.toDT = null;
    this.selectedCS = null;
    this.selectedKey = null;
    this.copyDTDialog = false;
  }

  discardCopyCSForSEG(){
    this.toSEG = null;
    this.selectedCS = null;
    this.selectedKey = null;
    this.copySEGDialog = false;
  }

  discardCopyCSForMSG(){
    this.toMSG = null;
    this.selectedCS = null;
    this.selectedKey = null;
    this.copyMSGDialog = false;
  }
}
