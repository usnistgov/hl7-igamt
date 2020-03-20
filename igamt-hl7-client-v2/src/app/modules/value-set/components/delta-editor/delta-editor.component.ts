import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { selectValueSetById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { ValuesetDeltaEditorComponent } from '../../../core/components/valueset-delta-editor/valueset-delta-editor.component';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';

@Component({
  selector: 'app-delta-editor',
  templateUrl: '../../../core/components/valueset-delta-editor/valueset-delta-editor.component.html',
  styleUrls: ['../../../core/components/valueset-delta-editor/valueset-delta-editor.component.scss'],
})
export class DeltaEditorComponent extends ValuesetDeltaEditorComponent implements OnInit {

  constructor(
    protected actions$: Actions,
    protected store: Store<any>) {
    super(
      {
        id: EditorID.VALUESET_DELTA,
        title: 'Delta',
        resourceType: Type.VALUESET,
      },
      actions$,
      store,

    );
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectValueSetById;
  }

  ngOnInit() {
  }

}
