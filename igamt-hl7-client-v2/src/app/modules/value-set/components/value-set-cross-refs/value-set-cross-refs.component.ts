import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractEditorComponent} from "../../../core/components/abstract-editor-component/abstract-editor-component.component";
import {Observable} from "rxjs";
import {IUsages} from "../../../shared/models/cross-reference";
import {Actions} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {EditorID} from "../../../shared/models/editor.enum";
import {Type} from "../../../shared/constants/type.enum";
import {map, switchMap} from "rxjs/operators";
import {IDisplayElement} from "../../../shared/models/display-element.interface";
import * as fromIgEdit from "../../../../root-store/ig/ig-edit/ig-edit.index";
import {EditorSave} from "../../../../root-store/ig/ig-edit/ig-edit.index";

@Component({
  selector: 'app-value-set-cross-refs',
  templateUrl: './value-set-cross-refs.component.html',
  styleUrls: ['./value-set-cross-refs.component.css'],
})
export class ValueSetCrossRefsComponent extends AbstractEditorComponent implements OnInit, OnDestroy  {

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
}
