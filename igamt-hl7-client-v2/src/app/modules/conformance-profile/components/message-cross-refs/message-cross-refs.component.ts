import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/data/dam.actions';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Type } from '../../../shared/constants/type.enum';
import { IUsages } from '../../../shared/models/cross-reference';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';

@Component({
  selector: 'app-message-cross-refs',
  templateUrl: './message-cross-refs.component.html',
  styleUrls: ['./message-cross-refs.component.scss'],
})
export class MessageCrossRefsComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  usages: Observable<IUsages[]>;

  constructor(
    actions$: Actions,
    store: Store<any>) {
    super({
      id: EditorID.CROSSREF,
      title: 'Cross reference',
      resourceType: Type.CONFORMANCEPROFILE,
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
      take(1),
      concatMap((id) => {
        return this.store.select(fromIgamtDisplaySelectors.selectMessagesById, { id });
      }),
    );
  }

  ngOnDestroy(): void {
  }

  onEditorSave(action: fromDamActions.EditorSave): Observable<Action> {
    return of();
  }

  ngOnInit(): void {
  }

  onDeactivate() {

  }

}
