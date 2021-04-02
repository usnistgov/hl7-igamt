import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-excel-input',
  templateUrl: './file-excel-input.component.html',
  styleUrls: ['./file-excel-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileExcelInputComponent,
      multi: true,
    },
  ],
})
export class FileExcelInputComponent implements  OnInit {


  onChange: (files: File) => void;
  onTouched: () => void;
  @ViewChild('fileInput', { read: ElementRef })
  private fileInput: ElementRef;
  private file: File = null;
  private url: string;
  private preview: string | ArrayBuffer;
  @Input()
  viewOnly: boolean;
  @Output() resultFile = new EventEmitter<File>();

  constructor(private host: ElementRef<HTMLInputElement>) { }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    // this.onChange(file);
    this.file = file;
    this.resultFile.emit(file);
    console.log("emmited ");
    console.log("file name : " + file.name );
    const reader = new FileReader();

    reader.onloadend = (e) => {
      this.preview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  clear() {
    this.file = null;
    this.onChange(null);
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

}
