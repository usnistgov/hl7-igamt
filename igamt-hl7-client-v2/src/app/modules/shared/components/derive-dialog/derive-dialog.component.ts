import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-derive-dialog',
  templateUrl: './derive-dialog.component.html',
  styleUrls: ['./derive-dialog.component.css'],
})
export class DeriveDialogComponent implements OnInit, AfterViewInit {
  inherit = true;
  selectedTemplate: IgTemplate;
  @ViewChild('tree') tree;

  constructor(public dialogRef: MatDialogRef<DeriveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDeriveDialogData) {

  }

  select($event: IgTemplate) {
    this.selectedTemplate = $event;
  }
  submit() {
    this.dialogRef.close({
      inherit: this.inherit, template: this.selectedTemplate,
    });
  }
  getPath(node) {
    if (this.isOrphan(node)) {
      return node.data.position;
    } else {
      return this.getPath(node.parent) + '.' + node.data.position;
    }
  }

  isOrphan(node: any) {
    return node && node.parent && !node.parent.parent;
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
}

export interface IDeriveDialogData {
  origin: string;
  templates: IgTemplate[];
}
export interface IgTemplate {
  id: string;
  name: string;
  domain: string;
  children: ISectionTemplate[];
}

export class ISectionTemplate {
  label: string;
  type: string;
  position: number;
  isExpanded = true;
  children: ISectionTemplate[];
}
