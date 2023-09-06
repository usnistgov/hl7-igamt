import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { CloneModeEnum } from './../../constants/clone-mode.enum';

@Component({
  selector: 'app-derive-dialog',
  templateUrl: './derive-dialog.component.html',
  styleUrls: ['./derive-dialog.component.css'],
})
export class DeriveDialogComponent implements OnInit, AfterViewInit {
  inherit = true;
  selectedTemplate: IgTemplate;
  @ViewChild('tree') tree;
  step = 1;
  toExculde = [];
  map: any = {};
  title = '';
  constructor(public dialogRef: MatDialogRef<DeriveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IDeriveDialogData) {
                if (data.mode === CloneModeEnum.DERIVE) {

                  this.title = 'Deriving from' + data.origin;

                } else {

                  this.title = 'Clone from ' + data.origin;
                }

                this.map[PropertyType.PREDEF] = true;
                this.map[PropertyType.POSTDEF] = true;
                this.map[PropertyType.AUTHORNOTES] = true;
                this.map[PropertyType.COMMENT] = true;
                this.map[PropertyType.DEFINITIONTEXT] = true;
  }

  select($event: IgTemplate) {
    this.selectedTemplate = $event;
  }
  submit() {
    this.dialogRef.close({
      inherit: this.inherit, template: this.selectedTemplate, exclude: this.mapToExculded(),
    });
  }

  mapToExculded(): PropertyType[] {
    console.log('this.map');

    console.log(this.map);
    const keysWithTrueValues: any[] = [];

    for (const key of Object.keys(this.map) ) {

      if (!this.map[key]) {
        keysWithTrueValues.push(key);
      }
    }

    console.log(keysWithTrueValues);
    return keysWithTrueValues;

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

  next() {
    this.toExculde = [PropertyType.PREDEF, PropertyType.POSTDEF, PropertyType.AUTHORNOTES, PropertyType.DEFINITIONTEXT, PropertyType.COMMENT, PropertyType.DEFINITIONTEXT];

    this.step = 2;
  }
  back() {
    this.step = 1;
  }

  ngAfterViewInit() {
  }
}

export interface IDeriveDialogData {
  origin: string;
  templates: IgTemplate[];
  mode: CloneModeEnum;
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
  content?: string;
  children: ISectionTemplate[];
}
