import { Component, Input, OnInit } from '@angular/core';
import { Type } from '../../constants/type.enum';
import { DeltaAction, IDelta, IDeltaNode, IDeltaReference } from '../../models/delta';
import { ColumnOptions, HL7v2TreeColumnType, IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';

@Component({
  selector: 'app-valueset-delta',
  templateUrl: './valueset-delta.component.html',
  styleUrls: ['./valueset-delta.component.scss'],
})
export class ValuesetDeltaComponent implements OnInit {

  columnTypes = HL7v2TreeColumnType;
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
  set columns(cols: any) {
    this.cols = cols;
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

  vsBindingClass(valueSetBinding): string {
    const removed = valueSetBinding.removed ? valueSetBinding.removed.length : 0;
    const added = valueSetBinding.added ? valueSetBinding.added.length : 0;
    const updated = valueSetBinding.updated ? valueSetBinding.updated.length : 0;
    const unchanged = valueSetBinding.unchanged ? valueSetBinding.unchanged.length : 0;

    if (removed > 0 && (updated + unchanged + added) === 0) {
      return this.styleClasses.deleted;
    } else if (added > 0 && (updated + unchanged + removed) === 0) {
      return this.styleClasses.added;
    } else if (updated > 0 && (added + unchanged + removed) === 0) {
      return this.styleClasses.updated;
    } else if (unchanged > 0 && (added + updated + removed) === 0) {
      return this.styleClasses.unchanged;
    } else if ((unchanged + added + updated + removed) === 0) {
      return this.styleClasses.unchanged;
    } else {
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

}
