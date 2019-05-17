import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-select-input',
  templateUrl: './file-select-input.component.html',
  styleUrls: ['./file-select-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileSelectInputComponent,
      multi: true,
    },
  ],
})
export class FileSelectInputComponent implements ControlValueAccessor, OnInit {

  onChange: (files: File) => void;
  onTouched: () => void;
  @ViewChild('fileInput', { read: ElementRef })
  private fileInput: ElementRef;
  private file: File = null;
  private url: string;
  private preview: string | ArrayBuffer;
  @Input()
  viewOnly: boolean;

  constructor(private host: ElementRef<HTMLInputElement>) { }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
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
