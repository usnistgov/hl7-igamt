import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import { Type } from '../../../shared/constants/type.enum';
import { Usage } from '../../../shared/constants/usage.enum';
import { ISegmentRef } from '../../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { StructCreateDialog } from '../../services/struct-create-dialog.abstract';
import { ResourceSelectDialogComponent } from '../hl7-v2-tree-structure/dialogs/resource-select-dialog/resource-select-dialog.component';

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
    custom: false,
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

  pickResource() {
    this.dialog.open(ResourceSelectDialogComponent, {
      data: {
        type: Type.SEGMENT,
      },
    }).afterClosed().pipe(
      tap((value: IDisplayElement) => {
        if (value) {
          this.segmentChange(value);
        }
      }),
    ).subscribe();
  }

  clearResource() {
    this.resource = undefined;
    this.blueprint.ref.id = undefined;
    this.blueprint.name = '';
  }

  segmentChange(event: IDisplayElement) {
    this.resource = event;
    this.blueprint.ref.id = event.id;
    this.blueprint.name = event.fixedName;
  }

  positionChange(event: number) {
    this.blueprint.id = this.getPathId(event);
  }

  ngOnInit() {
  }

}
