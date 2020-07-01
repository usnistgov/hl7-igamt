import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { LengthType } from '../../constants/length-type.enum';
import { Type } from '../../constants/type.enum';
import { Usage } from '../../constants/usage.enum';
import { IDisplayElement } from '../../models/display-element.interface';
import { IField } from '../../models/segment.interface';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { StructCreateDialog } from '../../services/struct-create-dialog.abstract';
import { IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';

@Component({
  selector: 'app-field-add-dialog',
  templateUrl: './field-add-dialog.component.html',
  styleUrls: ['./field-add-dialog.component.scss'],
})
export class FieldAddDialogComponent extends StructCreateDialog<IField> implements OnInit {

  blueprint: IField = {
    id: null,
    name: '',
    position: 1,
    usage: Usage.O,
    oldUsage: Usage.O,
    type: Type.FIELD,
    custom: true,
    min: 0,
    max: '*',
    comments: [],
    constantValue: '',
    maxLength: 'NA',
    minLength: 'NA',
    confLength: 'NA',
    lengthType: LengthType.Length,
    ref: {
      id: undefined,
    },
  };
  @ViewChild('form', { read: NgForm }) form: NgForm;

  constructor(
    private treeService: Hl7V2TreeService,
    public dialogRef: MatDialogRef<FieldAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(
      dialogRef,
      data.parent,
      data.resources,
      data.usages,
      data.root,
      data.type,
      data.path,
      data.position,
    );
    this.blueprint.position = this.position;
    this.blueprint.id = this.position + '';
  }

  usageChange(usage: Usage) {
    this.blueprint.oldUsage = usage;
    if (usage === Usage.O) {
      this.blueprint.min = 0;
    } else if (usage === Usage.R && this.blueprint.min < 1) {
      this.blueprint.min = 1;
    }
  }

  makeNode(): IHL7v2TreeNode {
    return this.treeService.makeFieldElmNode(
      this.root,
      this.parent,
      this.blueprint,
      {
        changeable: true,
        viewOnly: false,
        leaf: this.resource.leaf,
      },
      !this.parent ? 0 : this.parent.data.level + 1,
      new BehaviorSubject({
        type: Type.DATATYPE,
        id: this.resource.id,
        version: this.resource.domainInfo.version,
        name: this.resource.fixedName,
      }),
      {
        children: {},
        values: {},
      },
      this.resource,
    );
  }

  isValid(): boolean {
    return this.form.valid && !!this.blueprint.ref.id;
  }

  datatypeChange(event: IDisplayElement) {
    this.resource = event;
  }

  ngOnInit() {
  }

}
