import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Scope} from '../../../shared/constants/scope.enum';
import {Type} from '../../../shared/constants/type.enum';
import {IDisplayElement} from '../../../shared/models/display-element.interface';

@Component({
  selector: 'app-publish-library-dialog',
  templateUrl: './publish-library-dialog.component.html',
  styleUrls: ['./publish-library-dialog.component.css'],
})
export class PublishLibraryDialogComponent implements OnInit {
  duplicated: boolean;
  publicationResult: IPublicationResult = { version: '', elements: [], comments: ''  };
  constructor(
    public dialogRef: MatDialogRef<PublishLibraryDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: IPublicationSummary,
  ) { }

  ngOnInit() {
  }
  submit() {
    for (const entry of this.data.entries) {
      this.publicationResult.elements.push(
        {
          scope: Scope.SDTF,
          id: entry.display.id,
          ext: entry.suggested,
        },
      );
    }
    this.dialogRef.close(this.publicationResult);
  }
  print(form: any) {
    console.log(form);
  }

  isDuplicated(fixedName: any, suggested: any) {
    return this.data.entries.filter((entry) =>  entry.display.fixedName === fixedName && entry.suggested === suggested).length > 1 ;
  }
  disabled() {
    for (const entry of this.data.entries) {
      if (this.isDuplicated(entry.display.fixedName, entry.suggested)) {
        return true;
      }
    }
    return false;
  }
  close() {
    this.dialogRef.close();
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

export interface IPublishedEntry {
  scope?: Scope;
  id: string;
  type?: Type;
  ext: string;
}

export interface IPublicationResult {
  version?: string;
  comments?: string;
  elements: IPublishedEntry[];
}
