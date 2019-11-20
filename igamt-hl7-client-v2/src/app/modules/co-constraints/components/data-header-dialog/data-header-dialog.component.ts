import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { CoConstraintColumnType } from 'src/app/modules/shared/models/co-constraint.interface';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { IResource } from '../../../shared/models/resource.interface';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IHL7v2TreeFilter, RestrictionType, RestrictionCombinator } from '../../../shared/services/tree-filter.service';
import { CoConstraintEntityService } from '../../services/co-constraint-entity.service';

@Component({
  selector: 'app-data-header-dialog',
  templateUrl: './data-header-dialog.component.html',
  styleUrls: ['./data-header-dialog.component.scss'],
})
export class DataHeaderDialogComponent implements OnInit {

  structure: IHL7v2TreeNode[];
  excludePaths: string[];
  repository: AResourceRepositoryService;
  segment: IResource;
  selectedNode: IHL7v2TreeNode;
  selectedNodeName: string;
  type: CoConstraintColumnType;
  editMode: boolean;
  treeFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
      {
        criterion: RestrictionType.PRIMITIVE,
        allow: true,
        value: true,
      },
      {
        criterion: RestrictionType.DATATYPES,
        allow: true,
        value: ['CE', 'CWE', 'CNE', 'VARIES'],
      },
    ],
  };

  primitive = [
    { label: 'Constant Value', value: CoConstraintColumnType.VALUE },
  ];

  coded = [
    { label: 'Value Set', value: CoConstraintColumnType.VALUESET },
    { label: 'Code', value: CoConstraintColumnType.CODE },
  ];

  constraints = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ccEntityService: CoConstraintEntityService,
    private treeService: Hl7V2TreeService,
    public dialogRef: MatDialogRef<DataHeaderDialogComponent>) {
    this.structure = data.structure;
    this.excludePaths = data.excludePaths;
    this.repository = data.repository;
    this.segment = data.segment;
    if (data.excludePaths) {
      this.treeFilter.restrictions.push({
        criterion: RestrictionType.PATH,
        allow: false,
        combine: RestrictionCombinator.ENFORCE,
        value: data.excludePaths.map((path) => {
          return {
            path,
            excludeChildren: false,
          };
        }),
      });
    }
    this.editMode = true;
  }

  selectNode($event) {
    this.selectedNode = $event.node;
    this.selectedNodeName = this.treeService.getNodeName(this.selectedNode, true);
    this.editMode = false;
    if (this.selectedNode.leaf) {
      this.constraints = this.primitive;
      this.type = CoConstraintColumnType.VALUE;
    } else if (this.selectedNode.data.ref) {
      const ref = this.selectedNode.data.ref.getValue();
      const regex = new RegExp('^C.*E$');
      if (ref.type === Type.DATATYPE && regex.test(ref.name)) {
        this.constraints = this.coded;
      }
    }
  }

  editSelectedElement() {
    this.editMode = true;
  }

  done() {
    this.ccEntityService.createDataElementHeader(this.selectedNode, this.segment, this.treeService.getNodeName(this.selectedNode), this.repository, false, this.type).pipe(
      take(1),
      tap((x) => {
        this.dialogRef.close(x);
      }),
    ).subscribe();
  }

  ngOnInit() {
  }

}
