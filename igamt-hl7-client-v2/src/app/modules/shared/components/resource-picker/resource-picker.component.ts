import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IResourcePickerData} from '../../models/resource-picker-data.interface';
@Component({
  selector: 'app-resource-picker',
  templateUrl: './resource-picker.component.html',
  styleUrls: ['./resource-picker.component.css'],
})
export class ResourcePickerComponent implements OnInit {
  selectedData: any[];
  canSave = false;
  @ViewChild('child') child;

  constructor(public dialogRef: MatDialogRef<ResourcePickerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IResourcePickerData) {
  }
  ngOnInit() {
    console.log(this.data);
  }

  select($event: string) {
    this.data.versionChange($event);
  }

  selected($event: any[]) {
    this.selectedData = $event;
  }

  submit() {
    this.dialogRef.close(this.selectedData);
  }

  setValid($event: boolean) {
    this.canSave = $event;
  }

  cancel() {
    this.dialogRef.close();
  }

  isValid() {
    return this.child && this.child.isValid();
  }
}
