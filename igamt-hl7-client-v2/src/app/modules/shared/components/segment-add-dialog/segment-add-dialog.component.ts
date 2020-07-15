import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { Type } from '../../constants/type.enum';
import { Usage } from '../../constants/usage.enum';
import { ISegmentRef } from '../../models/conformance-profile.interface';
import { IDisplayElement } from '../../models/display-element.interface';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { StructCreateDialog } from '../../services/struct-create-dialog.abstract';

@Component({
  selector: 'app-segment-add-dialog',
  templateUrl: './segment-add-dialog.component.html',
  styleUrls: ['./segment-add-dialog.component.scss'],
})
export class SegmentAddDialogComponent extends StructCreateDialog<ISegmentRef> implements OnInit {

  blueprint: ISegmentRef = {
    id: null,
    name: '',
    position: 1,
    usage: Usage.O,
    oldUsage: Usage.O,
    type: Type.SEGMENTREF,
    custom: true,
    min: 0,
    max: '*',
    comments: [],
    ref: {
      id: undefined,
    },
  };
  path: string;
  @ViewChild('form', { read: NgForm }) form: NgForm;

  constructor(
    private treeService: Hl7V2TreeService,
    public dialogRef: MatDialogRef<SegmentAddDialogComponent>,
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
    this.blueprint.id = this.getPathId();
  }

  isValid(): boolean {
    return this.form.valid && !!this.blueprint.ref.id;
  }

  usageChange(usage: Usage) {
    this.blueprint.oldUsage = usage;
    if (usage === Usage.O) {
      this.blueprint.min = 0;
    } else if (usage === Usage.R && this.blueprint.min < 1) {
      this.blueprint.min = 1;
    }
  }

  segmentChange(event: IDisplayElement) {
    this.resource = event;
    this.blueprint.name = event.fixedName;
  }

  ngOnInit() {
  }

}
