import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import * as fromIgEdit from '../../../../root-store/ig/ig-edit/ig-edit.index';
import { selectSegmentsById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Type } from '../../../shared/constants/type.enum';
import { IUsages } from '../../../shared/models/cross-reference';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';

@Component({
  selector: 'app-datatype-cross-refs',
  templateUrl: './datatype-cross-refs.component.html',
  styleUrls: ['./datatype-cross-refs.component.css'],
})
export class DatatypeCrossRefsComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  usages: Observable<IUsages[]>;

  constructor(
    actions$: Actions,
    store: Store<any>) {
    super({
      id: EditorID.CROSSREF,
      title: 'Cross reference',
      resourceType: Type.DATATYPE,
    }, actions$, store);
    this.usages = this.currentSynchronized$.pipe(
      map((value) => {
        console.log(value);
        const list = [];
        Object.keys(value).forEach((key) => list.push(value[key]));
        return list;
      }),
    );
  }
  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgEdit.selectDatatypesById, { id: elementId });
      }),
    );
  }

  ngOnDestroy(): void {
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return undefined;
  }

  ngOnInit(): void {
  }

  onDeactivate() {

  }
}
