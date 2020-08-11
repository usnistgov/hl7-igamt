import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { EditorSave } from '../../../dam-framework/store/data/dam.actions';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';

@Component({
  selector: 'app-segment-structure-editor',
  templateUrl: './segment-structure-editor.component.html',
  styleUrls: ['./segment-structure-editor.component.scss'],
})
export class SegmentStructureEditorComponent extends AbstractEditorComponent implements OnInit {

  constructor(
    actions$: Actions,
    store: Store<any>,
  ) {
    super({
      id: EditorID.SEGMENT_CUSTOM_STRUCTURE,
      title: 'Structure',
      resourceType: Type.SEGMENT,
    }, actions$, store);
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return of();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
