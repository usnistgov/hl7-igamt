import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-document-config',
  templateUrl: './document-config.component.html',
  styleUrls: ['./document-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentConfigComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DocumentConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {
      

  }

  ngOnInit() {

  }

}
