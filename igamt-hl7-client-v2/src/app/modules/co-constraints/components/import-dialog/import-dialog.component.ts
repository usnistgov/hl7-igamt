import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { take } from 'rxjs/internal/operators/take';
import { map } from 'rxjs/operators';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css'],
})
export class ImportDialogComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.fileUploadService = data.fileUploadService;
    this.segmentRef = data.segmentRef;
    this.conformanceProfile = data.conformanceProfile;
    this.documentId = data.documentId;
    this.contextId = data.contextId;
  }
  file: File = null; // Variable to store file

  private fileUploadService: FileUploadService;

  segmentRef: string;
  conformanceProfile: Observable<IConformanceProfile>;
  documentId: any;
  contextId: any;

  uploadClicked = false;
  hasErrors = false;
  hasWarningOrInformational = false;
  isEmptyErrorList = true;
  detectionList = [];
  coConstraintTable = undefined;

  ngOnInit() {
  }

  // On file Select
  onChange(event) {
    this.file = event.target.files[0];
  }

  handleFile(file: File) {
    this.file = file;
  }

  onUpload() {
    this.hasErrors = false;
    this.detectionList = [];
    this.coConstraintTable = undefined;
    this.uploadClicked = true;

    this.conformanceProfile.pipe(
      take(1),
      mergeMap((cp) => {
        return this.fileUploadService.upload(this.file, this.segmentRef, cp.id, this.documentId, this.contextId).pipe(
          map((parseResult) => {
            if (parseResult.coConstraintTable) {
              this.coConstraintTable = parseResult.coConstraintTable;
            }

            if (parseResult.verificationResult) {
              this.hasErrors = parseResult.verificationResult.errors.filter((err) => err.severity === 'ERROR').length > 0;
              this.hasWarningOrInformational = (!this.hasErrors && parseResult.verificationResult.errors.filter((err) => err.severity === 'WARNING').length > 0) || (!this.hasErrors && parseResult.verificationResult.errors.filter((err) => err.severity === 'INFORMATIONAL').length > 0);
              this.isEmptyErrorList = parseResult.verificationResult.errors.length === 0;
              this.detectionList = parseResult.verificationResult.errors;
              if (this.isEmptyErrorList) {
                this.close();
              }
            } else {
              this.close();
            }
          }),
        );
      }),
    ).subscribe();

  }

  close() {
    this.dialogRef.close(this.coConstraintTable);

  }
  cancel() {
    this.dialogRef.close();
  }

}
