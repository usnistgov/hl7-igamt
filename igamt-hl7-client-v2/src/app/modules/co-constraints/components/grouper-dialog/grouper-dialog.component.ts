import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IHL7v2TreeNode } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { ElementNamingService } from 'src/app/modules/shared/services/element-naming.service';
import { AResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { IHL7v2TreeFilter, RestrictionCombinator, RestrictionType } from 'src/app/modules/shared/services/tree-filter.service';
import { DataHeaderDialogComponent } from '../data-header-dialog/data-header-dialog.component';

@Component({
  selector: 'app-grouper-dialog',
  templateUrl: './grouper-dialog.component.html',
  styleUrls: ['./grouper-dialog.component.scss'],
})
export class GrouperDialogComponent implements OnInit {

  structure: IHL7v2TreeNode[];
  excludePaths: string[];
  repository: AResourceRepositoryService;
  segment: IResource;
  selectedNode: IHL7v2TreeNode;
  selectedNodeName: string;
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
        value: ['OG'],
      },
    ],
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elementNamingService: ElementNamingService,
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
  }

  selectNode($event) {
    this.selectedNode = $event.node;
    this.selectedNodeName = this.elementNamingService.getTreeNodeName(this.selectedNode, true);
  }

  done() {
    this.dialogRef.close({
      pathId: this.selectedNode.data.pathId,
    });
  }

  ngOnInit() {
  }

}
