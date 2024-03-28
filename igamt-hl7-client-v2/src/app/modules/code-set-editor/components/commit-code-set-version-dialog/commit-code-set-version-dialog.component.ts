import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { ICodeSetVersionContent } from '../../models/code-set.models';

@Component({
  selector: 'app-commit-code-set-version-dialog',
  templateUrl: './commit-code-set-version-dialog.component.html',
  styleUrls: ['./commit-code-set-version-dialog.component.css'],
})
export class CommitCodeSetVersionDialogComponent implements OnInit {

  metaDataForm: FormGroup;
  title: string;
  resource$: Observable<ICodeSetVersionContent>;

  constructor(
    public dialogRef: MatDialogRef<CommitCodeSetVersionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.title = data.title || 'Code Set Version';
    this.metaDataForm = new FormGroup({
      version: new FormControl(data.version ? data.version || '' : '', [Validators.required, this.versionValidator()]),
      comments: new FormControl(data.comments ? data.comments || '' : '', []),
      latest: new FormControl(true),
    });
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
