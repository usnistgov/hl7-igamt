import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SelectItem } from 'primeng/primeng';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DeltaChange, ICodeDelta, ICodeSetVersionContent, ICodeSetVersionInfo } from '../../models/code-set.models';
import { CodeSetServiceService } from '../../services/CodeSetService.service';
import { IVerificationEntryTable, VerificationService } from 'src/app/modules/shared/services/verification.service';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';

export enum CommitTab {
  CHANGES = "CHANGES",
  VERIFICATION = "VERIFICATION"
}

@Component({
  selector: 'app-commit-code-set-version-dialog',
  templateUrl: './commit-code-set-version-dialog.component.html',
  styleUrls: ['./commit-code-set-version-dialog.component.css'],
})
export class CommitCodeSetVersionDialogComponent implements OnInit {

  metaDataForm: FormGroup;
  title: string;
  resource$: Observable<ICodeSetVersionContent>;
  versions: SelectItem[];
  compareTarget: ICodeSetVersionInfo;
  loadingDelta = false;
  loadingVerification = false;
  delta: ICodeDelta[] = null;
  error = null;
  verificationError = null;
  codeSetId: string;
  versionId: string;
  activeTab = CommitTab.CHANGES;
  verificationResults: IVerificationEntryTable;
  resource: ICodeSetVersionContent;
  codeSetVersionInfo: ICodeSetVersionInfo;

  constructor(
    public dialogRef: MatDialogRef<CommitCodeSetVersionDialogComponent>,
    private codeSetService: CodeSetServiceService,
    private verificationService: VerificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.title = data.title || 'Code Set Version';
    this.codeSetId = data.codeSetId;
    this.versionId = data.versionId;
    this.metaDataForm = new FormGroup({
      version: new FormControl(data.version ? data.version || '' : '', [Validators.required, this.versionValidator()]),
      comments: new FormControl(data.comments ? data.comments || '' : '', []),
      latest: new FormControl(true),
    });
    this.versions = data.versions.filter((v) => v.dateCommitted && v.id !== this.versionId).map((v) => ({
      label: v.version,
      value: v,
    }));
    const found = this.versions.find((v) => (v.value as ICodeSetVersionInfo).latestStable);
    if (found) {
      this.compareTarget = found.value;
      this.codeSetVersionInfo = this.compareTarget;
      this.loadDelta(this.compareTarget.id);
      this.verify(this.codeSetId, this.versionId);
    }
  }

  verify(codeSet: string, codeSetVersionId: string) {
    this.loadingVerification = true;
    this.verificationError = null;
    this.codeSetService.verifyCodeSet(codeSet, codeSetVersionId).pipe(
      map((verification) => {
        this.verificationResults = this.verificationService.createCodeSetEntryTable(verification);
        this.loadingVerification = false;
      }),
      catchError((error) => {
        console.log(error);
        this.loadingVerification = false;
        if (error.error && error.error.text) {
          this.verificationError = error.error.text;
        } else {
          this.verificationError = "An unexpected error happened while trying to verify your code set, please try again later or contact admin"
        }
        this.verificationResults = null;
        return throwError(error);
      })
    ).subscribe();
  }

  loadDelta(id: string) {
    this.loadingDelta = true;
    this.error = null;
    this.codeSetService.getCodeSetDelta(this.codeSetId, this.versionId, id).pipe(
      map((delta) => {
        this.delta = delta.filter((row) => row.change !== DeltaChange.NONE);
        this.loadingDelta = false;
      }),
      catchError((error) => {
        this.loadingDelta = false;
        if (error.error && error.error.text) {
          this.error = error.error.text;
        } else {
          this.error = "An unexpected error happened while trying to compare versions, please try again later or contact admin"
        }
        this.delta = null;
        return throwError(error);
      }),
    ).subscribe();
  }

  onTargetChange($event) {
    this.loadDelta($event.id);
  }

  cancel() {
    this.dialogRef.close();
  }

  create() {
    this.dialogRef.close(this.metaDataForm.getRawValue());
  }

  selectTab(tab: CommitTab) {
    this.activeTab = tab;
  }

  ngOnInit() {
  }

  versionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = control.value ? !/^[a-zA-Z0-9-_.]+$/.test(control.value) : false;
      return forbidden ? { invalidVersion: { value: control.value } } : {};
    };
  }

}
