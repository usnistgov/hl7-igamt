import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, take } from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/data/dam.actions';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { CoConstraintGroupService } from '../../modules/co-constraints/services/co-constraint-group.service';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { MessageService } from '../../modules/dam-framework/services/message.service';
import { RxjsStoreHelperService } from '../../modules/dam-framework/services/rxjs-store-helper.service';
import { SetValue } from '../../modules/dam-framework/store/data/dam.actions';
import { SegmentService } from '../../modules/segment/services/segment.service';
import { Type } from '../../modules/shared/constants/type.enum';
import { ICoConstraintGroup } from '../../modules/shared/models/co-constraint.interface';
import { IUsages } from '../../modules/shared/models/cross-reference';
import { CrossReferencesService } from '../../modules/shared/services/cross-references.service';
import { DeltaService } from '../../modules/shared/services/delta.service';
import { IgamtLoadedResourcesActionTypes, LoadResourceReferences } from '../dam-igamt/igamt.loaded-resources.actions';
import { selectLoadedDocumentInfo } from '../dam-igamt/igamt.selectors';
import { OpenCoConstraintGroupDeltaEditor } from './co-constraint-group-edit.actions';
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
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.ccService.getById(action.id).pipe(
        flatMap((ccGroup: ICoConstraintGroup) => {
          return [
            new fromDAM.TurnOffLoader(),
            new SetValue({
              selected: ccGroup,
            }),
            new LoadCoConstraintGroupSuccess(ccGroup),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new LoadCoConstraintGroupFailure(error),
          );
        }),
      );
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
      return this.store.select(fromIgamtSelectedSelectors.selectedCoConstraintGroup).pipe(
        filter((elm) => elm !== undefined),
        take(1),
        flatMap((ccGroup) => {
          return this.segmentService.getById(ccGroup.baseSegment).pipe(
            flatMap((segment) => {
              return this.store.select(fromIgamtDisplaySelectors.selectCoConstraintGroupsById, { id: ccGroup.id }).pipe(
                take(1),
                flatMap((display) => {
                  this.store.dispatch(new LoadResourceReferences({ resourceType: Type.SEGMENT, id: ccGroup.baseSegment }));

                  return RxjsStoreHelperService.listenAndReact(this.actions$, {
                    [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
                      do: (resourceRefSuccess: Action) => {
                        return of(new fromDamActions.OpenEditor({
                          id: action.payload.id,
                          display,
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
  openCoConstraintGroupDeltaEditor$ = this.actions$.pipe(
    ofType(CoConstraintGroupEditActionTypes.OpenCoConstraintGroupDeltaEditor),
    flatMap((action: OpenCoConstraintGroupDeltaEditor) => {
      return combineLatest(
        this.store.select(fromIgamtSelectedSelectors.selectedCoConstraintGroup),
        this.store.select(selectLoadedDocumentInfo),
      ).pipe(
        filter(([elm, info]) => elm !== undefined && info !== undefined),
        take(1),
        flatMap(([ccGroup, info]) => {
          return combineLatest(
            this.segmentService.getById(ccGroup.baseSegment),
            this.deltaService.getDeltaFromOrigin(Type.COCONSTRAINTGROUP, ccGroup.id, info.documentId),
          ).pipe(
            flatMap(([segment, value]) => {
              return this.store.select(fromIgamtDisplaySelectors.selectCoConstraintGroupsById, { id: ccGroup.id }).pipe(
                take(1),
                flatMap((display) => {
                  this.store.dispatch(new LoadResourceReferences({ resourceType: Type.SEGMENT, id: ccGroup.baseSegment }));
                  return RxjsStoreHelperService.listenAndReact(this.actions$, {
                    [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
                      do: (resourceRefSuccess: Action) => {
                        return of(new fromDamActions.OpenEditor({
                          id: action.payload.id,
                          display,
                          editor: action.payload.editor,
                          initial: {
                            segment,
                            value,
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
    fromIgamtDisplaySelectors.selectCoConstraintGroupsById,
    Type.IGDOCUMENT,
    Type.COCONSTRAINTGROUP,
    fromIgamtSelectors.selectLoadedDocumentInfo,
    this.crossReferenceService.findUsagesDisplay,
    this.CoConstraintGroupNotFound,
  );

  constructor(
    private actions$: Actions<CoConstraintGroupEditActions>,
    private store: Store<any>,
    private message: MessageService,
    private deltaService: DeltaService,
    private segmentService: SegmentService,
    private ccService: CoConstraintGroupService,
    private editorHelper: OpenEditorService,
    private crossReferenceService: CrossReferencesService) {

  }

}
