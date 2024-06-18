import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { DeltaService } from 'src/app/modules/shared/services/delta.service';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { MessageService } from '../../modules/dam-framework/services/message.service';
import { SetValue } from '../../modules/dam-framework/store/data/dam.actions';
import { Type } from '../../modules/shared/constants/type.enum';
import { IUsages } from '../../modules/shared/models/cross-reference';
import { IValueSet } from '../../modules/shared/models/value-set.interface';
import { CrossReferencesService } from '../../modules/shared/services/cross-references.service';
import { ValueSetService } from '../../modules/value-set/service/value-set.service';
import { OpenValueSetDeltaEditor } from './value-set-edit.actions';
import {
  LoadValueSet,
  LoadValueSetFailure,
  LoadValueSetSuccess,
  OpenValueSetCrossRefEditor,
  OpenValueSetMetadataEditor,
  OpenValueSetPostDefEditor,
  OpenValueSetPreDefEditor,
  OpenValueSetStructureEditor,
  ValueSetEditActions,
  ValueSetEditActionTypes,
} from './value-set-edit.actions';

@Injectable()
export class ValueSetEditEffects {
  @Effect()
  loadValueSetEdits$ = this.actions$.pipe(
    ofType(ValueSetEditActionTypes.LoadValueSet),
    concatMap((action: LoadValueSet) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.store.select(fromIgamtSelectors.selectLoadedDocumentInfo).pipe(
        take(1),
        mergeMap((x) => {
          return this.valueSetService.getById(x, action.id).pipe(
            take(1),
            flatMap((valueSet: IValueSet) => {
              return [
                new fromDAM.TurnOffLoader(),
                new SetValue({
                  selected: valueSet,
                }),
                new LoadValueSetSuccess(valueSet),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                new fromDAM.TurnOffLoader(),
                new LoadValueSetFailure(error),
              );
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  loadValueSetFailure$ = this.actions$.pipe(
    ofType(ValueSetEditActionTypes.LoadValueSetFailure),
    map((action: LoadValueSetFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );
  valueSetNotFound = 'Could not find Code Set with ID ';

  @Effect()
  openValueSetPreDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenValueSetPreDefEditor>(
    ValueSetEditActionTypes.OpenValueSetPreDefEditor,
    fromIgamtDisplaySelectors.selectValueSetById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourcePreDef),
    this.valueSetNotFound,
  );

  @Effect()
  openValueSetPostDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenValueSetPostDefEditor>(
    ValueSetEditActionTypes.OpenValueSetPostDefEditor,
    fromIgamtDisplaySelectors.selectValueSetById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourcePostDef),
    this.valueSetNotFound,
  );
  @Effect()
  openValueSetCrossRefEditor$ = this.editorHelper.openCrossRefEditor<IUsages[], OpenValueSetCrossRefEditor>(
    ValueSetEditActionTypes.OpenValueSetCrossRefEditor,
    fromIgamtDisplaySelectors.selectValueSetById,
    Type.IGDOCUMENT,
    Type.VALUESET,
    fromIgamtSelectors.selectLoadedDocumentInfo,
    this.crossReferenceService.findUsagesDisplay,
    this.valueSetNotFound,
  );

  @Effect()
  openValueSetMetadataEditor$ = this.editorHelper.openMetadataEditor<OpenValueSetMetadataEditor>(
    ValueSetEditActionTypes.OpenValueSetMetadataEditor,
    fromIgamtDisplaySelectors.selectValueSetById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourceMetadata),
    this.valueSetNotFound,
  );
  @Effect()
  openValueSetStructureEditor$ = this.editorHelper.openStructureEditor<IValueSet, OpenValueSetStructureEditor>(
    ValueSetEditActionTypes.OpenValueSetStructureEditor,
    Type.VALUESET,
    fromIgamtDisplaySelectors.selectValueSetById,
    this.store.select(fromIgamtSelectedSelectors.selectedValueSet),
    this.valueSetNotFound,
  );

  @Effect()
  openDeltaEditor$ = this.editorHelper.openDeltaEditor<OpenValueSetDeltaEditor>(
    ValueSetEditActionTypes.OpenValueSetDeltaEditor,
    Type.VALUESET,
    fromIgamtDisplaySelectors.selectValueSetById,
    this.deltaService.getDeltaFromOrigin,
    this.valueSetNotFound,
  );

  constructor(
    private actions$: Actions<ValueSetEditActions>,
    private valueSetService: ValueSetService,
    private store: Store<any>,
    private message: MessageService,
    private editorHelper: OpenEditorService,
    private crossReferenceService: CrossReferencesService,
    private deltaService: DeltaService,
  ) { }
}
