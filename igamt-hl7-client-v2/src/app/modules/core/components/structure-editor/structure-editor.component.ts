import { OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take } from 'rxjs/operators';
import * as fromAuth from 'src/app/root-store/authentication/authentication.reducer';
import { EditorSave, EditorUpdate } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectAllDatatypes, selectAllSegments } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { IStructureChanges } from '../../../segment/components/segment-structure-editor/segment-structure-editor.component';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IEditorMetadata } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { IBindingContext } from '../../../shared/services/hl7-v2-tree.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { Message } from '../../models/message/message.class';
import { MessageService } from '../../services/message.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export type BindingLegend = Array<{
  label: string,
  context: IBindingContext,
}>;

export abstract class StructureEditorComponent<T> extends AbstractEditorComponent implements OnDestroy, OnInit {

  type = Type;
  resourceSubject: ReplaySubject<T>;
  datatypes: Observable<IDisplayElement[]>;
  segments: Observable<IDisplayElement[]>;
  changes: ReplaySubject<IStructureChanges>;
  username: Observable<string>;
  resource$: Observable<T>;
  workspace_s: Subscription;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    actions$: Actions,
    store: Store<any>,
    editorMetadata: IEditorMetadata,
    public legend: BindingLegend,
    public columns: HL7v2TreeColumnType[]) {
    super(editorMetadata, actions$, store);
    this.datatypes = this.store.select(selectAllDatatypes);
    this.segments = this.store.select(selectAllSegments);
    this.username = store.select(fromAuth.selectUsername);
    this.resourceSubject = new ReplaySubject<T>(1);
    this.changes = new ReplaySubject<IStructureChanges>(1);
    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next({ ...current.resource });
        this.changes.next({ ...current.changes });
      }),
    ).subscribe();
    this.resource$ = this.resourceSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.workspace_s.unsubscribe();
  }

  change(change: IChange) {
    combineLatest(this.changes.asObservable(), this.resource$).pipe(
      take(1),
      map(([changes, resource]) => {
        changes[change.location] = {
          ...changes[change.location],
          [change.propertyType]: change,
        };
        this.changes.next(changes);
        this.editorChange({ changes, resource }, true);
      }),
    ).subscribe();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.ig$.pipe(map((ig) => ig.id)), this.changes.asObservable()).pipe(
      take(1),
      concatMap(([id, igId, changes]) => {
        return this.saveChanges(id, igId, this.convert(changes)).pipe(
          mergeMap((message) => {
            return this.getById(id).pipe(
              flatMap((resource) => {
                return [this.messageService.messageToAction(message), new EditorUpdate({ value: { changes: {}, resource }, updateDate: false })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  abstract saveChanges(id: string, igId: string, changes: IChange[]): Observable<Message>;
  abstract getById(id: string): Observable<T>;

  convert(changes: IStructureChanges): IChange[] {
    let c = [];
    Object.keys(changes).forEach((id) => {
      c = c.concat(Object.keys(changes[id]).map((prop) => {
        return changes[id][prop];
      }));
    });
    return c;
  }

  abstract elementSelector(): MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>;

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id });
      }),
    );
  }

  ngOnInit() {
  }
}