import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreeNode } from 'angular-tree-component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';

@Component({
  selector: 'app-export-configuration-dialog',
  templateUrl: './export-configuration-dialog.component.html',
  styleUrls: ['./export-configuration-dialog.component.scss'],
})
export class ExportConfigurationDialogComponent implements OnInit {

  toc: TreeNode[];
  selected: IDisplayElement;
  type: Type;

  constructor(
    public dialogRef: MatDialogRef<ExportConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.toc = data.toc;
  }

  select(node) {
    this.selected = node;
    console.log(node);
    this.type = node.type;
  }

  ngOnInit() {
  }

}
