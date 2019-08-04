import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-export-configuration-dialog',
  templateUrl: './export-configuration-dialog.component.html',
  styleUrls: ['./export-configuration-dialog.component.scss'],
})
export class ExportConfigurationDialogComponent implements OnInit {

  toc: TreeNode[];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ExportConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.toc = data.toc;
  }

  ngOnInit() {
  }

}
