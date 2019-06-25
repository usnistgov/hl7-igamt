import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import {catchError, concatMap, flatMap, map, switchMap, take} from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { MessageType, UserMessage } from '../../modules/core/models/message/message.class';
import { MessageService } from '../../modules/core/services/message.service';
import { SegmentService } from '../../modules/segment/services/segment.service';
import { ISegment } from '../../modules/shared/models/segment.interface';
import {CrossReferencesService} from '../../modules/shared/services/cross-references.service';
import { RxjsStoreHelperService } from '../../modules/shared/services/rxjs-store-helper.service';
import { IgEditActionTypes, LoadResourceReferences, LoadResourceReferencesFailure, LoadResourceReferencesSuccess, LoadSelectedResource, OpenEditor, OpenEditorFailure } from '../ig/ig-edit/ig-edit.actions';
import { selectedResourceMetadata, selectedResourcePostDef, selectedResourcePreDef } from '../ig/ig-edit/ig-edit.selectors';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
import {
  LoadSegment,
  LoadSegmentFailure,
  LoadSegmentSuccess,
  OpenSegmentCrossRefEditor,
  OpenSegmentPostDefEditor,
  OpenSegmentPreDefEditor,
  OpenSegmentStructureEditor,
  SegmentEditActionTypes,
} from './segment-edit.actions';

@Injectable()
export class SegmentEditEffects {

  @Effect()
  loadSegment$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.LoadSegment),
    switchMap((action: LoadSegment) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.segmentService.getById(action.id).pipe(
        flatMap((segment: ISegment) => {
          return [
            new TurnOffLoader(),
            new LoadSegmentSuccess(segment),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new LoadSegmentFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  LoadSegmentSuccess$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.LoadSegmentSuccess),
    map((action: LoadSegmentSuccess) => {
      return new LoadSelectedResource(action.segment);
    }),
  );

  @Effect()
  LoadSegmentFailure$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.LoadSegmentFailure),
    map((action: LoadSegmentFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  SegmentNotFound = 'Could not find segment with ID ';

  @Effect()
  openSegmentPreDefEditor$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.OpenSegmentPreDefEditor),
    switchMap((action: OpenSegmentPreDefEditor) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectSegmentsById, { id: action.payload.id }),
        this.store.select(selectedResourcePreDef))
        .pipe(
          take(1),
          flatMap(([elm, predef]): Action[] => {
            if (!elm || !elm.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.SegmentNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new OpenEditor({
                  id: action.payload.id,
                  element: elm,
                  editor: action.payload.editor,
                  initial: {
                    value: predef,
                  },
                }),
              ];
            }
          }),
        );
    }),
  );
  @Effect()
  openSegmentCrossRefEditor$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.OpenSegmentCrossRefEditor),
    switchMap((action: OpenSegmentCrossRefEditor) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectSegmentsById, { id: action.payload.id }),
        this.store.select(fromIgEdit.selectIgId).pipe(
          concatMap((igId: string) =>  this.crossReferenceService.findUsagesDisplay(igId, Type.IGDOCUMENT, Type.SEGMENT, action.payload.id)),
        )).pipe(
          take(1),
          flatMap(([elm, crossRef]): Action[] => {
            if (!elm || !elm.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.SegmentNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new OpenEditor({
                  id: action.payload.id,
                  element: elm,
                  editor: action.payload.editor,
                  initial: [... crossRef],
                }),
              ];
            }
          }),
        );
    }),
  );

  @Effect()
  openSegmentMetadataEditor$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.OpenSegmentMetadataEditor),
    switchMap((action: OpenSegmentPreDefEditor) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectSegmentsById, { id: action.payload.id }),
        this.store.select(selectedResourceMetadata))
        .pipe(
          take(1),
          flatMap(([elm, metadata]): Action[] => {
            if (!elm || !elm.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.SegmentNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new OpenEditor({
                  id: action.payload.id,
                  element: elm,
                  editor: action.payload.editor,
                  initial: {
                    ...metadata,
                  },
                }),
              ];
            }
          }),
        );
    }),
  );

  @Effect()
  openSegmentPostDefEditor$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.OpenSegmentPostDefEditor),
    switchMap((action: OpenSegmentPostDefEditor) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectSegmentsById, { id: action.payload.id }),
        this.store.select(selectedResourcePostDef))
        .pipe(
          take(1),
          flatMap(([elm, postdef]): Action[] => {
            if (!elm || !elm.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.SegmentNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new OpenEditor({
                  id: action.payload.id,
                  element: elm,
                  editor: action.payload.editor,
                  initial: {
                    value: postdef,
                  },
                }),
              ];
            }
          }),
        );
    }),
  );

  @Effect()
  openSegmentStructureEditor$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.OpenSegmentStructureEditor),
    switchMap((action: OpenSegmentStructureEditor) => {
      return combineLatest(this.store.select(fromIgEdit.selectSegmentsById, { id: action.payload.id }),
        this.store.select(fromIgEdit.selectedSegment)).pipe(
          take(1),
          switchMap(([elm, segment]) => {
            if (!elm || !elm.id) {
              return of(
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.SegmentNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }));
            } else {
              const openEditor = new OpenEditor({
                id: action.payload.id,
                element: elm,
                editor: action.payload.editor,
                initial: {
                  changes: {},
                  segment,
                },
              });
              this.store.dispatch(new LoadResourceReferences({ resourceType: Type.SEGMENT, id: action.payload.id }));
              return this.rxjsHelper.listenAndReact(this.actions$, {
                [IgEditActionTypes.LoadResourceReferencesSuccess]: {
                  do: (loadSuccess: LoadResourceReferencesSuccess) => {
                    return of(openEditor);
                  },
                },
                [IgEditActionTypes.LoadResourceReferencesFailure]: {
                  do: (loadFailure: LoadResourceReferencesFailure) => {
                    return of(new OpenEditorFailure({ id: action.payload.id }));
                  },
                },
              });
            }
          }),
        );
    }),
  );

  constructor(
    private actions$: Actions<any>,
    private store: Store<any>,
    private message: MessageService,
    private segmentService: SegmentService,
    private rxjsHelper: RxjsStoreHelperService,
    private crossReferenceService: CrossReferencesService,
  ) { }

}
