import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IProfileComponentItemLocation } from 'src/app/modules/profile-component/services/profile-component.service';
import { IHL7v2TreeNode } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IItemProperty } from 'src/app/modules/shared/models/profile.component';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { Hl7V2TreeService } from 'src/app/modules/shared/services/hl7-v2-tree.service';
import { PPColumn } from '../pp-column.component';

@Component({
  selector: 'app-pp-name',
  templateUrl: './pp-name.component.html',
  styleUrls: ['./pp-name.component.scss'],
})
export class PpNameComponent extends PPColumn<IProfileComponentItemLocation> implements OnInit {

  @Input()
  node: IHL7v2TreeNode;

  @Input()
  nameType: 'PATH' | 'NAME';

  constructor(
    dialog: MatDialog,
    private treeService: Hl7V2TreeService,
  ) {
    super(
      [PropertyType.NAME],
      dialog,
    );
  }

  nodeType(node: IHL7v2TreeNode): Type {
    return this.treeService.nodeType(node);
  }

  apply(values: Record<PropertyType, IItemProperty>) {
  }

  ngOnInit() {
  }

}
