import { TemplateRef, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { IgDocument } from 'src/app/modules/ig/models/ig/ig-document.class';
import {EditorSave, selectDelta} from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { EditorChange, EditorSaveFailure, EditorSaveSuccess, IgEditActionTypes, UpdateActiveResource } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { Scope } from '../../../shared/constants/scope.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IWorkspaceActive, IWorkspaceCurrent } from '../../../shared/models/editor.class';
import { IEditorMetadata } from '../../../shared/models/editor.enum';

export abstract class AbstractEditorComponent {

  saveSubscription: Subscription;
  titleSubsription: Subscription;
  protected changeTime: Date;
  readonly active$: Observable<IWorkspaceActive>;
  readonly elementId$: Observable<string>;
  readonly current$: Observable<IWorkspaceCurrent>;
  readonly currentSynchronized$: Observable<any>;
  readonly initial$: Observable<any>;
  readonly viewOnly$: Observable<boolean>;
  readonly ig$: Observable<IgDocument>;
  @ViewChild('headerControls')
  readonly controls: TemplateRef<any>;
  @ViewChild('headerTitle')
  readonly header: TemplateRef<any>;

  constructor(
    readonly editor: IEditorMetadata,
    protected actions$: Actions,
    protected store: Store<any>) {
    this.changeTime = new Date();
    this.active$ = this.store.select(fromIgEdit.selectWorkspaceActive);
    this.initial$ = this.store.select(fromIgEdit.selectWorkspace).pipe(
      map((ws) => ws.initial),
    );
    this.elementId$ = this.active$.pipe(
      filter((active) => active.editor.id === editor.id),
      map((active) => {
        return active.display.id;
      }),
      distinctUntilChanged(),
    );
    this.current$ = this.store.select<IWorkspaceCurrent>(fromIgEdit.selectWorkspaceCurrent);
    this.viewOnly$ = combineLatest(
      this.store.select(fromIgEdit.selectViewOnly),
      this.store.select(selectDelta),
      this.store.select(fromIgEdit.selectWorkspaceActive).pipe(
        map((active) => {
          return active.display.domainInfo && active.display.domainInfo.scope !== Scope.USER;
        }),
      )).pipe(
        map(([vOnly, delta, notUser]) => {
          return vOnly || notUser || delta;
        }),
      );
    this.ig$ = this.store.select(fromIgEdit.selectIgDocument);
    this.currentSynchronized$ = this.current$.pipe(
      filter((current) => {
        return !current || !current.time || (current.time.getTime() !== this.changeTime.getTime());
      }),
      tap((current) => this.changeTime = current.time),
      map((current) => current.data),
    );
  }

  abstract onEditorSave(action: EditorSave): Observable<Action>;
  abstract editorDisplayNode(): Observable<IDisplayElement>;
  abstract onDeactivate(): void;

  registerSaveListener() {
    this.saveSubscription = this.actions$.pipe(
      ofType(IgEditActionTypes.EditorSave),
      withLatestFrom(this.store.select(fromIgEdit.selectWorkspaceCurrentIsChanged)),
      tap(([action, changed]) => {
        if (changed) {
          this.onEditorSave(action).subscribe(
            (result) => this.store.dispatch(result),
            (result) => {
              this.store.dispatch(result);
              this.store.dispatch(new EditorSaveFailure());
            },
            () => this.store.dispatch(new EditorSaveSuccess()));
        }
      }),
    ).subscribe();
  }

  registerTitleListener() {
    this.titleSubsription = this.editorDisplayNode().subscribe(
      (title: IDisplayElement) => this.store.dispatch(new UpdateActiveResource(title)),
    );
  }

  unregisterSaveListener() {
    if (this.saveSubscription && !this.saveSubscription.closed) {
      this.saveSubscription.unsubscribe();
    }
  }

  unregisterTitleListener() {
    if (this.titleSubsription && !this.titleSubsription.closed) {
      this.titleSubsription.unsubscribe();
    }
  }

  editorChange(data: any, valid: boolean) {
    this.changeTime = new Date();
    this.store.dispatch(new EditorChange({
      data,
      valid,
      date: this.changeTime,
    }));
  }

}
