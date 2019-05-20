import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/core/services/message.service';
import { IgService } from 'src/app/modules/ig/services/ig.service';
import { Message } from '../../../modules/core/models/message/message.class';
import { IGDisplayInfo, IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import {ICopyResourceResponse} from '../../../modules/ig/models/toc/toc-operation.class';
import { TurnOffLoader, TurnOnLoader } from '../../loader/loader.actions';
import {
  CopyResourceFailure,
  EditorSave,
  OpenEditor,
  OpenIgMetadataEditorNode,
  OpenNarrativeEditorNode,
  TableOfContentSave,
  TableOfContentSaveFailure,
  TableOfContentSaveSuccess,
  ToolbarSave,
} from './ig-edit.actions';
import {
  AddResourceFailure,
  AddResourceSuccess, CopyResource, CopyResourceSuccess,
  IgEditActions,
  IgEditActionTypes,
  IgEditResolverLoad,
  IgEditResolverLoadFailure,
  IgEditResolverLoadSuccess, IgEditTocAddResource,
} from './ig-edit.actions';
import { selectIgDocument, selectSectionDisplayById, selectSectionFromIgById, selectTableOfContentChanged } from './ig-edit.selectors';

@Injectable()
export class IgEditEffects {

  @Effect()
  igEditResolverLoad$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditResolverLoad),
    switchMap((action: IgEditResolverLoad) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.getIgInfo(action.id).pipe(
        flatMap((igInfo: IGDisplayInfo) => {
          return [
            new TurnOffLoader(),
            new IgEditResolverLoadSuccess(igInfo),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new IgEditResolverLoadFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  igEditResolverLoadFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditResolverLoadFailure),
    map((action: IgEditResolverLoadFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  igEditToolbarSave$ = this.actions$.pipe(
    ofType(IgEditActionTypes.ToolbarSave),
    concatMap((action: ToolbarSave) => {
      return combineLatest(
        this.store.select(selectTableOfContentChanged),
        this.store.select(selectIgDocument),
      ).pipe(
        take(1),
        mergeMap(([changed, ig]) => {
          if (changed) {
            this.store.dispatch(new TableOfContentSave({
              sections: ig.content,
              id: ig.id,
            }));

            return this.actions$.pipe(
              ofType(IgEditActionTypes.TableOfContentSaveSuccess, IgEditActionTypes.TableOfContentSaveFailure),
              filter((status) => (status.type === IgEditActionTypes.TableOfContentSaveSuccess ||
                status.type === IgEditActionTypes.TableOfContentSaveFailure) && status.igId === ig.id),
              take(1),
              map((tocSaveStatus: Action) => {
                switch (tocSaveStatus.type) {
                  case IgEditActionTypes.TableOfContentSaveSuccess:
                    return new EditorSave({
                      tocSaveStatus: true,
                    });
                  case IgEditActionTypes.TableOfContentSaveFailure:
                    return new EditorSave({
                      tocSaveStatus: false,
                    });
                }
              }),
            );

          } else {
            return of(new EditorSave({
              tocSaveStatus: true,
            }));
          }
        }),
      );
    }),
  );

  @Effect()
  igEditSaveTOC$ = this.actions$.pipe(
    ofType(IgEditActionTypes.TableOfContentSave),
    concatMap((action: TableOfContentSave) => {
      return this.store.select(selectIgDocument).pipe(
        take(1),
        mergeMap((ig: IgDocument) => {
          return this.igService.saveTextSections(ig.id, ig.content).pipe(
            flatMap((message) => {
              return [
                this.message.messageToAction(message),
                new TableOfContentSaveSuccess(ig.id),
              ];
            }),
            catchError((error) => {
              return of(this.message.actionFromError(error), new TableOfContentSaveFailure(ig.id));
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  igEditOpenNarrativeNode$ = this.actions$.pipe(
    ofType(IgEditActionTypes.OpenNarrativeEditorNode),
    switchMap((action: OpenNarrativeEditorNode) => {
      return combineLatest(
        this.store.select(selectSectionDisplayById, { id: action.payload.id }),
        this.store.select(selectSectionFromIgById, { id: action.payload.id }))
        .pipe(
          take(1),
          map(([elm, section]) => {
            return new OpenEditor({
              element: elm,
              editor: action.payload.editor,
              initial: {
                id: section.id,
                label: section.label,
                description: section.description,
              },
            });
          }),
        );
    }),
  );

  @Effect()
  igEditOpenIgMetadataNode$ = this.actions$.pipe(
    ofType(IgEditActionTypes.OpenIgMetadataEditorNode),
    switchMap((action: OpenIgMetadataEditorNode) => {
      return this.store.select(selectIgDocument)
        .pipe(
          take(1),
          map((ig) => {
            return new OpenEditor({
              element: this.igService.igToIDisplayElement(ig),
              editor: action.payload.editor,
              initial: ig.metadata,
            });
          }),
        );
    }),
  );

  @Effect()
  igAddResourceFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.AddResourceFailure),
    map((action: AddResourceFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );
  @Effect()
  copyResourceFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CopyResourceFailure),
    map((action: CopyResourceFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  IgEditTocAddResource$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditTocAddResource),
    switchMap((action: IgEditTocAddResource) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.addResource(action.payload).pipe(
        flatMap((response: Message<IGDisplayInfo>) => {
          return [
            new TurnOffLoader(),
            new AddResourceSuccess(response.data),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new AddResourceFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  IgCopyResource$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CopyResource),
    switchMap((action: CopyResource) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.copyResource(action.payload).pipe(
        flatMap((response: Message<ICopyResourceResponse>) => {
          return [
            new TurnOffLoader(),
            new CopyResourceSuccess(response.data),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new CopyResourceFailure(error),
          );
        }),
      );
    }),
  );

  constructor(
    private actions$: Actions<IgEditActions>,
    private igService: IgService,
    private store: Store<any>,
    private message: MessageService,
  ) {
  }

}
