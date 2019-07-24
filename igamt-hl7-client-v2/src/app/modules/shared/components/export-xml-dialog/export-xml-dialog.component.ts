import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IDisplayElement} from '../../models/display-element.interface';
import {ISelectedIds} from '../select-resource-ids/select-resource-ids.component';

@Component({
  selector: 'app-export-xml-dialog',
  templateUrl: './export-xml-dialog.component.html',
  styleUrls: ['./export-xml-dialog.component.css'],
})
export class ExportXmlDialogComponent implements OnInit {
  ids: ISelectedIds = {conformanceProfilesId: [], compositeProfilesId: [],
  };
  constructor(public dialogRef: MatDialogRef<ExportXmlDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IExportXmlDialogData) {

  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.ids);
  }
  matchId($event: ISelectedIds) {
    this.ids = $event;
  }
  isSelected(): boolean {
    return (this.ids.conformanceProfilesId && this.ids.conformanceProfilesId.length > 0) || ( this.ids.compositeProfilesId && this.ids.compositeProfilesId.length > 0);
  }
}
export interface IExportXmlDialogData {
  conformanceProfiles?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
}
