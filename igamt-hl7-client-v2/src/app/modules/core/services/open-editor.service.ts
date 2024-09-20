import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Action, MemoizedSelector, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, pluck, switchMap, take } from 'rxjs/operators';
import { InsertResourcesInRepostory, OpenEditor, OpenEditorBase, OpenEditorFailure } from 'src/app/modules/dam-framework/store/index';
import { CompositeProfileActionTypes, OpenCompositeProfileStructureEditor } from 'src/app/root-store/composite-profile/composite-profile.actions';
import { selectCompositeProfileById } from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import {
  IgamtLoadedResourcesActionTypes,
  LoadResourceReferences,
  LoadResourceReferencesFailure,
  LoadResourceReferencesSuccess,
} from '../../../root-store/dam-igamt/igamt.loaded-resources.actions';
import { selectLoadedDocumentInfo } from '../../../root-store/dam-igamt/igamt.selectors';
import { OpenProfileComponentMessageCoConstraintsEditor } from '../../../root-store/profile-component/profile-component.actions';
import { ConformanceProfileService } from '../../conformance-profile/services/conformance-profile.service';
import { IDamResource } from '../../dam-framework';
import { MessageType, UserMessage } from '../../dam-framework/models/messages/message.class';
import { MessageService } from '../../dam-framework/services/message.service';
import { RxjsStoreHelperService } from '../../dam-framework/services/rxjs-store-helper.service';
import * as fromDAM from '../../dam-framework/store';
import * as fromRouterSelector from '../../dam-framework/store/router/router.selectors';
import { Type } from '../../shared/constants/type.enum';
import { IDocumentRef } from '../../shared/models/abstract-domain.interface';
import { IFlatResourceBindings } from '../../shared/models/binding.interface';
import { ICompositeProfile, ICompositeProfileState } from '../../shared/models/composite-profile';
import { IConformanceProfile } from '../../shared/models/conformance-profile.interface';
import { IUsages } from '../../shared/models/cross-reference';
import { IDelta } from '../../shared/models/delta';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IProfileComponentContext } from '../../shared/models/profile.component';
import { IResource } from '../../shared/models/resource.interface';
import { ResourceService } from '../../shared/services/resource.service';
import { IResourceMetadata } from '../components/resource-metadata-editor/resource-metadata-editor.component';

@Injectable({
  providedIn: 'root',
})
export class OpenEditorService {

  constructor(
    private actions$: Actions,
    private message: MessageService,
    private store: Store<any>, private resourceService: ResourceService) { }

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
          display,
          editor: action.payload.editor,
          initial: {
            changes: {},
            resource,
          },
        });
        this.store.dispatch(new LoadResourceReferences({ resourceType: type, id: action.payload.id }));
        return RxjsStoreHelperService.listenAndReact(this.actions$, {
          [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
            do: (loadSuccess: LoadResourceReferencesSuccess) => {
              return of(openEditor);
            },
          },
          [IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure]: {
            do: (loadFailure: LoadResourceReferencesFailure) => {
              return of(new OpenEditorFailure({ id: action.payload.id }));
            },
          },
        });
      },
    );
  }

  openBindingsEditor<T extends IResource, A extends OpenEditorBase>(
    _action: string,
    type: Type,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: Observable<T>,
    getter: (id, type) => Observable<IFlatResourceBindings>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      () => resource$,
      notFoundMessage,
      (action: A, resource: T, display: IDisplayElement) => {
        return getter(action.payload.id, type).pipe(
          flatMap((bindings) => {
            const openEditor = new OpenEditor({
              id: action.payload.id,
              display,
              editor: action.payload.editor,
              initial: {
                changes: {},
                bindings,
              },
            });
            this.store.dispatch(new LoadResourceReferences({ resourceType: type, id: action.payload.id }));
            return RxjsStoreHelperService.listenAndReact(this.actions$, {
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
                do: (loadSuccess: LoadResourceReferencesSuccess) => {
                  return of(openEditor);
                },
              },
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure]: {
                do: (loadFailure: LoadResourceReferencesFailure) => {
                  return of(new OpenEditorFailure({ id: action.payload.id }));
                },
              },
            });
          }),
        );
      },
    );
  }

  openCompositeProfileStructureEditor(
    resource$: Observable<ICompositeProfile>,
    generate: (cp: ICompositeProfile) => Observable<ICompositeProfileState>,
  ): Observable<Action> {
    return this.openEditor<ICompositeProfile, OpenCompositeProfileStructureEditor>(
      CompositeProfileActionTypes.OpenCompositeProfileStructureEditor,
      selectCompositeProfileById,
      () => resource$,
      'Composite Profile not found',
      (action: OpenCompositeProfileStructureEditor, cp: ICompositeProfile, display: IDisplayElement) => {
        return generate(cp).pipe(
          flatMap((cps) => {
            const openEditor = new OpenEditor({
              id: action.payload.id,
              display,
              editor: action.payload.editor,
              initial: {
                ...cps,
              },
            });

            this.store.dispatch(new LoadResourceReferences({ resourceType: Type.CONFORMANCEPROFILE, id: cp.conformanceProfileId }));
            return RxjsStoreHelperService.listenAndReact(this.actions$, {
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
                do: (loadSuccess: LoadResourceReferencesSuccess) => {
                  return of(new InsertResourcesInRepostory({
                    collections: [{
                      key: 'datatypes',
                      values: [...cps.datatypes.map((dr) => dr.display)],
                    }, {
                      key: 'segments',
                      values: [...cps.segments.map((dr) => dr.display)],
                    }, {
                      key: 'resources',
                      values: [...[...cps.datatypes, ...cps.segments].map((dr) => dr.resource), ...cps.references],
                    }],
                  }), openEditor);
                },
              },
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure]: {
                do: (loadFailure: LoadResourceReferencesFailure) => {
                  return of(new OpenEditorFailure({ id: action.payload.id }));
                },
              },
            });
          }),
        );
      },
    );
  }

  openProfileComponentContextStructureEditor<T extends IProfileComponentContext, A extends OpenEditorBase>(
    _action: string,
    displayElement$: MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>,
    resource$: Observable<T>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      () => resource$,
      notFoundMessage,
      (action: A, context: T, display: IDisplayElement) => {
        const openEditor = new OpenEditor({
          id: action.payload.id,
          display,
          editor: action.payload.editor,
          initial: {
            resource: context,
            changes: {},
          },
        });
        return this.store.select(fromRouterSelector.selectRouteParams).pipe(
          take(1),
          pluck('pcId'),
          switchMap((pcId) => {
            return this.resourceService.getProfileComponentContextResources((pcId as string), display.id).pipe(
              switchMap((resources) => {
                const collections: Array<{
                  key: string;
                  values: IDamResource[];
                }> = [{
                  key: 'resources',
                  values: resources,
                }];
                this.store.dispatch(new fromDAM.LoadResourcesInRepostory({ collections }));
                return of(openEditor);
              }),
              catchError((err) => of(new OpenEditorFailure({ id: action.payload.id }))),
            );
          }));
      },
    );
  }

  openCoConstraintsBindingEditor<T extends IConformanceProfile, A extends OpenEditorBase>(
    _action: string,
    type: Type,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: Observable<T>,
    notFoundMessage: string,
    service: ConformanceProfileService,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      () => resource$,
      notFoundMessage,
      (action: A, resource: T, display: IDisplayElement) => {
        const openEditor = new OpenEditor({
          id: action.payload.id,
          display,
          editor: action.payload.editor,
          initial: {
            value: resource.coConstraintsBindings,
            resource,
          },
        });
        this.store.dispatch(new LoadResourceReferences({ resourceType: type, id: action.payload.id }));
        return RxjsStoreHelperService.listenAndReact(this.actions$, {
          [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
            do: (loadSuccess: LoadResourceReferencesSuccess) => {
              return service.getReferencedCoConstraintGroups(action.payload.id).pipe(
                take(1),
                flatMap((groups) => {
                  this.store.dispatch(new fromDAM.InsertResourcesInRepostory({
                    collections: [{
                      key: 'resources',
                      values: [...groups],
                    }],
                  }));
                  return of(openEditor);
                }),
                catchError((e) => of(new OpenEditorFailure({ id: action.payload.id }))),
              );
            },
          },
          [IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure]: {
            do: (loadFailure: LoadResourceReferencesFailure) => {
              return of(new OpenEditorFailure({ id: action.payload.id }));
            },
          },
        });
      },
    );
  }

  openCoConstraintsBindingProfileComponentEditor(
    _action: string,
    type: Type,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    messageContext$: Observable<IProfileComponentContext>,
    fetchConformanceProfile: (id: string) => Observable<IConformanceProfile>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<IProfileComponentContext, OpenProfileComponentMessageCoConstraintsEditor>(
      _action,
      displayElement$,
      () => messageContext$,
      notFoundMessage,
      (action: OpenProfileComponentMessageCoConstraintsEditor, context: IProfileComponentContext, display: IDisplayElement) => {
        return fetchConformanceProfile(context.sourceId).pipe(
          filter((v) => !!v),
          take(1),
          flatMap((resource) => {
            const openEditor = new OpenEditor({
              id: action.payload.id,
              display,
              editor: action.payload.editor,
              initial: {
                resource,
                profileComponent: context.profileComponentCoConstraints ? context.profileComponentCoConstraints.bindings : undefined,
              },
            });
            this.store.dispatch(new LoadResourceReferences({ resourceType: type, id: resource.id }));
            return RxjsStoreHelperService.listenAndReact(this.actions$, {
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
                do: (loadSuccess: LoadResourceReferencesSuccess) => {
                  return of(openEditor);
                },
              },
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure]: {
                do: (loadFailure: LoadResourceReferencesFailure) => {
                  return of(new OpenEditorFailure({ id: action.payload.id }));
                },
              },
            });
          }),
        );

      },
    );
  }

  openConformanceStatementProfileComponentEditor<T, A extends OpenEditorBase>(
    _action: string,
    type: Type,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: (action: A) => Observable<T>,
    context$: Observable<IProfileComponentContext>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      resource$,
      notFoundMessage,
      (action: A, resource: T, display: IDisplayElement) => {
        return context$.pipe(
          take(1),
          flatMap((ctx) => {
            const openEditor = new OpenEditor({
              id: action.payload.id,
              display,
              editor: action.payload.editor,
              initial: resource,
            });
            this.store.dispatch(new LoadResourceReferences({ resourceType: ctx.level, id: ctx.sourceId }));
            return RxjsStoreHelperService.listenAndReact(this.actions$, {
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
                do: (loadSuccess: LoadResourceReferencesSuccess) => {
                  return of(openEditor);
                },
              },
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure]: {
                do: (loadFailure: LoadResourceReferencesFailure) => {
                  return of(new OpenEditorFailure({ id: action.payload.id }));
                },
              },
            });
          }),
        );
      },
    );
  }

  openDeltaEditor<A extends OpenEditorBase>(
    _action: string,
    type: Type,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: (type: Type, elementId: string, igId: string) => Observable<IDelta<any>>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<IDelta<any>, A>(
      _action,
      displayElement$,
      (a: OpenEditorBase) => {
        return this.store.select(selectLoadedDocumentInfo).pipe(
          flatMap((documentInfo) => {
            return resource$(type, a.payload.id, documentInfo.documentId);
          }),
        );
      },
      notFoundMessage,
      this.openEditorProvider<A, IDelta<any>>(type, type !== Type.COMPOSITEPROFILE),
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
          display,
          editor: action.payload.editor,
          initial: resource,
        });
        this.store.dispatch(new LoadResourceReferences({ resourceType: type, id: action.payload.id }));
        return RxjsStoreHelperService.listenAndReact(this.actions$, {
          [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
            do: (loadSuccess: LoadResourceReferencesSuccess) => {
              return of(openEditor);
            },
          },
          [IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure]: {
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

  openEditorProvider<A extends OpenEditorBase, T>(type?: Type, loadResourceReference: boolean = false) {
    return (action: A, resource: T, display: IDisplayElement) => {
      const openEditor = new OpenEditor({
        id: action.payload.id,
        display,
        editor: action.payload.editor,
        initial: {
          value: resource,
        },
      });

      if (loadResourceReference && type) {
        this.store.dispatch(new LoadResourceReferences({ resourceType: type, id: action.payload.id }));
        return RxjsStoreHelperService.listenAndReact(this.actions$, {
          [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
            do: (loadSuccess: LoadResourceReferencesSuccess) => {
              return of(openEditor);
            },
          },
          [IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure]: {
            do: (loadFailure: LoadResourceReferencesFailure) => {
              return of(new OpenEditorFailure({ id: action.payload.id }));
            },
          },
        });
      } else {
        return of(openEditor);
      }

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
          display,
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
      (action: A, segment: any, display: IDisplayElement) => {
        return of(new OpenEditor({
          id: action.payload.id,
          display,
          editor: action.payload.editor,
          initial: {
            changes: {},
            resource: segment,
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
    documentInfo: MemoizedSelector<object, IDocumentRef>,
    service: (documentId: IDocumentRef, documentType: Type, elementType: Type, elementId: string) => Observable<T>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      (action: A) => {
        return this.store.select(documentInfo).pipe(
          concatMap((info: IDocumentRef) => {
            return service(info, info.type, elementType, action.payload.id);
          }),
        );
      },
      notFoundMessage,
      (action: A, resource: IUsages[], display: IDisplayElement) => {
        return of(new OpenEditor({
          id: action.payload.id,
          display,
          editor: action.payload.editor,
          initial: resource,
        }));
      },
    );
  }

  openSlicingEditor<T extends IResource, A extends OpenEditorBase>(
    _action: string,
    type: Type,
    displayElement$: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>,
    resource$: Observable<T>,
    getter: (id, type) => Observable<any>,
    notFoundMessage: string,
  ): Observable<Action> {
    return this.openEditor<T, A>(
      _action,
      displayElement$,
      () => resource$,
      notFoundMessage,
      (action: A, resource: T, display: IDisplayElement) => {
        return getter(action.payload.id, type).pipe(
          flatMap((slicing) => {
            const openEditor = new OpenEditor({
              id: action.payload.id,
              display,
              editor: action.payload.editor,
              initial: {
                changes: {},
                slicing,
              },
            });
            this.store.dispatch(new LoadResourceReferences({ resourceType: type, id: action.payload.id }));
            return RxjsStoreHelperService.listenAndReact(this.actions$, {
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess]: {
                do: (loadSuccess: LoadResourceReferencesSuccess) => {
                  return of(openEditor);
                },
              },
              [IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure]: {
                do: (loadFailure: LoadResourceReferencesFailure) => {
                  return of(new OpenEditorFailure({ id: action.payload.id }));
                },
              },
            });
          }),
        );
      },
    );
  }
}
