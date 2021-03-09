import { TemplateRef, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { IWorkspaceCurrent } from 'src/app/modules/dam-framework';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import {IProfileComponentContext} from '../../shared/models/segment.interface';
import { IEditorMetadata, IWorkspaceActive } from '../models/data/workspace';

export abstract class DamAbstractEditorComponent {

  saveSubscription: Subscription;
  titleSubsription: Subscription;
  protected changeTime: Date;
  readonly active$: Observable<IWorkspaceActive>;
  readonly elementId$: Observable<string>;
  readonly current$: Observable<IWorkspaceCurrent>;
  readonly currentSynchronized$: Observable<any>;
  readonly initial$: Observable<any>;
  readonly payload$: Observable<any>;

  @ViewChild('headerControls')
  readonly controls: TemplateRef<any>;
  @ViewChild('headerTitle')
  readonly header: TemplateRef<any>;

  constructor(
    readonly editor: IEditorMetadata,
    protected actions$: Actions,
    protected store: Store<any>) {
    this.changeTime = new Date();
    this.active$ = this.store.select(fromDAM.selectWorkspaceActive);
    this.initial$ = this.store.select(fromDAM.selectWorkspace).pipe(
      map((ws) => ws.initial),
    );
    this.elementId$ = this.active$.pipe(
      filter((active) => active.editor.id === editor.id),
      map((active) => {
        return active.display.id;
      }),
      distinctUntilChanged(),
    );
    this.current$ = this.store.select<IWorkspaceCurrent>(fromDam.selectWorkspaceCurrent);
    this.payload$ = this.store.select(fromDAM.selectPayloadData);
    this.currentSynchronized$ = this.current$.pipe(
      filter((current) => {
        return !current || !current.time || (current.time.getTime() !== this.changeTime.getTime());
      }),
      tap((current) => this.changeTime = current.time),
      map((current) => current.data),
    );
  }

  abstract onEditorSave(action: fromDam.EditorSave): Observable<Action>;
  abstract editorDisplayNode(): Observable<any>;
  abstract onDeactivate(): void;

  registerSaveListener() {
    this.saveSubscription = this.actions$.pipe(
      ofType(fromDam.DamActionTypes.EditorSave),
      withLatestFrom(this.store.select(fromDam.selectWorkspaceCurrentIsChanged)),
      tap(([action, changed]) => {
        if (changed) {
          this.onEditorSave(action).subscribe(
            (result) => this.store.dispatch(result),
            (result) => {
              this.store.dispatch(result);
              this.store.dispatch(new fromDam.EditorSaveFailure());
            },
            () => this.store.dispatch(new fromDam.EditorSaveSuccess()));
        }
      }),
    ).subscribe();
  }

  registerTitleListener() {
    this.titleSubsription = this.editorDisplayNode().subscribe(
      (title: any) => this.store.dispatch(new fromDam.UpdateActiveResource(title)),
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
    this.store.dispatch(new fromDam.EditorChange({
      data,
      valid,
      date: this.changeTime,
    }));
  }

}
