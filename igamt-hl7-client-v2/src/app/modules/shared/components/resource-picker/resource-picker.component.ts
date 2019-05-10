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
  constructor( public dialogRef: MatDialogRef<ResourcePickerComponent>,
               @Inject(MAT_DIALOG_DATA) public data: IResourcePickerData) {
  }

  ngOnInit() {
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

  cancel() {
  }
}
