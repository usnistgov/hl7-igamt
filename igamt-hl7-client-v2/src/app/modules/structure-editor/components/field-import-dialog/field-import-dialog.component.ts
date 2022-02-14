import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { map, take, tap } from 'rxjs/operators';
import { LengthType } from 'src/app/modules/shared/constants/length-type.enum';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { Usage } from 'src/app/modules/shared/constants/usage.enum';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IField } from 'src/app/modules/shared/models/segment.interface';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { IHL7v2TreeFilter, RestrictionType } from '../../../shared/services/tree-filter.service';
import { StructCreateDialog } from '../../services/struct-create-dialog.abstract';
import { ResourceSelectDialogComponent } from '../hl7-v2-tree-structure/dialogs/resource-select-dialog/resource-select-dialog.component';

@Component({
  selector: 'app-field-import-dialog',
  templateUrl: './field-import-dialog.component.html',
  styleUrls: ['./field-import-dialog.component.scss'],
})
export class FieldImportDialogComponent extends StructCreateDialog<IField> implements OnInit {

  @ViewChild('form', { read: NgForm }) form: NgForm;
  segment: IDisplayElement;
  segStructure: IHL7v2TreeNode[];
  node: IHL7v2TreeNode;
  treeFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
      {
        criterion: RestrictionType.TYPE,
        allow: true,
        value: Type.FIELD,
      },
    ],
  };
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

  constructor(
    private dialog: MatDialog,
    repository: StoreResourceRepositoryService,
    public dialogRef: MatDialogRef<any>,
    public treeService: Hl7V2TreeService,
    public store: Store<any>,
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

  segmentChange(event: IDisplayElement) {
    this.segment = event;
    this.segStructure = [];
    this.repository.fetchResource(event.type, event.id, { display: true, forceLoad: true }).pipe(
      take(1),
      map((segment) => {
        this.treeService.getTree(segment, this.repository, true, false, (value) => {
          this.segStructure = [
            {
              data: {
                id: segment.id,
                pathId: segment.id,
                name: segment.name,
                type: segment.type,
                rootPath: { elementId: segment.id },
                position: 0,
              },
              expanded: true,
              children: [...value],
              parent: undefined,
            },
          ];
        });
      }),
    ).subscribe();
  }

  selectNode({ node }) {
    const ref = node.data.ref.getValue();
    this.repository.getResourceDisplay(ref.type, ref.id).pipe(
      take(1),
      map((resource) => {
        this.datatypeChange(resource);
        this.usageChange(node.data.usage.value as Usage);
        this.blueprint.name = node.data.name;
        this.blueprint.max = node.data.cardinality.max;
        this.blueprint.min = node.data.cardinality.min;
        this.node = node;
      }),
    ).subscribe();
  }

  clearResource() {
    this.segment = undefined;
    this.segStructure = undefined;
    this.node = undefined;
  }

  clearNode() {
    this.node = undefined;
  }

  usageChange(usage: Usage) {
    this.blueprint.oldUsage = usage;
    if (usage === Usage.O) {
      this.blueprint.min = 0;
    } else if (usage === Usage.R && this.blueprint.min < 1) {
      this.blueprint.min = 1;
    }
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
