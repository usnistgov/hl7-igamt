import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-folder-add-dialog',
  templateUrl: './folder-add-dialog.component.html',
  styleUrls: ['./folder-add-dialog.component.scss'],
})
export class FolderAddDialogComponent implements OnInit {

  metaDataForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FolderAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.metaDataForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  create() {
    this.dialogRef.close(this.metaDataForm.getRawValue());
  }

  ngOnInit() {
  }

}
