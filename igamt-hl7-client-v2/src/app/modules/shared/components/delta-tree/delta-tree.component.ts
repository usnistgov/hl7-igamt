import { Component, Input, OnInit } from '@angular/core';
import {OverlayPanel} from 'primeng/overlaypanel';
import { Type } from '../../constants/type.enum';
import { DeltaAction, IDelta, IDeltaNode, IDeltaReference } from '../../models/delta';
import { ColumnOptions, HL7v2TreeColumnType, IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';

@Component({
  selector: 'app-delta-tree',
  templateUrl: './delta-tree.component.html',
  styleUrls: ['./delta-tree.component.scss'],
})
export class DeltaTreeComponent implements OnInit {

  columnTypes = HL7v2TreeColumnType;
  selectedPredicate: any;
  @Input()
  compare: IDelta;
  cols: ColumnOptions;
  selectedColumns: ColumnOptions;
  styleClasses = {
    unchanged: 'delta-unchanged',
    added: 'delta-added',
    deleted: 'delta-deleted',
    updated: 'delta-updated',
  };

  @Input()
  set columns(cols: HL7v2TreeColumnType[]) {
    this.cols = cols.map((col) => {
      return {
        field: col,
        header: col,
      };
    });
    this.selectedColumns = [...this.cols];
  }

  readonly trackBy = (index, item) => {
    return item.node.data.id;
  }

  constructor() { }

  isApplicable(node: IDeltaNode<string>): boolean {
    return node && (node.current !== node.previous || node.current !== 'NA');
  }

  cellClass(action: DeltaAction) {
    switch (action) {
      case DeltaAction.UNCHANGED:
        return this.styleClasses.unchanged;
      case DeltaAction.ADDED:
        return this.styleClasses.added;
      case DeltaAction.DELETED:
        return this.styleClasses.deleted;
      default:
        return this.styleClasses.updated;
    }
  }

  referenceAction(referenceDelta: IDeltaReference): DeltaAction {
    if (referenceDelta) {
      if (referenceDelta.label.action === referenceDelta.domainInfo.action) {
        return referenceDelta.label.action;
      } else {
        return DeltaAction.UPDATED;
      }
    }
    return DeltaAction.UNCHANGED;
  }

  minMaxClass(action1: DeltaAction, action2: DeltaAction): string {
    switch (action1) {
      case DeltaAction.UNCHANGED:
        if (action2 === DeltaAction.UNCHANGED) {
          return this.styleClasses.unchanged;
        } else {
          return this.styleClasses.updated;
        }
      case DeltaAction.ADDED:
        return this.styleClasses.added;
      case DeltaAction.DELETED:
        return this.styleClasses.deleted;
      default:
        return this.styleClasses.updated;
    }
  }

  nodeType(node: IHL7v2TreeNode): Type {
    return node ? (node.parent && node.parent.data.type === Type.COMPONENT) ? Type.SUBCOMPONENT : node.data.type : undefined;
  }

  ngOnInit() {
  }

  selectPredicate($event: MouseEvent, predicate, overlaypanel: OverlayPanel) {
    this.selectedPredicate = predicate;
    overlaypanel.toggle(event);

  }
}
