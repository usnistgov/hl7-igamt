import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, take } from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/data/dam.actions';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import { CoConstraintGroupService } from '../../modules/co-constraints/services/co-constraint-group.service';
import { MessageService } from '../../modules/dam-framework/services/message.service';
import { SetValue } from '../../modules/dam-framework/store/data/dam.actions';
import { SegmentService } from '../../modules/segment/services/segment.service';
import { Type } from '../../modules/shared/constants/type.enum';
import { ICoConstraintGroup } from '../../modules/shared/models/co-constraint.interface';
import { RxjsStoreHelperService } from '../../modules/shared/services/rxjs-store-helper.service';
import { IgEditActionTypes, LoadResourceReferences } from '../ig/ig-edit/ig-edit.actions';
import { CoConstraintGroupEditActions, CoConstraintGroupEditActionTypes, LoadCoConstraintGroup, LoadCoConstraintGroupFailure, LoadCoConstraintGroupSuccess, OpenCoConstraintGroupEditor } from './co-constraint-group-edit.actions';

@Injectable()
export class CoConstraintGroupEditEffects {

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
  loadCoConstraintGroupSuccess$ = this.actions$.pipe(
    ofType(CoConstraintGroupEditActionTypes.LoadCoConstraintGroupSuccess),
    flatMap((action: LoadCoConstraintGroupSuccess) => {
      return [
        new SetValue({
          selected: action.payload,
        }),
      ];
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
                    [IgEditActionTypes.LoadResourceReferencesSuccess]: {
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

  constructor(
    private actions$: Actions<CoConstraintGroupEditActions>,
    private store: Store<any>,
    private message: MessageService,
    private segmentService: SegmentService,
    private ccService: CoConstraintGroupService) {

  }

}
