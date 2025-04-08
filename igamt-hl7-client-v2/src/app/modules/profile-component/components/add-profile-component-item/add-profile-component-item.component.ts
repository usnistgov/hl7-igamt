import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IStructureTreeSelect } from 'src/app/modules/shared/components/structure-tree/structure-tree.component';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { AResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { IHL7v2TreeFilter, RestrictionCombinator, RestrictionType } from 'src/app/modules/shared/services/tree-filter.service';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-profile-component-item',
  templateUrl: './add-profile-component-item.component.html',
  styleUrls: ['./add-profile-component-item.component.css'],
})
export class AddProfileComponentItemComponent {

  structure: IHL7v2TreeNode[];
  repository: AResourceRepositoryService;
  filter: IHL7v2TreeFilter;
  transformer: (node: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]>;
  items: Record<string, IStructureTreeSelect> = {};

  constructor(
    public dialogRef: MatDialogRef<AddProfileComponentItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { structure, repository, selectedPaths, transformer }) {
    this.structure = data.structure;
    this.repository = data.repository;
    this.transformer = data.transformer;
    this.filter = {
      hide: false,
      restrictions: [
        {
          criterion: RestrictionType.PATH,
          allow: false,
          combine: RestrictionCombinator.ENFORCE,
          value: data.selectedPaths.map((path) => {
            return {
              path,
              excludeChildren: false,
            };
          }),
        },
        {
          criterion: RestrictionType.TYPE,
          allow: false,
          combine: RestrictionCombinator.ENFORCE,
          value: [Type.SEGMENT, Type.CONFORMANCEPROFILE, Type.DATATYPE],
        },
      ],
    };
  }

  select(event: IStructureTreeSelect) {
    this.items[event.node.data.pathId] = event;
  }

  unselect(event: IStructureTreeSelect) {
    delete this.items[event.node.data.pathId];
  }

  submit() {
    this.dialogRef.close(Object.keys(this.items).map((k) => this.items[k].node));
  }

  cancel() {
    this.dialogRef.close();
  }
}
