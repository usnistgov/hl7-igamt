import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IDocumentConfig } from 'src/app/modules/document/models/document/IDocument.interface';

@Component({
  selector: 'app-document-config',
  templateUrl: './document-config.component.html',
  styleUrls: ['./document-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentConfigComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DocumentConfigComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any ) {

  }

  ngOnInit() {

  }
  submit(x: IDocumentConfig) {
    this.dialogRef.close(x);
  }
  close() {
    this.dialogRef.close();
  }

}
