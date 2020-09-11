import { ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IChangeReason } from '../../models/save-change';

export interface IDisplayNode {
  context: any;
  template?: TemplateRef<any>;
}
export interface IChangeReasonDialogDisplay {
  previous?: IDisplayNode;
  current?: IDisplayNode;
}

@Component({
  selector: 'app-change-reason-dialog',
  templateUrl: './change-reason-dialog.component.html',
  styleUrls: ['./change-reason-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeReasonDialogComponent<T> implements OnInit {

  previous: IDisplayNode;
  current: IDisplayNode;
  caption: string;
  text: string;
  existingChangeReason: IChangeReason;

  constructor(
    public dialogRef: MatDialogRef<ChangeReasonDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.current = data.display && data.display.current ? data.display.current : { context: data.current };
    this.previous = data.display && data.display.previous ? data.display.previous : { context: data.previous };
    this.existingChangeReason = data.changeReason;
    this.caption = data.caption;
  }

  keepReason() {
    this.dialogRef.close({
      reason: this.existingChangeReason.reason,
      date: new Date(),
    });
  }

  clearReason() {
    this.dialogRef.close();
  }

  logReason() {
    this.dialogRef.close({
      reason: this.text,
      date: new Date(),
    });
  }

  ngOnInit() {
  }

}
