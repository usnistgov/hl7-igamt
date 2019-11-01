import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs/operators';
import { CoConstraintColumnType } from 'src/app/modules/shared/models/co-constraint.interface';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { IResource } from '../../../shared/models/resource.interface';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
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
  type: CoConstraintColumnType;

  types = [
    { label: 'Constant Value', value: CoConstraintColumnType.VALUE },
    { label: 'Value Set', value: CoConstraintColumnType.VALUESET },
    { label: 'Code', value: CoConstraintColumnType.CODE },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ccEntityService: CoConstraintEntityService,
    private treeService: Hl7V2TreeService,
    public dialogRef: MatDialogRef<DataHeaderDialogComponent>) {
    this.structure = data.structure;
    this.excludePaths = data.excludePaths;
    this.repository = data.repository;
    this.segment = data.segment;
  }

  selectNode($event) {
    this.selectedNode = $event.node;
  }

  done() {
    this.ccEntityService.createDataElementHeader(this.selectedNode, this.segment, this.treeService.getNodeName(this.selectedNode), this.repository, this.type).pipe(
      take(1),
      tap((x) => {
        this.dialogRef.close(x);
      }),
    ).subscribe();
  }

  ngOnInit() {
  }

}
