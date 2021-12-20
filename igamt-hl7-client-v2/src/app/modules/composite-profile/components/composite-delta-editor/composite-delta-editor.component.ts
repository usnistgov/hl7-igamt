import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, map, pluck } from 'rxjs/operators';
import { selectCompositeProfileById } from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import * as fromDam from '../../../dam-framework/store';
import { Type } from '../../../shared/constants/type.enum';
import { IDelta } from '../../../shared/models/delta';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';

@Component({
  selector: 'app-composite-delta-editor',
  templateUrl: './composite-delta-editor.component.html',
  styleUrls: ['./composite-delta-editor.component.css'],
})
export class CompositeDeltaEditorComponent extends AbstractEditorComponent implements OnInit {

  delta$: Observable<IDelta<any>>;

  constructor(
    protected actions$: Actions,
    protected store: Store<any>) {
    super({
      id: EditorID.COMPOSITE_PROFILE_DELTA,
      resourceType: Type.COMPOSITEPROFILE,
      title: 'Delta',
    }, actions$, store);
    this.delta$ = this.currentSynchronized$.pipe(
      pluck('value'),
      map((delta: IDelta<any>) => {
        return delta;
      }),
    );
  }
  get type(): Type {
    return this.editor.resourceType;
  }

  url() {
    return this.type.toLowerCase();
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return of();
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectCompositeProfileById, { id });
      }),
    );
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
