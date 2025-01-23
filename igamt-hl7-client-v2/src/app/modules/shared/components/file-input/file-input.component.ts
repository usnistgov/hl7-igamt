import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileInputComponent,
      multi: true,
    },
  ],
})
export class FileInputComponent implements ControlValueAccessor, OnInit {

  onChange: (files: File) => void;
  onTouched: () => void;

  @ViewChild('fileInput', { read: ElementRef })
  private fileInput: ElementRef;
  @Input()
  viewOnly: boolean;
  @Input()
  accept = '';
  file: File;

  constructor(private host: ElementRef<HTMLInputElement>) { }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    this.file = event && event.item(0);
    this.onChange(this.file);
  }

  clear() {
    this.file = null;
    this.onChange(null);
    this.fileInput.nativeElement.value = '';
  }

  writeValue(file: File) {
    this.file = file;
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
