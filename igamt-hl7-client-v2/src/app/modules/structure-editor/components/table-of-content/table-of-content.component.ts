import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TreeComponent, TreeNode } from 'angular-tree-component';
import { map } from 'rxjs/operators';
import { Type } from '../../../shared/constants/type.enum';
import { NodeHelperService } from '../../../shared/services/node-helper.service';
import { ICreateMessageStructure, ICreateSegmentStructure } from '../../domain/structure-editor.model';
import { CreateMessageDialogComponent } from '../create-message-dialog/create-message-dialog.component';
import { CreateSegmentDialogComponent } from '../create-segment-dialog/create-segment-dialog.component';

@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.scss'],
})
export class TableOfContentComponent implements OnInit {

  @Input()
  nodes: TreeNode[];
  @Output()
  createMessageStructure: EventEmitter<ICreateMessageStructure>;
  @Output()
  createSegmentStructure: EventEmitter<ICreateSegmentStructure>;
  @Output()
  deleteMessage: EventEmitter<string>;
  @Output()
  deleteSegment: EventEmitter<string>;
  @Output()
  unlockSegment = new EventEmitter<string>();
  @Output()
  unlockMessage = new EventEmitter<string>();

  @Output()
  publish: EventEmitter<{
    id: string;
    type: Type;
  }>;
  @ViewChild('segLib') segLib: ElementRef;
  @ViewChild('msgLib') msgLib: ElementRef;
  @ViewChild(TreeComponent) private tree: TreeComponent;

  options;

  constructor(private dialog: MatDialog, private nodeHelperService: NodeHelperService) {
    this.createMessageStructure = new EventEmitter<ICreateMessageStructure>();
    this.createSegmentStructure = new EventEmitter<ICreateSegmentStructure>();
    this.deleteMessage = new EventEmitter<string>();
    this.deleteSegment = new EventEmitter<string>();
    this.publish = new EventEmitter<{
      id: string;
      type: Type;
    }>();

    this.options = {
      allowDrag: (node: TreeNode) => {
        return false;
      },
      actionMapping: {
        mouse: {
          click: () => { },
        },
      },
    };
  }

  createSegment() {
    this.dialog.open(CreateSegmentDialogComponent).afterClosed().pipe(
      map((value) => {
        if (value) {
          this.createSegmentStructure.emit(value);
        }
      }),
    ).subscribe();
  }

  createMessage() {
    this.dialog.open(CreateMessageDialogComponent).afterClosed().pipe(
      map((value) => {
        if (value) {
          this.createMessageStructure.emit(value);
        }
      }),
    ).subscribe();
  }

  publishStructure(id: string, type: Type) {
    this.publish.emit({
      id,
      type,
    });
  }

  deleteSegmentStructure(id: string) {
    this.deleteSegment.emit(id);
  }

  unlockSegmentStructure(id: string) {
    this.unlockSegment.emit(id);
  }

  unlockMessageStructure(id: string) {
    this.unlockMessage.emit(id);
  }

  deleteMessageStructure(id: string) {
    this.deleteMessage.emit(id);
  }

  getElementUrl(elm): string {
    const type = elm.type.toLowerCase();
    return './' + type + '/' + elm.id;
  }

  expandAll() {
    this.tree.treeModel.expandAll();
  }

  collapseAll() {
    this.tree.treeModel.collapseAll();
  }

  scroll(type: string) {
    if (type === 'messages') {
      this.msgLib.nativeElement.scrollIntoView();
    } else if (type === 'segments') {
      this.segLib.nativeElement.scrollIntoView();
    }
  }

  filter(value: string) {
    this.tree.treeModel.filterNodes((node) => {
      return this.nodeHelperService
        .getFilteringLabel(node.data.fixedName, node.data.variableName).toLowerCase()
        .startsWith(value.toLowerCase());
    });
  }

  ngOnInit() {
  }

  getLabel(fixedName, variableName) {
    if (fixedName && fixedName.length) {
      if (variableName && variableName.length) {
        return fixedName + '#' + variableName;
      } else {
        return fixedName;
      }
    } else {
      if (variableName) {
        return variableName;
      }
    }
  }

  print(nodes: TreeNode[]) {
    console.log(nodes);
  }


}
