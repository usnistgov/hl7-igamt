import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {IDisplayElement} from '../../../shared/models/display-element.interface';

@Component({
  selector: 'app-publish-library-dialog',
  templateUrl: './publish-library-dialog.component.html',
  styleUrls: ['./publish-library-dialog.component.css'],
})
export class PublishLibraryDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PublishLibraryDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: IPublicationSummary,
  ) { }

  ngOnInit() {
  }

  search($event, rowData) {
    rowData.availableExtensions = ['01', '02'];
  }
}
export interface IPublicationSummary {
  entries: IPublicationEntry[];
}

export interface IPublicationEntry {
  display: IDisplayElement;
  availableExtensions?: string[];
  suggested?: string;
}
