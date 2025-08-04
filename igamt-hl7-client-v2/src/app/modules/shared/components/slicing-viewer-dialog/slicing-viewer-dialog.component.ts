import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { IDisplayElement } from '../../models/display-element.interface';
import { ISlicing } from '../../models/slicing';
import { IDisyplayMap } from '../slicing-editor/slicing-row.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-slicing-viewer-dialog',
  templateUrl: './slicing-viewer-dialog.component.html',
  styleUrls: ['./slicing-viewer-dialog.component.css'],
})
export class SlicingViewerDialogComponent implements OnInit {

  slicing: ISlicing;
  map: IDisyplayMap = {};
  elementName: string;
  defaultFlavorId: string;

  set options(values: IDisplayElement[]) {
    this.map = _.keyBy(values, (o) => o.id);
  }
  constructor(
    public dialogRef: MatDialogRef<SlicingViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.slicing = data.slicing;
    this.options = data.options;
    this.elementName = data.elementName;
    this.defaultFlavorId = data.defaultFlavorId;
  }

  ngOnInit() {
  }

}
