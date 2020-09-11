import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import { LengthType } from '../../../shared/constants/length-type.enum';
import { Type } from '../../../shared/constants/type.enum';
import { Usage } from '../../../shared/constants/usage.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IField } from '../../../shared/models/segment.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { StructCreateDialog } from '../../services/struct-create-dialog.abstract';
import { ResourceSelectDialogComponent } from '../hl7-v2-tree-structure/dialogs/resource-select-dialog/resource-select-dialog.component';

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
    custom: false,
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
    private dialog: MatDialog,
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

  pickResource() {
    this.dialog.open(ResourceSelectDialogComponent, {
      data: {
        type: Type.DATATYPE,
      },
    }).afterClosed().pipe(
      tap((value: IDisplayElement) => {
        if (value) {
          this.datatypeChange(value);
        }
      }),
    ).subscribe();
  }

  usageChange(usage: Usage) {
    this.blueprint.oldUsage = usage;
    if (usage === Usage.O) {
      this.blueprint.min = 0;
    } else if (usage === Usage.R && this.blueprint.min < 1) {
      this.blueprint.min = 1;
    }
  }

  clearResource() {
    this.resource = undefined;
    this.blueprint.ref.id = undefined;
  }

  isValid(): boolean {
    return this.form.valid && !!this.blueprint.ref.id;
  }

  datatypeChange(event: IDisplayElement) {
    this.resource = event;
    this.blueprint.ref.id = event.id;
  }

  positionChange(event: number) {
    this.blueprint.id = this.getPathId(event);
  }

  ngOnInit() {
  }

}
