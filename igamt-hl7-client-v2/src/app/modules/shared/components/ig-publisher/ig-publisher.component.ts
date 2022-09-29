import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ig-publisher',
  templateUrl: './ig-publisher.component.html',
  styleUrls: ['./ig-publisher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IgPublisherComponent  implements OnInit {
  customizeNarratives = false;
  publicationInfo: {draft: boolean, info: any}  = { draft: false, info: {}};

  constructor(  public dialogRef: MatDialogRef<IgPublisherComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {

  }

  submit() {
    console.log(this.publicationInfo);
    this.dialogRef.close(this.publicationInfo);
  }

  cancel() {
    this.dialogRef.close();
  }

}
