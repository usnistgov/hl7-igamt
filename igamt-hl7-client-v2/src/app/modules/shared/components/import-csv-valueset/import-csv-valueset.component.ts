import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-import-csv-valueset',
  templateUrl: './import-csv-valueset.component.html',
  styleUrls: ['./import-csv-valueset.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImportCsvValuesetComponent,
      multi: true,
    },
  ],
})
export class ImportCsvValuesetComponent implements ControlValueAccessor, OnInit  {
  onChange: (files: File) => void;
  onTouched: () => void;
  @ViewChild('fileInput', { read: ElementRef })
  fileInput: ElementRef;
  file: File = null;
  url: string;
  preview: string | ArrayBuffer;
  viewOnly = false;

  constructor(public dialogRef: MatDialogRef<ImportCsvValuesetComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private host: ElementRef<HTMLInputElement>) {
  }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.file = file;
    const reader = new FileReader();

    reader.onloadend = (e) => {
      this.preview = reader.result;
    };

    reader.readAsText(file);
  }

  clear() {
    this.file = null;
    this.preview = null;
    this.fileInput.nativeElement.value = '';
  }

  writeValue(value: {
    url: string,
  }) {
    if (value.url && value.url !== '') {
      this.file = null;
      this.preview = null;
    }
    this.url = value.url;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(this.file);
  }
  cancel() {
    this.dialogRef.close();
  }

}
