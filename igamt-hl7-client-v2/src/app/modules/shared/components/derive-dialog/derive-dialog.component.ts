import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Type} from '../../constants/type.enum';

@Component({
  selector: 'app-derive-dialog',
  templateUrl: './derive-dialog.component.html',
  styleUrls: ['./derive-dialog.component.css'],
})
export class DeriveDialogComponent implements OnInit {
  customizeNarratives = false;
  metaDataForm: FormGroup;

  constructor(  public dialogRef: MatDialogRef<DeriveDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {id: string, documentType: Type}) { }

  ngOnInit() {
    this.metaDataForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });
  }

  submit() {
  }

  cancel() {
  }

}
