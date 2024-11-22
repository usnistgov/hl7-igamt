import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { SelectItem } from 'primeng/primeng';
import { BehaviorSubject, combineLatest, Observable, of, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { IEditorMetadata } from 'src/app/modules/dam-framework';
import { DamAbstractEditorComponent } from 'src/app/modules/dam-framework/services/dam-editor.component';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { selectUsername } from 'src/app/modules/dam-framework/store/authentication';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IDocumentRef } from 'src/app/modules/shared/models/abstract-domain.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { selectCodeSetId, selectCodeSetVersionById } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.selectors';
import * as fromDam from '../../../dam-framework/store';
import { ICodeSetInfo, ICodeSetVersionContent } from '../../models/code-set.models';
import { CodeSetServiceService } from '../../services/CodeSetService.service';
import { EditorChange } from './../../../dam-framework/store/data/dam.actions';

@Component({
  selector: 'app-code-set-dash-board',
  templateUrl: './code-set-dash-board.component.html',
  styleUrls: ['./code-set-dash-board.component.css'],
})
export class CodeSetDashBoardComponent extends DamAbstractEditorComponent implements OnDestroy, OnInit {

  selectedColumns: any[] = [];
  cols: any[] = [];
  codeSystemOptions: any[] = [];
  hasOrigin$: Observable<boolean>;
  enforceChangeReason = true;
  type = Type;
  resourceSubject: ReplaySubject<ICodeSetInfo>;
  username: Observable<string>;
  resource$: Observable<ICodeSetInfo>;
  workspace_s: Subscription;
  resource_s: Subscription;
  codeSetId$: Observable<string>;
  constructor(
    actions$: Actions,
    store: Store<any>,
    private messageService: MessageService,
    private codeSetService: CodeSetServiceService,
  ) {
    super({
      id: EditorID.CODE_SET_DASHBOARD,
      title: 'Code Set Dashboard',
    },
      actions$,
      store,
    );
    this.username = this.store.select(selectUsername);
    this.resourceSubject = new ReplaySubject<ICodeSetInfo>(1);

    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next(_.cloneDeep(current));
      }),
    ).subscribe();
    this.resource$ = this.resourceSubject.asObservable();

    this.codeSetId$ = this.store.select(selectCodeSetId);
  }

  editorChange(data: any, valid: boolean) {
    this.changeTime = new Date();
    this.store.dispatch(new EditorChange({
      data,
      valid,
      date: this.changeTime,
    }));
  }

  ngOnDestroy(): void {
    if (this.workspace_s) {
      this.workspace_s.unsubscribe();
    }
    if (this.resource_s) {
      this.resource_s.unsubscribe();
    }
  }

  ngOnInit(): void {

  }

  onDeactivate(): void {
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return of(null);
  }

  applyChanges(event: any) {
    this.store.dispatch(new EditorChange({
      data: event.info,
      valid: event.valid,
      date: this.changeTime,
    }));

  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(
      this.current$,
      this.elementId$,
    ).pipe(
      take(1),
      flatMap(([current, id]) => {
        return this.codeSetService.saveDashBoard(current.data.id, current.data).pipe(
          flatMap((message) => {
            return this.codeSetService.getCodeSetInfo(current.data.id).pipe(
              flatMap((codeSetInfo) => {
                this.resourceSubject.next(_.cloneDeep(codeSetInfo));
                return [
                  ...this.codeSetService.getUpdateAction({ ...codeSetInfo }),
                  this.messageService.messageToAction(message),
                  new fromDam.EditorUpdate({ value: { ...codeSetInfo }, updateDate: false }),
                  new fromDam.LoadPayloadData({ ...codeSetInfo }),
                ];
              }),
            );
          }),
        );
      }),
    );
  }

  updateCodeSetState(id: string): Observable<Action[]> {
    return this.codeSetService.getCodeSetInfo(id).pipe(
      map((cs) => {
        return this.codeSetService.getUpdateAction(cs);
      }),
    );
  }

}
