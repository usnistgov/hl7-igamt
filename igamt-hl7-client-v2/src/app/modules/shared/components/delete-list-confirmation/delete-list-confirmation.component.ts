import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-list-confirmation',
  templateUrl: './delete-list-confirmation.component.html',
  styleUrls: ['./delete-list-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteListConfirmationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteListConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }
}
