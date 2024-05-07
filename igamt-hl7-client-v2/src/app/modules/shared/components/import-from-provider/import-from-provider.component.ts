import { Scope } from 'src/app/modules/shared/constants/scope.enum';
import { User } from './../../../dam-framework/models/authentication/user.class';
import { IAddingInfo, SourceType } from './../../models/adding-info';
import { ICodeSetInfoMetadata } from 'src/app/modules/code-set-editor/models/code-set.models';
import { ExternalCodeSetService, ICodeSetQueryMetaData, ICodeSetQueryResult, IResponseError, VersionInfo } from './../../services/external-codeset.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-import-from-provider',
  templateUrl: './import-from-provider.component.html',
  styleUrls: ['./import-from-provider.component.css']
})
export class ImportFromProviderComponent implements OnInit {

  redirect = true;
  limit = 500;
  step = 1;
  versionInfo: VersionInfo;
  notDefinedOption = { label: 'Not defined', value: 'Undefined' };

  stabilityOptionsOptions = [
    this.notDefinedOption, { label: 'Dynamic', value: 'Dynamic' }, { label: 'Static', value: 'Static' },
  ];
  extensibilityOptions = [
    this.notDefinedOption, { label: 'Open', value: 'Open' }, { label: 'Closed', value: 'Closed' },
  ];
  contentDefinitionOptions = [
    this.notDefinedOption, { label: 'Extensional', value: 'Extensional' }, { label: 'Intensional', value: 'Intensional' },
  ];
  useKey = false;
  error: IResponseError;
  loading = false;
  errorSelected: IResponseError;
  loadingSelected = false;
  key: string;
  fetchDate: Date = null;
  fetchedCodeSets: ICodeSetQueryResult[];
  selectedCodeSet: ICodeSetQueryMetaData;
  selectedCodeSetSourceType:SourceType = SourceType.EXTERNAL;

  versionMode: VersionMode = VersionMode.LATEST;

  model: IAddingInfo;

  selectedVersion: any;

  editName(codeSet: any) {
  }

  updateSourceOptions(versionType: string) {
    if( this.versionMode = VersionMode.LATEST) {
      this.selectedCodeSetSourceType = SourceType.EXTERNAL
    }
  }

  constructor(public dialogRef: MatDialogRef<ImportFromProviderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private externalCodeSetService: ExternalCodeSetService) {
      this.versionMode = VersionMode.LATEST;
      this.data.url= "http://hit-dev-admin.nist.gov:19070/api/v1/phinvads/codesets";
      this.model = {
        originalId: null,
        id: null,
        sourceType: SourceType.EXTERNAL_TRACKED,
        domainInfo: {scope: Scope.PHINVADS, version: "0"},
        name: '',
        type: this.data.type,
        ext: '',
        flavor : true,
        url : ''};
    }

  ngOnInit() {
    this.fetch();
  }


  fetch() {
    console.log("Fetching");
    this.loading = true;
    this.fetchDate = new Date();
    this.fetchedCodeSets = [];
    this.useKey = false;
    this.error = undefined;
    setTimeout(() => {
        this.externalCodeSetService.fetchAvailableCodeSets(this.data.url, this.key).pipe(
            tap((result) => {
                this.fetchedCodeSets = result;
                this.loading = false;

            }),
            catchError((error) => {
                if (error.statusCode === 403) {
                    this.useKey = true;
                }
                this.fetchedCodeSets = [];
                this.error = error;
                console.log(this.error);

                this.loading = false;
                return of();
            }),
        ).subscribe();
    }, 500);
  }

  fetchCodeSetMetadata(oid){
    this.loadingSelected = true;
    this.fetchDate = new Date();
    this.useKey = false;
    this.errorSelected = undefined;
    this.step = 2;
    setTimeout(() => {
        this.externalCodeSetService.fetchCodeSetMetadata(this.data.url, oid,  this.key).pipe(
            tap((result) => {
                this.selectedCodeSet = result;
                this.versionInfo = result.latestStableVersion;
                this.loadingSelected = false;
               // this.model.url = this.data.url+ "/" + oid;
                this.model.name = this.selectedCodeSet.name;
                this.model.fromProvider = true;
                this.model.oid = oid;

            }),
            catchError((error) => {
                if (error.statusCode === 403) {
                    this.useKey = true;
                }


                this.errorSelected = error;
                this.loadingSelected = false;
                return of();
            }),
        ).subscribe();
    }, 500);

  }

  cancel(){
    this.dialogRef.close();
  }

  addAsFlavor(codeSet: ICodeSetQueryMetaData){
    this.model.domainInfo = {scope: Scope.PHINVADS, version: codeSet.latestStableVersion.version};
    this.model.sourceType = SourceType.INTERNAL;
    this.model.flavor = true;
    this.fetchCodeSetMetadata(codeSet.id);
  }
  back(){
    this.step = 1;
    console.log(this.fetchedCodeSets);
  }
  submit(){

    this.model.trackLatest = this.versionMode === VersionMode.LATEST;
    this.model.domainInfo.version = this.versionInfo.version;
    if(!this.model.trackLatest){
      this.model.url = this.data.url +"/"+ this.model.oid + "?version="+ this.versionInfo.version;
    }else {
      this.model.url = this.data.url+ "/"+  this.model.oid;
    }
    this.dialogRef.close({selected: [this.model], redirect: this.redirect});
  }

  addAsIs(codeSet: ICodeSetQueryMetaData){

    this.model.sourceType = SourceType.EXTERNAL_TRACKED;
    this.model.domainInfo = {scope: Scope.PHINVADS, version: codeSet.latestStableVersion.version};
    this.model.flavor = false;
    this.fetchCodeSetMetadata(codeSet.id);

  }


}
export enum VersionMode {
  LATEST = 'LATEST',
  SPECIFIC = "SPECIFIC",
}
