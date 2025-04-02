import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IAddingInfo, SourceType } from '../../models/adding-info';
import { IAddResourceData } from '../add-resource/add-resource.component';

@Component({
  selector: 'app-build-value-set',
  templateUrl: './build-value-set.component.html',
  styleUrls: ['./build-value-set.component.css'],
})
export class BuildValueSetComponent implements OnInit {

  model: IAddingInfo;
  @ViewChild(NgForm) child;
  redirect = true;
  notDefinedOption = { label: 'Not defined', value: 'Undefined' };

  stabilityOptionsOptions = [
    this.notDefinedOption, { label: 'Dynamic', value: 'Dynamic' }, { label: 'Static', value: 'Static' },
  ];
  extensibilityOptions = [
    this.notDefinedOption, { label: 'Open', value: 'Open' }, { label: 'Closed', value: 'Closed' },
  ];
  contentDefinitionOptions = [
    this.notDefinedOption, { label: 'Extensional', value: 'Extensional' }, { label: 'Intensional', value: 'Intensional' },
  ];

  constructor(public dialogRef: MatDialogRef<BuildValueSetComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IAddResourceData) {
    this.model = {
      originalId: null,
      id: null,
      sourceType: SourceType.INTERNAL,
      name: '',
      type: this.data.type,
      ext: '',
      flavor : true,
      url : ''};
  }

  ngOnInit() {
  }
  submit() {
    console.log(this.model);
    this.dialogRef.close(this.model);
  }

  cancel() {
    this.dialogRef.close();
  }

  isValid() {
    return this.child && this.child.isValid();
  }
}
