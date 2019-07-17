import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Actions} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';
import {EditorSave} from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import {selectSegmentsById} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {Type} from '../../../shared/constants/type.enum';
import {IUsages} from '../../../shared/models/cross-reference';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';

@Component({
  selector: 'app-cross-refs',
  templateUrl: './segment-cross-refs.component.html',
  styleUrls: ['./segment-cross-refs.component.css'],
})
export class SegmentCrossRefsComponent extends AbstractEditorComponent implements OnInit, OnDestroy  {

  usages: Observable<IUsages[]>;

  constructor(
    actions$: Actions,
    store: Store<any>) {
    super({
      id: EditorID.CROSSREF,
      title: 'Cross reference',
      resourceType: Type.SEGMENT,
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
      concatMap((id) => {
        return this.store.select(selectSegmentsById, { id });
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
