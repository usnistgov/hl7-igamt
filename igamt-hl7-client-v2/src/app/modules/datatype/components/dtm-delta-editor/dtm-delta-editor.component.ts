import { Component, OnInit } from '@angular/core';
import {Actions} from '@ngrx/effects';
import {MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {TreeNode} from 'primeng/primeng';
import * as fromIgamtDisplaySelectors from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {EntityDeltaEditorComponent} from '../../../core/components/entity-delta-editor/entity-delta-editor.component';
import {HL7v2TreeColumnType} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {Type} from '../../../shared/constants/type.enum';
import {DeltaAction} from '../../../shared/models/delta';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';

@Component({
  selector: 'app-dtm-delta-editor',
  templateUrl: './dtm-delta-editor.component.html',
  styleUrls: ['./dtm-delta-editor.component.css'],
})
export class DtmDeltaEditorComponent extends EntityDeltaEditorComponent implements OnInit {

  styleClasses = {
    unchanged: 'delta-unchanged',
    added: 'delta-added',
    deleted: 'delta-deleted',
    updated: 'delta-updated',
  };
  constructor(
    protected actions$: Actions,
    protected store: Store<any>) {
    super(
      {
        id: EditorID.DATATYPE_DELTA,
        title: 'Delta',
        resourceType: Type.DATATYPE,
      },
      actions$,
      store,
      [
        HL7v2TreeColumnType.NAME,
        HL7v2TreeColumnType.Format,
        HL7v2TreeColumnType.USAGE,

      ],
    );
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectDatatypesById;
  }

  ngOnInit() {
  }

  prepare(tree: TreeNode[]) {
    return tree;
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
}
