import { Component, ElementRef, Inject, OnInit, ViewChild, ViewRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-workspace-dialog',
  templateUrl: './delete-workspace-dialog.component.html',
  styleUrls: ['./delete-workspace-dialog.component.scss'],
})
export class DeleteWorkspaceDialogComponent implements OnInit {

  name: string;
  confirmation: string;

  @ViewChild('confirm') input: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<DeleteWorkspaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.name = data.name;
  }

  cancel() {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.input.nativeElement.addEventListener('paste', (e) => e.preventDefault());
  }

  done() {
    this.dialogRef.close(true);
  }

  ngOnInit() {
  }

}
