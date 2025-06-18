import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { CoConstraintColumnType } from 'src/app/modules/shared/models/co-constraint.interface';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { IResource } from '../../../shared/models/resource.interface';
import { ElementNamingService } from '../../../shared/services/element-naming.service';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IHL7v2TreeFilter, RestrictionCombinator, RestrictionType } from '../../../shared/services/tree-filter.service';
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
  transformer?: (nodes: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]>;

  treeFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
      {
        criterion: RestrictionType.PRIMITIVE,
        allow: true,
        value: true,
      },
      {
        criterion: RestrictionType.VALUE_BINDING,
        allow: true,
        value: {
          allowValueSets: true,
          isCoded: true,
        },
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

  selector: boolean;
  constraints = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ccEntityService: CoConstraintEntityService,
    private elementNamingService: ElementNamingService,
    public dialogRef: MatDialogRef<DataHeaderDialogComponent>) {
    this.selector = data.selector;
    this.structure = data.structure;
    this.excludePaths = data.excludePaths;
    this.repository = data.repository;
    this.segment = data.segment;
    this.transformer = data.transformer;
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
    this.selectedNodeName = this.elementNamingService.getTreeNodeName(this.selectedNode, true);
    this.editMode = false;
    const bindingInfo = this.selectedNode.data.valueSetBindingsInfo.getValue();
    if (bindingInfo) {
      this.constraints = [
        ...(bindingInfo.coded ? [{ label: 'Code', value: CoConstraintColumnType.CODE }] : []),
        ...(bindingInfo.allowValueSets ? [{ label: 'Value Set', value: CoConstraintColumnType.VALUESET }] : []),
        ...(this.selectedNode.leaf ? [{ label: 'Constant Value', value: CoConstraintColumnType.VALUE }] : []),
      ];
      if (this.constraints.length > 1) {
        this.constraints.push({ label: 'Any', value: CoConstraintColumnType.ANY });
      }
    } else if (this.selectedNode.leaf) {
      this.constraints = this.primitive;
      this.type = CoConstraintColumnType.VALUE;
    } else {
      this.constraints = [];
      this.type = null;
    }
  }

  editSelectedElement() {
    this.editMode = true;
  }

  done() {
    this.ccEntityService.createDataElementHeader(this.selectedNode, this.elementNamingService.getTreeNodeName(this.selectedNode), this.type).pipe(
      take(1),
      tap((x) => {
        this.dialogRef.close(x);
      }),
    ).subscribe();
  }

  ngOnInit() {
  }

}
