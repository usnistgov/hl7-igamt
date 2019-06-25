import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { interval } from 'rxjs';

@Component({
  selector: 'app-text-editor-dialog',
  templateUrl: './text-editor-dialog.component.html',
  styleUrls: ['./text-editor-dialog.component.scss'],
})
export class TextEditorDialogComponent implements OnInit {

  text;
  constructor(
    public dialogRef: MatDialogRef<TextEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITextEditorDialog,
  ) {
  }

  ngOnInit() {
  }

}

export interface ITextEditorDialog {
  title: string;
  content: string;
  plain?: boolean;
}
