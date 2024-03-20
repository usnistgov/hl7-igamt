import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-import-code-csv',
  templateUrl: './import-code-csv.component.html',
  styleUrls: ['./import-code-csv.component.css'],
})
export class ImportCodeCSVComponent {
  fileToUpload: File | null = null;
  uploadStep = true;
  reviewStep = false;
  errorStep = false;
  errorMessage = '';
  codes: any[] = [];
  selectedCodes: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ImportCodeCSVComponent>,
    private http: HttpClient,
  ) {}

  onDragOver(event: Event) {
    event.preventDefault();
  }

  onDragLeave(event: Event) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
    }
  }

  fileInputChange(files: FileList | null) {
    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
    }
  }

  removeFile() {
    this.fileToUpload = null;
  }

  uploadFile() {
    if (!this.fileToUpload) { return; }

    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);

    this.http.post('api/code-sets/importCSV', formData).subscribe({
      next: (data: any) => {
        this.codes = data;
        this.uploadStep = false;
        this.reviewStep = true;
        this.errorStep = false;
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error.message;
        this.uploadStep = false;
        this.reviewStep = false;
        this.errorStep = true;
      },
    });
  }

  submit() {
    this.dialogRef.close(this.selectedCodes);
  }
}
