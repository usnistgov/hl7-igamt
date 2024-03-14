import { GlobalSave } from './../../../modules/dam-framework/store/data/dam.actions';
import { CodeSetServiceService } from './../../../modules/code-set-editor/services/CodeSetService.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CodeSetEditActionTypes, CodeSetEditActions, CodeSetEditResolverLoad, CodeSetEditResolverLoadFailure, CodeSetEditResolverLoadSuccess, OpenCodeSetVersionEditor } from './code-set-edit.actions';


import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, concatMap, flatMap, map, switchMap, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { EditorSave } from '../../../modules/dam-framework/store/data/dam.actions';
import { DamWidgetEffect } from './../../../modules/dam-framework/store/dam-widget-effect.class';
import { CODE_SET_EDIT_WIDGET_ID } from 'src/app/modules/code-set-editor/components/code-set-editor/code-set-editor.component';
import { ICodeSetInfo } from 'src/app/modules/code-set-editor/models/code-set.models';
import { selectCodeSetId } from './code-set-edit.selectors';
// import { selectWorkspaceId } from './workspace-edit.selectors';


@Injectable()
export class CodeSetEditEffects  extends DamWidgetEffect  {

  @Effect()
  loadCodeSetEdits$ = this.actions$.pipe(
    ofType(CodeSetEditActionTypes.CodeSetEditResolverLoad),
    switchMap((action: CodeSetEditResolverLoad) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));

      return this.codeSetService.getCodeSetInfo(action.id).pipe(
        take(1),
        flatMap((codeSetInfo: ICodeSetInfo) => {
          return [
            new fromDAM.TurnOffLoader(),
            ... this.codeSetService.getUpdateAction(codeSetInfo),
            new CodeSetEditResolverLoadSuccess(codeSetInfo),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new CodeSetEditResolverLoadFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  OpenCodeVersionEditor$ = this.actions$.pipe(
    ofType(CodeSetEditActionTypes.OpenCodeSetVersionEditor),
    switchMap((action: OpenCodeSetVersionEditor) => {
      return this.store.select(selectCodeSetId).pipe(
        take(1),
        flatMap((codeSetId) => {
          return combineLatest(
            this.codeSetService.getCodeSetInfo(codeSetId),
            this.codeSetService.getCodeSetVersionContent(codeSetId, action.payload.id),
          ).pipe(
            flatMap(([codeSetInfo, codeSetVersion]) => {
              return [
                ...this.codeSetService.getUpdateAction(codeSetInfo),
                new fromDAM.OpenEditor({
                  id: action.payload.id,
                  display: {
                    id: action.payload.id,
                    name: codeSetVersion.version,
                  },
                  editor: action.payload.editor,
                  initial: {
                    ...codeSetVersion,
                  },
                }),
              ];
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  toolbarSave$ = this.actions$.pipe(
    ofType(fromDAM.DamActionTypes.GlobalSave),
    map((action: GlobalSave) => {
      return new EditorSave();
    }),
  );

    constructor(
      actions$: Actions<CodeSetEditActions>,
      private codeSetService: CodeSetServiceService,
      private store: Store<any>,
      private message: MessageService,
    ) {
      super(CODE_SET_EDIT_WIDGET_ID, actions$);
    }
}
