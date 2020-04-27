import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, of, pipe } from 'rxjs';
import {catchError, concatMap, filter, flatMap, map, switchMap, take} from 'rxjs/operators';
import { CoConstraintGroupService } from '../../modules/co-constraints/services/co-constraint-group.service';
import { MessageService } from '../../modules/core/services/message.service';
import {OpenEditorService} from '../../modules/core/services/open-editor.service';
import { SegmentService } from '../../modules/segment/services/segment.service';
import { Type } from '../../modules/shared/constants/type.enum';
import { ICoConstraintGroup } from '../../modules/shared/models/co-constraint.interface';
import {IUsages} from '../../modules/shared/models/cross-reference';
import {CrossReferencesService} from '../../modules/shared/services/cross-references.service';
import { RxjsStoreHelperService } from '../../modules/shared/services/rxjs-store-helper.service';
import { IgEditActionTypes, LoadResourceReferences, LoadResourceReferencesSuccess, LoadSelectedResource, OpenEditor } from '../ig/ig-edit/ig-edit.actions';
import * as fromIgEdit from '../ig/ig-edit/ig-edit.index';
import { selectCoConstraintGroupsById, selectedCoConstraintGroup, selectedDatatype } from '../ig/ig-edit/ig-edit.selectors';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
import {OpenSegmentCrossRefEditor, SegmentEditActionTypes} from '../segment-edit/segment-edit.actions';
import {
  CoConstraintGroupEditActions,
  CoConstraintGroupEditActionTypes,
  LoadCoConstraintGroup,
  LoadCoConstraintGroupFailure,
  LoadCoConstraintGroupSuccess,
  OpenCoConstraintGroupCrossRefEditor,
  OpenCoConstraintGroupEditor,
} from './co-constraint-group-edit.actions';

@Injectable()
export class CoConstraintGroupEditEffects {

  CoConstraintGroupNotFound = 'Could not find Co Constraint Group with ID ';

  @Effect()
  loadCoConstraintGroup$ = this.actions$.pipe(
    ofType(CoConstraintGroupEditActionTypes.LoadCoConstraintGroup),
    concatMap((action: LoadCoConstraintGroup) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.ccService.getById(action.id).pipe(
        flatMap((ccGroup: ICoConstraintGroup) => {
          return [
            new TurnOffLoader(),
            new LoadCoConstraintGroupSuccess(ccGroup),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new LoadCoConstraintGroupFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  loadCoConstraintGroupSuccess$ = this.actions$.pipe(
    ofType(CoConstraintGroupEditActionTypes.LoadCoConstraintGroupSuccess),
    map((action: LoadCoConstraintGroupSuccess) => {
      return new LoadSelectedResource(action.payload);
    }),
  );

  @Effect()
  loadCoConstraintGroupFailure$ = this.actions$.pipe(
    ofType(CoConstraintGroupEditActionTypes.LoadCoConstraintGroupFailure),
    map((action: LoadCoConstraintGroupFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  openCoConstraintGroupEditor$ = this.actions$.pipe(
    ofType(CoConstraintGroupEditActionTypes.OpenCoConstraintGroupEditor),
    flatMap((action: OpenCoConstraintGroupEditor) => {
      return this.store.select(selectedCoConstraintGroup).pipe(
        filter((elm) => elm !== undefined),
        take(1),
        flatMap((ccGroup) => {
          return this.segmentService.getById(ccGroup.baseSegment).pipe(
            flatMap((segment) => {
              return this.store.select(selectCoConstraintGroupsById, { id: ccGroup.id }).pipe(
                take(1),
                flatMap((display) => {
                  this.store.dispatch(new LoadResourceReferences({ resourceType: Type.SEGMENT, id: ccGroup.baseSegment }));

                  return RxjsStoreHelperService.listenAndReact(this.actions$, {
                    [IgEditActionTypes.LoadResourceReferencesSuccess]: {
                      do: (resourceRefSuccess: Action) => {
                        return of(new OpenEditor({
                          id: action.payload.id,
                          element: display,
                          editor: action.payload.editor,
                          initial: {
                            segment,
                            ccGroup,
                          },
                        }));
                      },
                    },
                  });
                }),
              );
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  OpenCoConstraintGroupCrossRefEditor$ = this.editorHelper.openCrossRefEditor<IUsages[], OpenCoConstraintGroupCrossRefEditor>(
    CoConstraintGroupEditActionTypes.OpenCoConstraintGroupCrossRefEditor,
    fromIgEdit.selectCoConstraintGroupsById,
    Type.IGDOCUMENT,
    Type.COCONSTRAINTGROUP,
    fromIgEdit.selectIgId,
    this.crossReferenceService.findUsagesDisplay,
    this.CoConstraintGroupNotFound,
  );

  constructor(
    private actions$: Actions<CoConstraintGroupEditActions>,
    private store: Store<any>,
    private message: MessageService,
    private segmentService: SegmentService,
    private ccService: CoConstraintGroupService,
    private editorHelper: OpenEditorService,
    private crossReferenceService: CrossReferencesService) {

  }

}
