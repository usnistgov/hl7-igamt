import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import {EMPTY, of} from 'rxjs';
import {catchError, flatMap, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import {
  LoadValueSet,
  LoadValueSetFailure,
  LoadValueSetSuccess,
  OpenValueSetCrossRefEditor,
  OpenValueSetMetadataEditor,
  OpenValueSetPostDefEditor,
  OpenValueSetPreDefEditor, OpenValueSetStructureEditor,
  ValueSetEditActions,
  ValueSetEditActionTypes,
} from './value-set-edit.actions';

import {HttpErrorResponse} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {MessageService} from '../../modules/core/services/message.service';
import {OpenEditorService} from '../../modules/core/services/open-editor.service';
import {IValueSet} from '../../modules/shared/models/value-set.interface';
import {CrossReferencesService} from '../../modules/shared/services/cross-references.service';
import {ValueSetService} from '../../modules/value-set/service/value-set.service';
import {TurnOffLoader, TurnOnLoader} from '../loader/loader.actions';

import {Type} from '../../modules/shared/constants/type.enum';
import {IUsages} from '../../modules/shared/models/cross-reference';
import {LoadSelectedResource} from '../ig/ig-edit/ig-edit.actions';
import * as fromIgEdit from '../ig/ig-edit/ig-edit.index';
import {selectedResourcePreDef} from '../ig/ig-edit/ig-edit.index';
import {selectedResourceMetadata} from '../ig/ig-edit/ig-edit.index';
import {selectedResourcePostDef} from '../ig/ig-edit/ig-edit.index';

@Injectable()
export class ValueSetEditEffects {
  @Effect()
  loadValueSetEdits$ = this.actions$.pipe(
    ofType(ValueSetEditActionTypes.LoadValueSet),
    switchMap((action: LoadValueSet) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.store.select(fromIgEdit.selectIgId).pipe(
        mergeMap((x: string ) => {
          return this.valueSetService.getById(x, action.id).pipe(
            take(1),
            flatMap((valueSet: IValueSet) => {
              return [
                new TurnOffLoader(),
                new LoadValueSetSuccess(valueSet),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                new TurnOffLoader(),
                new LoadValueSetFailure(error),
              );
            }),
          );
        }),
      );
    }),
  );
  @Effect()
  loadValueSetSuccess = this.actions$.pipe(
    ofType(ValueSetEditActionTypes.LoadValueSetSuccess),
    map((action: LoadValueSetSuccess) => {
      return new LoadSelectedResource(action.valueSet);
    }),
  );

  @Effect()
  loadValueSetFailure$ = this.actions$.pipe(
    ofType(ValueSetEditActionTypes.LoadValueSetFailure),
    map((action: LoadValueSetFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );
  valueSetNotFound = 'Could not find Value Set with ID ';

  @Effect()
  openValueSetPreDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenValueSetPreDefEditor>(
    ValueSetEditActionTypes.OpenValueSetPreDefEditor,
    fromIgEdit.selectValueSetById,
    this.store.select(selectedResourcePreDef),
    this.valueSetNotFound,
  );

  @Effect()
  openValueSetPostDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenValueSetPostDefEditor>(
    ValueSetEditActionTypes.OpenValueSetPostDefEditor,
    fromIgEdit.selectValueSetById,
    this.store.select(selectedResourcePostDef),
    this.valueSetNotFound,
  );
  @Effect()
  openValueSetCrossRefEditor$ = this.editorHelper.openCrossRefEditor<IUsages[], OpenValueSetCrossRefEditor >(
    ValueSetEditActionTypes.OpenValueSetCrossRefEditor,
    fromIgEdit.selectValueSetById,
    Type.IGDOCUMENT,
    Type.VALUESET,
    fromIgEdit.selectIgId,
    this.crossReferenceService.findUsagesDisplay,
    this.valueSetNotFound,
  );

  @Effect()
  openValueSetMetadataEditor$ = this.editorHelper.openMetadataEditor<OpenValueSetMetadataEditor>(
    ValueSetEditActionTypes.OpenValueSetMetadataEditor,
    fromIgEdit.selectValueSetById,
    this.store.select(selectedResourceMetadata),
    this.valueSetNotFound,
  );
  @Effect()
  openValueSetStructureEditor$ = this.editorHelper.openStructureEditor<IValueSet, OpenValueSetStructureEditor>(
    ValueSetEditActionTypes.OpenValueSetStructureEditor,
    Type.VALUESET,
    fromIgEdit.selectValueSetById,
    this.store.select(fromIgEdit.selectedValueSet),
    this.valueSetNotFound,
  );

  constructor(private actions$: Actions<ValueSetEditActions>,
              private valueSetService: ValueSetService,
              private store: Store<any>,
              private message: MessageService,
              private editorHelper: OpenEditorService,
              private crossReferenceService: CrossReferencesService,
              ) {}
  }
