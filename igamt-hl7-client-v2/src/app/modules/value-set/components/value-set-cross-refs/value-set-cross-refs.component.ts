import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/dam.actions';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Type } from '../../../shared/constants/type.enum';
import { IUsages } from '../../../shared/models/cross-reference';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';

@Component({
  selector: 'app-value-set-cross-refs',
  templateUrl: './value-set-cross-refs.component.html',
  styleUrls: ['./value-set-cross-refs.component.css'],
})
export class ValueSetCrossRefsComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  usages: Observable<IUsages[]>;

  constructor(
    actions$: Actions,
    store: Store<any>) {
    super({
      id: EditorID.CROSSREF,
      title: 'Cross reference',
      resourceType: Type.VALUESET,
    }, actions$, store);
    this.usages = this.currentSynchronized$.pipe(
      map((value) => {
        const list = [];
        Object.keys(value).forEach((key) => list.push(value[key]));
        return list;
      }),
    );
  }
  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgamtDisplaySelectors.selectDatatypesById, { id: elementId });
      }),
    );
  }

  ngOnDestroy(): void {
  }

  onEditorSave(action: fromDamActions.EditorSave): Observable<Action> {
    return undefined;
  }

  ngOnInit(): void {
  }

  onDeactivate() {

  }
}
