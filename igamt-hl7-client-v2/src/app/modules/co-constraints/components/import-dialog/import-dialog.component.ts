import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from '../../services/file-upload.service';
import { take } from 'rxjs/internal/operators/take';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css']
})
export class ImportDialogComponent implements OnInit {


  ngOnInit() {
  }
  file: File = null; // Variable to store file 

  private fileUploadService: FileUploadService;
  
  flavorId: any;
  conformanceProfile: Observable<IConformanceProfile>;
  documentId : any;
  pathId: any;

  uploadClicked = false;
  hasErrors = false;
  hasWarningOrInformational= false;
  isEmptyErrorList = true;
  detectionList = [];
  coConstraintTable = undefined;
  

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.fileUploadService = data.fileUploadService;
    this.flavorId = data.flavorId;
    this.conformanceProfile = data.conformanceProfile;
    this.documentId = data.documentId;
    this.pathId = data.pathId;
  }




   // On file Select 
   onChange(event) { 
    this.file = event.target.files[0]; 
} 

handleFile(file: File) {
  this.file=file;
}

  onUpload() { 
    this.hasErrors = false;
    this.detectionList = [];
    this. coConstraintTable = undefined;
    this.uploadClicked = true;
    
    this.conformanceProfile.pipe(
      take(1),
      mergeMap((cp) => {
        return this.fileUploadService.upload(this.file, this.flavorId, cp.id,this.documentId, this.pathId).pipe(
          map((parseResult) => {
            console.log("ERRORS : ", parseResult );
            if(parseResult.coConstraintTable) {
              this.coConstraintTable = parseResult.coConstraintTable;
          }
          
          if(parseResult.verificationResult) {
              this.hasErrors = parseResult.verificationResult.errors.filter((err) => err.severity === 'ERROR').length > 0;
              this.hasWarningOrInformational = (!this.hasErrors && parseResult.verificationResult.errors.filter((err) => err.severity === 'WARNING').length > 0) || (!this.hasErrors && parseResult.verificationResult.errors.filter((err) => err.severity === 'INFORMATIONAL').length > 0);
              this.isEmptyErrorList = parseResult.verificationResult.errors.length == 0;
              this.detectionList = parseResult.verificationResult.errors
              if(this.isEmptyErrorList){
                this.close();
                            }
              console.log("second if for errors" );

          } else {
              this.close();
          }
          })
        );
      })
  ).subscribe();
    // this.loading = !this.loading; 
    
  //   console.log(this.file); 
  //   this.conformanceProfile.pipe(
  //     take(1),
  //     mergeMap((cp) => {
  //       return this.fileUploadService.upload(this.file, this.binding.flavorId, cp.id,this.documentRef.documentId, this.context.pathId).pipe(
  //         map((v) => {

  //         })
  //       );
  //     })
  // ).subscribe();

  // this.dialogRef.close(this.file);
}

close(){
  console.log("we closed dialog with table" ,  this.coConstraintTable);
  this.dialogRef.close(this.coConstraintTable);

}
cancel() {
  console.log("we closed dialog" );
  this.dialogRef.close();
  
}


// step = 0;
//   reports: any;
//   errorCounts: number[][];
//   ccVerificationResultTableForUser: any[] = [];
//    severities: any[];

  // constructor(private http: HttpClient, public dialogRef: MatDialogRef<ExportXmlDialogComponent>,
  //             @Inject(MAT_DIALOG_DATA) public data: IExportXmlDialogData) {

  // }

  // ngOnInit() {
  //   this.severities = [
  //     { label: 'All Severities', value: null },
  //     { label: 'FATAL', value: 'FATAL' },
  //     { label: 'ERROR', value: 'ERROR' },
  //     { label: 'WARNING', value: 'WARNING' },
  //     { label: 'INFO', value: 'INFO' },
  //   ];
  //   this.reports = null;
  //   this.errorCounts = null;
  //   this.step = 0;
  // }

  // cancel() {
  //   this.dialogRef.close();
  // }

  // onVerify() {
  //   // this.step = 1;
  //   this.http.post<any>('/api/igdocuments/' + this.data.igId + '/preverification', this.ids).pipe().subscribe(
  //       (x) => {
  //         this.reports = x;
  //         this.errorCounts = this.countErrors(this.reports);

  //         console.log(x);
  //       },
  //       (error) => {
  //       },
  //   );
  // }

  // addErrorNumbers(errorTable, errorTableForUser, numOfError, errors) {
  //   errors.forEach((e) => {
  //     if (e && e.targetMeta && e.targetMeta.domainInfo && e.targetMeta.domainInfo.scope === 'USER' && e.handleBy === 'User') {
  //       errorTableForUser.push(e);
  //     } else {
  //       errorTable.push(e);
  //     }

  //     if (e.severity === 'FATAL') {
  //       numOfError[0] = numOfError[0] + 1;
  //     } else if (e.severity === 'ERROR') {
  //       numOfError[1] = numOfError[1] + 1;
  //     } else if (e.severity === 'WARNING') {
  //       numOfError[2] = numOfError[2] + 1;
  //     } else if (e.severity === 'INFO') {
  //       numOfError[3] = numOfError[3] + 1;
  //     }
  //   });

  //   return numOfError;
  // }

  // countErrors(reports) {
  //   let numOfVSError = [0, 0, 0, 0];
  //   let numOfDTError = [0, 0, 0, 0];
  //   let numOfSEGError = [0, 0, 0, 0];
  //   let numOfCPError = [0, 0, 0, 0];
  //   let numOfIGError = [0, 0, 0, 0];

  //   this.igVerificationResultTable = [];
  //   this.cpVerificationResultTable = [];
  //   this.segVerificationResultTable = [];
  //   this.dtVerificationResultTable = [];
  //   this.vsVerificationResultTable = [];

  //   if (reports) {
  //     if (reports.valuesetVerificationResults) {
  //       reports.valuesetVerificationResults.forEach((item) => {
  //         numOfVSError = this.addErrorNumbers(this.vsVerificationResultTable, this.vsVerificationResultTableForUser, numOfVSError, item.errors);
  //       });
  //     }

  //     if (reports.datatypeVerificationResults) {
  //       reports.datatypeVerificationResults.forEach((item) => {
  //         numOfDTError = this.addErrorNumbers(this.dtVerificationResultTable, this.dtVerificationResultTableForUser, numOfDTError, item.errors);
  //       });
  //     }

  //     if (reports.segmentVerificationResults) {
  //       reports.segmentVerificationResults.forEach((item) => {
  //         numOfSEGError = this.addErrorNumbers(this.segVerificationResultTable, this.segVerificationResultTableForUser, numOfSEGError, item.errors);
  //       });
  //     }

  //     if (reports.conformanceProfileVerificationResults) {
  //       reports.conformanceProfileVerificationResults.forEach((item) => {
  //         numOfCPError = this.addErrorNumbers(this.cpVerificationResultTable, this.cpVerificationResultTableForUser, numOfCPError, item.errors);
  //       });
  //     }

  //     numOfIGError = this.addErrorNumbers(this.igVerificationResultTable, this.igVerificationResultTableForUser, numOfIGError, reports.igVerificationResult.errors);
  //   }

  //   return [numOfVSError, numOfDTError, numOfSEGError, numOfCPError, numOfIGError];

  // }

  // submit() {
  //   this.dialogRef.close(this.ids);
  // }
  // matchId($event: ISelectedIds) {
  //   this.ids = $event;
  // }
  // isSelected(): boolean {
  //   return (this.ids.conformanceProfilesId && this.ids.conformanceProfilesId.length > 0) || ( this.ids.compositeProfilesId && this.ids.compositeProfilesId.length > 0);
  // }

  // isProcessable(): boolean {
  //   if (this.errorCounts && this.errorCounts[0] && this.errorCounts[1] && this.errorCounts[2] && this.errorCounts[3] && this.errorCounts[4] &&
  //           this.errorCounts[0][0] + this.errorCounts[0][1]
  //         + this.errorCounts[1][1] + this.errorCounts[1][1]
  //         + this.errorCounts[2][1] + this.errorCounts[2][1]
  //         + this.errorCounts[3][1] + this.errorCounts[3][1]
  //         + this.errorCounts[4][1] + this.errorCounts[4][1] === 0) {
  //       return true;
  //   }
  //   return false;
  // }


}