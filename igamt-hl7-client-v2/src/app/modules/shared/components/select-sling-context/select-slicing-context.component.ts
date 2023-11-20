import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IPath } from '../../models/cs.interface';
import { IResource } from '../../models/resource.interface';
import { ISlicingMethodType } from '../../models/slicing';
import { StoreResourceRepositoryService } from '../../services/resource-repository.service';
import { IHL7v2TreeFilter } from '../../services/tree-filter.service';
import { IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';
import { IStructureTreeSelect } from '../structure-tree/structure-tree.component';

@Component({
  selector: 'app-select-slicing-context',
  templateUrl: './select-slicing-context.component.html',
  styleUrls: ['./select-slicing-context.component.css'],
})
export class SelectSlicingContextComponent implements OnInit {

  selected: IStructureTreeSelect;
  selectType: ISlicingMethodType = ISlicingMethodType.ASSERTION;

  constructor(public dialogRef: MatDialogRef<SelectSlicingContextComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ISlicingDialogData, readonly repository: StoreResourceRepositoryService) {
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close({ path: this.selected.path, slicingType: this.selectType });
  }

  select($event: IStructureTreeSelect) {
    this.selected = $event;
  }
}
export interface ISlicingDialogData {
  nodes?: IHL7v2TreeNode[];
  treeFilter: IHL7v2TreeFilter;
  resource$: Observable<IResource>;
}
export interface ISlicingReturn {
  path: IPath;
  slicingType: ISlicingMethodType;
}
