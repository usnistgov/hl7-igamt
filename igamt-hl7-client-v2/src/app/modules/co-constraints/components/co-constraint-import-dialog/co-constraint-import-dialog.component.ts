import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { ConformanceProfileService } from 'src/app/modules/conformance-profile/services/conformance-profile.service';
import { IVerificationEnty } from 'src/app/modules/dam-framework';
import { Message, MessageType, UserMessage } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { AddMessage, EditorUpdate, SetValue } from 'src/app/modules/dam-framework/store';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { IVerificationEntryTable, VerificationService } from 'src/app/modules/shared/services/verification.service';

@Component({
  selector: 'app-co-constraint-import-dialog',
  templateUrl: './co-constraint-import-dialog.component.html',
  styleUrls: ['./co-constraint-import-dialog.component.css'],
})
export class CoConstraintImportDialogComponent implements OnInit {

  jsonFile: File = null;
  segmentPathId: string;
  contextPathId: string;
  conformanceProfileId: string;
  documentId: string;
  uploadResult: {
    userMessage: UserMessage;
    table: IVerificationEntryTable;
    success: boolean;
  };
  loading = false;
  format: string;
  files: string;
  importFile: (file: File, conformanceProfileId: string, contextPathId: string, segmentPathId: string) => Observable<Message<IVerificationEnty[]>>;

  constructor(
    public dialogRef: MatDialogRef<CoConstraintImportDialogComponent>,
    private messageService: MessageService,
    private verificationService: VerificationService,
    private repository: StoreResourceRepositoryService,
    private conformanceProfileService: ConformanceProfileService,
    private store: Store<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.segmentPathId = data.segmentPathId;
    this.conformanceProfileId = data.conformanceProfileId;
    this.contextPathId = data.contextPathId;
    this.documentId = data.documentId;
    this.format = data.format;
    this.files = data.files;
    this.importFile = data.importFile;
  }

  import() {
    if (this.jsonFile) {
      this.loading = true;
      this.importFile(this.jsonFile, this.conformanceProfileId, this.contextPathId, this.segmentPathId).pipe(
        flatMap((message) => {
          return this.verificationService.convertIssueListToVerificationEntryTable([], message.data, this.repository).pipe(
            tap((table) => {
              this.uploadResult = {
                userMessage: this.messageService.createUserMessage(message, message.status === MessageType.SUCCESS ? null : { closable: false }),
                table,
                success: message.status === MessageType.SUCCESS,
              };
              if (this.uploadResult.success) {
                this.close();
              } else {
                this.loading = false;
              }
            }),
          );
        }),
        catchError((e) => {
          this.uploadResult = {
            userMessage: this.messageService.fromError(e, {}, { closable: false }),
            table: null,
            success: false,
          };
          this.loading = false;
          return throwError(e);
        }),
      ).subscribe();
    }
  }

  back() {
    this.uploadResult = null;
    this.jsonFile = null;
  }

  close() {
    return this.conformanceProfileService.getById(this.conformanceProfileId).pipe(
      tap((resource) => {
        const updateActions = [
          new EditorUpdate({ value: { value: resource.coConstraintsBindings, resource }, updateDate: true }),
          new SetValue({ selected: resource }),
          new AddMessage(this.uploadResult.userMessage),
        ];
        updateActions.forEach((action) => this.store.dispatch(action));
        this.loading = false;
        this.dialogRef.close(true);
      }),
      catchError((e) => {
        this.loading = false;
        return throwError(e);
      }),
    ).subscribe();
  }

  cancel() {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
  }

}
