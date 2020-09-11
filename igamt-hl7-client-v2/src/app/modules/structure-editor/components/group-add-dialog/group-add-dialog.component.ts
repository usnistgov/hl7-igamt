import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Type } from '../../../shared/constants/type.enum';
import { Usage } from '../../../shared/constants/usage.enum';
import { IGroup } from '../../../shared/models/conformance-profile.interface';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { StructCreateDialog } from '../../services/struct-create-dialog.abstract';

@Component({
  selector: 'app-group-add-dialog',
  templateUrl: './group-add-dialog.component.html',
  styleUrls: ['./group-add-dialog.component.scss'],
})
export class GroupAddDialogComponent extends StructCreateDialog<IGroup> implements OnInit {

  blueprint: IGroup = {
    id: null,
    name: '',
    position: 1,
    usage: Usage.O,
    oldUsage: Usage.O,
    type: Type.GROUP,
    custom: false,
    min: 0,
    max: '*',
    comments: [],
    children: [],
  };
  path: string;
  @ViewChild('form', { read: NgForm }) form: NgForm;

  constructor(
    repository: StoreResourceRepositoryService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(
      dialogRef,
      repository,
      data.parent,
      data.resources,
      data.usages,
      data.root,
      data.type,
      data.path,
      data.position,
      data.size,
    );
    this.blueprint.position = this.position;
    this.blueprint.id = this.getPathId(this.position);
  }

  isValid(): boolean {
    return this.form.valid;
  }

  usageChange(usage: Usage) {
    this.blueprint.oldUsage = usage;
    if (usage === Usage.O) {
      this.blueprint.min = 0;
    } else if (usage === Usage.R && this.blueprint.min < 1) {
      this.blueprint.min = 1;
    }
  }

  positionChange(event: number) {
    this.blueprint.id = this.getPathId(event);
  }

  done() {
    if (this.isValid()) {
      this.dialogRef.close(this.resolve());
    }
  }

  ngOnInit() {
  }

}
