import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SelectItem } from 'primeng/primeng';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DeltaChange, ICodeDelta, ICodeSetVersionContent, ICodeSetVersionInfo } from '../../models/code-set.models';
import { CodeSetServiceService } from '../../services/CodeSetService.service';

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
  loading = false;
  delta: ICodeDelta[] = null;
  error = null;
  codeSetId: string;
  versionId: string;

  constructor(
    public dialogRef: MatDialogRef<CommitCodeSetVersionDialogComponent>,
    private codeSetService: CodeSetServiceService,
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
      this.loadDelta(this.compareTarget.id);
    }
  }

  loadDelta(id: string) {
    this.loading = true;
    this.error = null;
    this.codeSetService.getCodeSetDelta(this.codeSetId, this.versionId, id).pipe(
      map((delta) => {
        this.delta = delta.filter((row) => row.change !== DeltaChange.NONE);
        console.log(this.delta);
        this.loading = false;
      }),
      catchError((error) => {
        this.loading = false;
        this.error = error.message;
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

  ngOnInit() {
  }

  versionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = control.value ? !/^[a-zA-Z0-9-_.]+$/.test(control.value) : false;
      return forbidden ? { invalidVersion: { value: control.value } } : {};
    };
  }

}
