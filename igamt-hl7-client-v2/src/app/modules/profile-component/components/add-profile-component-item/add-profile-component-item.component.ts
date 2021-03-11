import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TreeNode} from 'primeng/api';
import {IHL7v2TreeNode} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {Type} from '../../../shared/constants/type.enum';
import {IProfileComponentContext} from '../../../shared/models/profile.component';
import {ElementNamingService} from '../../../shared/services/element-naming.service';
import {PathService} from '../../../shared/services/path.service';
import {IHL7v2TreeFilter} from '../../../shared/services/tree-filter.service';

@Component({
  selector: 'app-add-profile-component-item',
  templateUrl: './add-profile-component-item.component.html',
  styleUrls: ['./add-profile-component-item.component.css'],
})
export class AddProfileComponentItemComponent implements OnInit {
  selectedContextNode: any;

  pathFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
    ],
  };
  selectedContextNodeName: string;
  selectedNodes: TreeNode[] = [];

  constructor(public dialogRef: MatDialogRef<AddProfileComponentItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {context: IProfileComponentContext, tree, repository},     private pathService: PathService,
              private elementNamingService: ElementNamingService) {
  }

  ngOnInit() {
  }
  selectContext($event) {
    this.selectedContextNode = {
      node: $event.node,
      path: $event.node.data.type === Type.CONFORMANCEPROFILE ? undefined : this.pathService.trimPathRoot($event.path),
    };

    this.selectedContextNodeName = this.elementNamingService.getTreeNodeName(this.selectedContextNode.node, true);
    console.log(this.selectedContextNode);
  }
  print(obj) {
    console.log(obj);
  }
  submit() {
    this.dialogRef.close(this.selectedNodes.map((x) => x.data.pathId));
  }
  cancel() {
    this.dialogRef.close();
  }
}
