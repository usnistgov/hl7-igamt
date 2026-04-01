import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConfirmDialogComponent, IConfirmDialogData } from '../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { Message, MessageType } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { TurnOffLoader, TurnOnLoader } from '../../../dam-framework/store/loader/loader.actions';
import { IMiniDumpOptions, MiniDumpService } from '../../services/mini-dump.service';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss'],
})
export class DataManagementComponent {
  readonly defaultArchiveBase = 'mini-dump';
  exportLoading = false;
  importLoading = false;
  exportForm: { format: 'JSON' | 'BSON'; archiveName: string } = {
    format: 'JSON',
    archiveName: '',
  };
  importOptions: IMiniDumpOptions = { mode: 'MERGE' };
  selectedFile: File | null = null;

  constructor(private miniDumpService: MiniDumpService, private store: Store<any>, private messageService: MessageService, private dialog: MatDialog) {
    this.resetExportForm();
  }

  openImportDialog(): void {
    if (!this.selectedFile) {
      this.toast(MessageType.FAILED, 'Select an archive before continuing');
      return;
    }
    const modeLabel = this.importOptions.mode === 'OVERRIDE'
      ? 'OVERRIDE – all matching documents will be deleted before import'
      : 'MERGE – only missing documents will be added';
    const data: IConfirmDialogData = {
      action: 'Import',
      question: `You are about to import "${this.selectedFile.name}" in ${modeLabel} mode. This operation may take a while. Do you want to continue?`,
    };
    this.dialog.open(ConfirmDialogComponent, { width: '480px', data }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.import();
      }
    });
  }

  get exportPreview(): string {
    const base = this.sanitizeName(this.exportForm.archiveName || `${this.defaultArchiveBase}-${this.currentDateStamp()}`);
    const suffix = this.exportForm.format === 'JSON' ? 'json' : 'bson';
    return `${base}-${suffix}.zip`;
  }

  get formatDescription(): string {
    return this.exportForm.format === 'JSON'
      ? 'Readable .json files grouped by resource type.'
      : 'Compact BSON dump ready for MongoDB restore.';
  }

  setExportFormat(format: 'JSON' | 'BSON'): void {
    this.exportForm.format = format;
  }

  confirmExport(): void {
    const archiveBase = this.sanitizeName(this.exportForm.archiveName);
    const payload: IMiniDumpOptions = {
      format: this.exportForm.format,
      archiveName: archiveBase,
    };
    this.exportLoading = true;
    this.store.dispatch(new TurnOnLoader({ blockUI: true }));
    this.miniDumpService.exportMiniDump(payload).subscribe(
      (blob) => {
        this.store.dispatch(new TurnOffLoader());
        this.downloadBlob(blob, this.exportPreview);
        this.toast(MessageType.SUCCESS, 'Export completed successfully');
        this.exportLoading = false;
        this.resetExportForm();
      },
      (err: HttpErrorResponse) => {
        this.store.dispatch(new TurnOffLoader());
        this.store.dispatch(this.messageService.actionFromError(err));
        this.exportLoading = false;
      },
    );
  }

  handleFileSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }


  import(): void {
    if (!this.selectedFile) {
      return;
    }
    this.importLoading = true;
    this.store.dispatch(new TurnOnLoader({ blockUI: true }));
    this.miniDumpService.importMiniDump(this.selectedFile, this.importOptions).subscribe(
      () => {
        this.store.dispatch(new TurnOffLoader());
        this.toast(MessageType.SUCCESS, 'Import completed successfully. All resources have been restored.');
        this.importLoading = false;
        this.selectedFile = null;
      },
      (err: HttpErrorResponse) => {
        this.store.dispatch(new TurnOffLoader());
        this.store.dispatch(this.messageService.actionFromError(err));
        this.importLoading = false;
      },
    );
  }

  clearImportFile(): void {
    this.selectedFile = null;
  }

  private resetExportForm(): void {
    this.exportForm = {
      format: 'JSON',
      archiveName: `${this.defaultArchiveBase}-${this.currentDateStamp()}`,
    };
  }

  private sanitizeName(raw: string): string {
    const base = (raw || `${this.defaultArchiveBase}-${this.currentDateStamp()}`).trim();
    const cleaned = base.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/-+/g, '-');
    return cleaned || this.defaultArchiveBase;
  }

  private currentDateStamp(): string {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${now.getFullYear()}${month}${day}`;
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  private toast(type: MessageType, text: string): void {
    this.store.dispatch(this.messageService.messageToAction(new Message(type, text, null)));
  }
}
