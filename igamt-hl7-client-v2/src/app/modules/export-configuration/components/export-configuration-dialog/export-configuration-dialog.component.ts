import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'angular-tree-component';
import {Type} from '../../../shared/constants/type.enum';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {ConfigurationTocComponent} from '../configuration-toc/configuration-toc.component';

@Component({
  selector: 'app-export-configuration-dialog',
  templateUrl: './export-configuration-dialog.component.html',
  styleUrls: ['./export-configuration-dialog.component.scss'],
})
export class ExportConfigurationDialogComponent implements OnInit {
  selected: IDisplayElement;
  type: Type;
  @ViewChild(ConfigurationTocComponent) toc;
  constructor(
    public dialogRef: MatDialogRef<ExportConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  select(node) {
    this.selected = node;
    this.type = node.type;
  }

  ngOnInit() {
  }
  submit() {
    this.dialogRef.close(this.data.decision);
  }
  cancel() {
    this.dialogRef.close();
  }
  filterFn(value: any) {
    this.toc.filter(value);
  }

  scrollTo(messages: string) {
    this.toc.scrollTo(messages);
  }
}
