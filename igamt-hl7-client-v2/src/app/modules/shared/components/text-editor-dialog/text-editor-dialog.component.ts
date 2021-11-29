import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable} from 'rxjs';
import {FroalaService} from '../../services/froala.service';

@Component({
  selector: 'app-text-editor-dialog',
  templateUrl: './text-editor-dialog.component.html',
  styleUrls: ['./text-editor-dialog.component.scss'],
})
export class TextEditorDialogComponent implements OnInit {

  text;
  froalaConfig$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<TextEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITextEditorDialog, froalaService: FroalaService) {
    this.froalaConfig$ = froalaService.getConfig();
  }

  ngOnInit() {
  }

}

export interface ITextEditorDialog {
  title: string;
  content: string;
  plain?: boolean;
}
