import { ExternalCodeSetService, ICodeSetQueryResult, IResponseError } from './../../services/external-codeset.service';
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


  useKey = false;
  error: IResponseError;
  loading = false;
  key: string;
  fetchDate: Date = null;
  fetchedCodeSets: ICodeSetQueryResult[];

  constructor(public dialogRef: MatDialogRef<ImportFromProviderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private externalCodeSetService: ExternalCodeSetService) {
    }

  ngOnInit() {
    this.fetch();
  }


  fetch() {
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
                this.loading = false;
                return of();
            }),
        ).subscribe();
    }, 500);
  }



}
