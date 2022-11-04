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
  customMessage = false;
  defaultWarning = 'Warning: This is a DRAFT publication for trial use only. It will be updated and replaced. It is not advised to create permanent derived profiles form this DRAFT implementation Guide.';

  publicationInfo: {draft: boolean, info: any}  = { draft: false, info: { warning: this.defaultWarning }};

  constructor(public dialogRef: MatDialogRef<IgPublisherComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {

  }

  submit() {
    this.dialogRef.close(this.publicationInfo);
  }

  cancel() {
    this.dialogRef.close();
  }
  updateMessage($event) {
    if (!this.customMessage) {
      this.publicationInfo.info.warning = this.defaultWarning;
    }
  }

}
