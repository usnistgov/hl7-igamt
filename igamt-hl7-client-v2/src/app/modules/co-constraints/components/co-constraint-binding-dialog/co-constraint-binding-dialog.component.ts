import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IPath } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ElementNamingService } from '../../../shared/services/element-naming.service';
import { PathService } from '../../../shared/services/path.service';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IHL7v2TreeFilter, RestrictionType } from '../../../shared/services/tree-filter.service';
import { DataHeaderDialogComponent } from '../data-header-dialog/data-header-dialog.component';

export interface IBindingDialogResult {
  context: {
    name: string;
    node: IHL7v2TreeNode;
    path: IPath;
  };
  segment: {
    name: string;
    flavorId: string;
    node: IHL7v2TreeNode;
    path: IPath;
  };
}

@Component({
  selector: 'app-co-constraint-binding-dialog',
  templateUrl: './co-constraint-binding-dialog.component.html',
  styleUrls: ['./co-constraint-binding-dialog.component.scss'],
})
export class CoConstraintBindingDialogComponent implements OnInit {

  structure: IHL7v2TreeNode[];
  excludePaths: string[];
  repository: AResourceRepositoryService;
  selectedContextNode: any;
  segmentTree: IHL7v2TreeNode[];
  selectedSegmentNode: any;
  selectedContextNodeName: string;
  selectedSegmentNodeName: string;
  selectedGroups: IDisplayElement[];
  contextFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
      {
        criterion: RestrictionType.TYPE,
        allow: true,
        value: [Type.GROUP, Type.CONFORMANCEPROFILE],
      },
    ],
  };
  segmentFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
      {
        criterion: RestrictionType.TYPE,
        allow: true,
        value: [Type.SEGMENTREF],
      },
    ],
  };

  compatibleGroups$: Observable<IDisplayElement[]>;
  transformer?: (nodes: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]>;
  referenceChangeMap: Record<string, string> = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pathService: PathService,
    private elementNamingService: ElementNamingService,
    public dialogRef: MatDialogRef<DataHeaderDialogComponent>) {
    this.structure = data.structure;
    this.excludePaths = data.excludePaths;
    this.repository = data.repository;
    this.transformer = data.transformer;
    this.referenceChangeMap = data.referenceChangeMap;
  }

  selectContext($event) {
    this.selectedContextNode = {
      node: $event.node,
      path: $event.node.data.type === Type.CONFORMANCEPROFILE ? undefined : this.pathService.trimPathRoot($event.path),
    };

    this.selectedContextNodeName = this.elementNamingService.getTreeNodeName(this.selectedContextNode.node, true);
    this.segmentTree = [
      {
        ...this.selectedContextNode.node,
        parent: null,
      },
    ];
  }

  selectSegment($event) {
    this.selectedSegmentNode = {
      node: $event.node,
      path: this.pathService.trimPathRoot($event.path),
    };
    this.popRoot(this.selectedSegmentNode.node);
    this.selectedSegmentNodeName = this.elementNamingService.getTreeNodeName(this.selectedSegmentNode.node, true);
  }

  popRoot(node: IHL7v2TreeNode): void {
    let top = false;
    let cursor = node;
    while (!top) {
      if (!cursor.parent.parent) {
        cursor.parent = null;
        top = true;
      } else {
        cursor = cursor.parent;
      }
    }
  }

  finish() {
    const value: IBindingDialogResult = {
      context: {
        ...this.selectedContextNode,
        name: this.selectedContextNodeName,
      },
      segment: {
        ...this.selectedSegmentNode,
        flavorId: (this.selectedSegmentNode.node as IHL7v2TreeNode).data.ref.getValue().id,
        name: this.selectedSegmentNodeName,
      },
    };

    this.dialogRef.close(value);
  }

  clearContextNode() {
    this.selectedContextNode = undefined;
    this.selectedSegmentNode = undefined;
  }

  clearSegmentNode() {
    this.selectedSegmentNode = undefined;
  }

  ngOnInit() {
  }

}
