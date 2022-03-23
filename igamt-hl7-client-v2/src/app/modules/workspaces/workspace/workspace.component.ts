import { Component, forwardRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { DamWidgetComponent } from '../../dam-framework';
import { TreeModel, ITreeOptions, TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => WorkspaceComponent) },
  ],
})
export class WorkspaceComponent extends DamWidgetComponent implements OnInit {
  folders = [{
    id: 1,
    path: '1',
    header: 'California',
    igs: 0,
  }, {
    id: 2,
    path: '2',
    header: 'Michigan',
    igs: 10,
  }];
  constructor(store: Store<any>, dialog: MatDialog) {
    super('WORKSPACE_WIDGET', store, dialog);
    this.options = {
      allowDrag: true,
      actionMapping: {
        mouse: {
          drop: (tree: TreeModel, node: TreeNode, $event: any, { from, to }) => {

          },
          click: () => { },
        },
      },
    };
  }
  options: ITreeOptions;

  ngOnInit() {
  }

}
