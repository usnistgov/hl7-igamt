import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Action, MemoizedSelector, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { concatMap, flatMap, switchMap, take } from 'rxjs/operators';
import { IgEditActionTypes, LoadResourceReferences, LoadResourceReferencesFailure, LoadResourceReferencesSuccess, OpenEditor, OpenEditorBase, OpenEditorFailure } from '../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectIgId } from '../../../root-store/ig/ig-edit/ig-edit.selectors';
import { Type } from '../../shared/constants/type.enum';
import { IUsages } from '../../shared/models/cross-reference';
import { IDelta } from '../../shared/models/delta';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IResource } from '../../shared/models/resource.interface';
import { RxjsStoreHelperService } from '../../shared/services/rxjs-store-helper.service';
import { IResourceMetadata } from '../components/resource-metadata-editor/resource-metadata-editor.component';
import { MessageType, UserMessage } from '../models/message/message.class';
import { MessageService } from './message.service';
import {IDynamicMappingInfo} from "../../shared/models/segment.interface";

@Injectable({
  providedIn: 'root',
})
export class OpenEditorService {

  constructor(
    private actions$: Actions,
    private message: MessageService,
    private rxjsHelper: RxjsStoreHelperService,
    private store: Store<any>) { }

  openEditor<T extends any, A extends OpenEditorBase>(
    _action: string,
    displayElementSelector: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: (action: A) => Observable<T>,
    notFoundMessage: string,
    handler: (a: A, payload: T, display: IDisplayElement) => Observable<Action>,
  ): Observable<Action> {
    return this.actions$.pipe(
      ofType(_action),
      switchMap((action: A) => {
        return combineLatest(
          this.store.select(displayElementSelector, { id: action.payload.id }),
          resource$(action),
        ).pipe(
          take(1),
          switchMap(([elm, resource]) => {
            if (!elm || !elm.id) {
              return of(
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, notFoundMessage + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }));
            } else {
              return handler(action, resource, elm);
            }
          }),
        );
      }),
    );
  }

  openStructureEditor<T extends IResource, A extends OpenEditorBase>(
    _action: string,
    type: Type,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: Observable<T>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      () => resource$,
      notFoundMessage,
      (action: A, resource: T, display: IDisplayElement) => {
        const openEditor = new OpenEditor({
          id: action.payload.id,
          element: display,
          editor: action.payload.editor,
          initial: {
            changes: {},
            resource,
          },
        });
        this.store.dispatch(new LoadResourceReferences({ resourceType: type, id: action.payload.id }));
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
      },
    );
  }

  openDeltaEditor<A extends OpenEditorBase>(
    _action: string,
    type: Type,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: (type: Type, elementId: string, igId: string) => Observable<IDelta>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<IDelta, A>(
      _action,
      displayElement$,
      (a: OpenEditorBase) => {
        return this.store.select(selectIgId).pipe(
          flatMap((igId) => {
            return resource$(type, a.payload.id, igId);
          }),
        );
      },
      notFoundMessage,
      this.openEditorProvider<A, IDelta>(),
    );
  }

  openConformanceStatementEditor<T, A extends OpenEditorBase>(
    _action: string,
    type: Type,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: (action: A) => Observable<T>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      resource$,
      notFoundMessage,
      (action: A, resource: T, display: IDisplayElement) => {
        const openEditor = new OpenEditor({
          id: action.payload.id,
          element: display,
          editor: action.payload.editor,
          initial: {
            changes: [],
            resource,
          },
        });
        this.store.dispatch(new LoadResourceReferences({ resourceType: type, id: action.payload.id }));
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
      },
    );
  }

  openDefEditorHandler<T extends string, A extends OpenEditorBase>(
    _action: string,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: Observable<T>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      () => resource$,
      notFoundMessage,
      this.openEditorProvider<A, T>(),
    );
  }

  openEditorProvider<A extends OpenEditorBase, T>() {
    return (action: A, resource: T, display: IDisplayElement) => {
      return of(new OpenEditor({
        id: action.payload.id,
        element: display,
        editor: action.payload.editor,
        initial: {
          value: resource,
        },
      }));
    };
  }

  openMetadataEditor<A extends OpenEditorBase>(
    _action: string,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: Observable<IResourceMetadata>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<IResourceMetadata, A>(
      _action,
      displayElement$,
      () => resource$,
      notFoundMessage,
      (action: A, resource: IResourceMetadata, display: IDisplayElement) => {
        return of(new OpenEditor({
          id: action.payload.id,
          element: display,
          editor: action.payload.editor,
          initial: {
            ...resource,
          },
        }));
      },
    );
  }

  openDynMappingEditor<A extends OpenEditorBase>(
    _action: string,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource: (action: A) => Observable<any>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<any, A>(
      _action,
      displayElement$,
      resource,
      notFoundMessage,
      (action: A, dynMapping: any, display: IDisplayElement) => {
        return of(new OpenEditor({
          id: action.payload.id,
          element: display,
          editor: action.payload.editor,
          initial: {
            ...dynMapping,
          },
        }));
      },
    );
  }

  openCrossRefEditor<T extends IUsages[], A extends OpenEditorBase>(
    _action: string,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    documentType: Type,
    elementType: Type,
    id: MemoizedSelector<object, string>,
    service: (documentId: string, documentType: Type, elementType: Type, elementId: string) => Observable<T>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      (action: A) => {
        return this.store.select(id).pipe(
          concatMap((igId: string) => {
            return service(igId, documentType, elementType, action.payload.id);
          }),
        );
      },
      notFoundMessage,
      (action: A, resource: IUsages[], display: IDisplayElement) => {
        return of(new OpenEditor({
          id: action.payload.id,
          element: display,
          editor: action.payload.editor,
          initial: resource,
        }));
      },
    );
  }

}
