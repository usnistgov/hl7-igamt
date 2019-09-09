import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { selectDatatypesById, selectMessagesById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { EntityDeltaEditorComponent } from '../../../core/components/entity-delta-editor/entity-delta-editor.component';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';

@Component({
  selector: 'app-delta-editor',
  templateUrl: '../../../core/components/entity-delta-editor/entity-delta-editor.component.html',
  styleUrls: ['../../../core/components/entity-delta-editor/entity-delta-editor.component.scss'],
})
export class DeltaEditorComponent extends EntityDeltaEditorComponent implements OnInit {

  constructor(
    protected actions$: Actions,
    protected store: Store<any>) {
    super(
      {
        id: EditorID.CONFP_DELTA,
        title: 'Delta',
        resourceType: Type.CONFORMANCEPROFILE,
      },
      actions$,
      store,
      [
        HL7v2TreeColumnType.NAME,
        HL7v2TreeColumnType.DATATYPE,
        HL7v2TreeColumnType.SEGMENT,
        HL7v2TreeColumnType.USAGE,
        HL7v2TreeColumnType.VALUESET,
        HL7v2TreeColumnType.CONSTANTVALUE,
        HL7v2TreeColumnType.CARDINALITY,
        HL7v2TreeColumnType.LENGTH,
        HL7v2TreeColumnType.CONFLENGTH,
        HL7v2TreeColumnType.TEXT,
      ],
    );
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectMessagesById;
  }

  ngOnInit() {
  }

}
