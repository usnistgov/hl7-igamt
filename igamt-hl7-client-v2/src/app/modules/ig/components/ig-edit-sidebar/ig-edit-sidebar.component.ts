import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { concatMap, filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { selectAllMessages } from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';

import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import {
  AddProfileComponentContext,
  CopyResource,
  CopyResourceSuccess,
  CreateCompositeProfile,
  CreateProfileComponent,
  CreateProfileComponentSuccess,
  DeleteProfileComponentContext,
  DeleteResource,
  IgEditActionTypes,
  IgEditTocAddResource,
  ImportResourceFromFile,
  ImportResourceFromFileSuccess,
  selectDerived,
  selectIgId,
  ToggleDelta,
  UpdateSections,
} from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as config from '../../../../root-store/config/config.reducer';
import {
  CreateCoConstraintGroup,
  CreateCoConstraintGroupSuccess,
} from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import * as fromIgEdit from '../../../../root-store/ig/ig-edit/ig-edit.index';
import { ClearResource, LoadResource } from '../../../../root-store/resource-loader/resource-loader.actions';
import * as fromResource from '../../../../root-store/resource-loader/resource-loader.reducer';
import { ConfirmDialogComponent } from '../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { RxjsStoreHelperService } from '../../../dam-framework/services/rxjs-store-helper.service';
import { EditorReset, selectWorkspaceActive } from '../../../dam-framework/store/data';
import { IAddNewWrapper, IAddWrapper } from '../../../document/models/document/add-wrapper.class';
import { AddCoConstraintGroupComponent } from '../../../shared/components/add-co-constraint-group/add-co-constraint-group.component';
import { AddCompositeComponent } from '../../../shared/components/add-composite/add-composite.component';
import { AddProfileComponentContextComponent } from '../../../shared/components/add-profile-component-context/add-profile-component-context.component';
import { AddProfileComponentComponent } from '../../../shared/components/add-profile-component/add-profile-component.component';
import { AddResourceComponent } from '../../../shared/components/add-resource/add-resource.component';
import { CopyResourceComponent } from '../../../shared/components/copy-resource/copy-resource.component';
import { getLabel } from '../../../shared/components/display-section/display-section.component';
import { ImportCsvValuesetComponent } from '../../../shared/components/import-csv-valueset/import-csv-valueset.component';
import { ResourcePickerComponent } from '../../../shared/components/resource-picker/resource-picker.component';
import { UsageDialogComponent } from '../../../shared/components/usage-dialog/usage-dialog.component';
import { Scope } from '../../../shared/constants/scope.enum';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { ICopyResourceData } from '../../../shared/models/copy-resource-data';
import { IUsages } from '../../../shared/models/cross-reference';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IResourcePickerData } from '../../../shared/models/resource-picker-data.interface';
import { CrossReferencesService } from '../../../shared/services/cross-references.service';
import { IDocumentDisplayInfo, IgDocument } from '../../models/ig/ig-document.class';
import { IgTocComponent } from '../ig-toc/ig-toc.component';
import { selectRouterURL } from '../../../dam-framework/store/router/router.selectors';

@Component({
  selector: 'app-ig-edit-sidebar',
  templateUrl: './ig-edit-sidebar.component.html',
  styleUrls: ['./ig-edit-sidebar.component.scss'],
})
export class IgEditSidebarComponent implements OnInit, OnDestroy {

  nodes$: Observable<any[]>;
  hl7Version$: Observable<string[]>;
  documentRef$: Observable<IDocumentRef>;
  version$: Observable<string>;
  delta: boolean;
  viewOnly$: Observable<boolean>;
  @Input()
  deltaMode = false;
  @ViewChild(IgTocComponent) toc: IgTocComponent;
  optionsToDisplay: any;
  deltaOptions: SelectItem[] = [{ label: 'CHANGED', value: 'UPDATED' }, { label: 'DELETED', value: 'DELETED' }, { label: 'ADDED', value: 'ADDED' }];
  selectedValues = ['UPDATED', 'DELETED', 'ADDED', 'UNCHANGED'];
  deltaMode$: Observable<boolean> = of(false);
  selectedTargetId = 'IG';
  derived: boolean;
  selectedSubscription: Subscription;

  constructor(
    private store: Store<IDocumentDisplayInfo<IgDocument>>,
    private dialog: MatDialog,
    private crossReferencesService: CrossReferencesService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private actions: Actions) {
    this.deltaMode$ = this.store.select(fromIgEdit.selectDelta);
    this.deltaMode$.subscribe((x) => this.delta = x);
    this.store.select(selectDerived).pipe(take(1)).subscribe((x) => this.derived = x);
    this.nodes$ = this.getNodes();
    this.hl7Version$ = store.select(config.getHl7Versions);
    this.documentRef$ = store.select(fromIgamtSelectors.selectLoadedDocumentInfo);
    this.version$ = store.select(fromIgDocumentEdit.selectVersion);
    this.viewOnly$ = this.store.select(fromIgamtSelectors.selectViewOnly);
    this.selectedSubscription = this.store.select(selectRouterURL).pipe(
      map((url: string) => {
        const regex = '/ig/[a-z0-9A-Z-]+/(?<type>[a-z]+)/(?<id>[a-z0-9A-Z-]+).*';
        const match = new RegExp(regex, 'g').exec(url);
        if (match) {
          const { groups: { type, id } } = match;
          this.selectedTargetId = 'TOC-' + type.toUpperCase() + '-' + id;
        } else {
          this.selectedTargetId = 'IG';
        }
        console.log(this.selectedTargetId);
      })).subscribe();
  }

  getNodes() {
    return this.deltaMode$.pipe(
      switchMap((x) => {
        if (!x) {
          return this.store.select(fromIgDocumentEdit.selectToc);
        } else {
          return this.store.select(fromIgDocumentEdit.selectProfileTree);
        }
      }),
    );
  }

  ngOnInit() {
  }

  findScroll() {
    if (this.selectedTargetId) {
      this.toc.scrollById(this.selectedTargetId);
    }
  }

  scrollTo(type) {
    this.toc.scroll(type);
  }

  filterFn(value: any) {
    this.toc.filter(value);
  }

  update($event: IDisplayElement[]) {
    this.store.dispatch(new UpdateSections($event));
  }

  addSection() {
    this.toc.addSectionToIG();
  }

  collapseAll() {
    this.toc.collapseAll();
  }

  expandAll() {
    this.toc.expandAll();
  }

  addChildren(event: IAddWrapper) {
    const subscription = this.hl7Version$.pipe(
      withLatestFrom(this.version$),
      take(1),
      map(([versions, selectedVersion]) => {
        this.store.dispatch(new LoadResource({ type: event.type, scope: event.scope, version: selectedVersion }));

        const dialogData: IResourcePickerData = {
          hl7Versions: versions,
          existing: event.node.children,
          title: this.getDialogTitle(event),
          data: this.store.select(fromResource.getData),
          version: selectedVersion,
          scope: event.scope,
          master: false,
          documentType: Type.IGDOCUMENT,
          versionChange: (version: string) => {
            this.store.dispatch(new LoadResource({ type: event.type, scope: event.scope, version }));
          },
          versionAndScopeChange: (version: string, scope: Scope) => {
            this.store.dispatch(new LoadResource({ type: event.type, scope, version }));
          },
          type: event.type,
        };
        const dialogRef = this.dialog.open(ResourcePickerComponent, {
          data: dialogData,
        });
        dialogRef.afterClosed().pipe(
          map((result) => {
            this.store.dispatch(new ClearResource());
            return result;
          }),
          filter((x) => x !== undefined),
          withLatestFrom(this.documentRef$),
          take(1),
          map(([result, documentRef]) => {
            this.store.dispatch(new IgEditTocAddResource({ documentId: documentRef.documentId, selected: result, type: event.type }));
          }),
        ).subscribe();
      }),
    ).subscribe();
    subscription.unsubscribe();
  }

  addVSFromCSV($event) {
    const dialogRef = this.dialog.open(ImportCsvValuesetComponent, {
      data: { ...$event, targetScope: Scope.USER, title: 'Add Valueset from CSV file' },
    });

    dialogRef.afterClosed().pipe(
      filter((x) => x !== undefined),
      withLatestFrom(this.documentRef$),
      take(1),
      map(([result, documentRef]) => {
        if (result && result.redirect) {
          RxjsStoreHelperService.listenAndReact(this.actions, {
            [IgEditActionTypes.ImportResourceFromFileSuccess]: {
              do: (action: ImportResourceFromFileSuccess) => {
                this.router.navigate(['./' + action.payload.display.type.toLowerCase() + '/' + action.payload.display.id], { relativeTo: this.activeRoute });
                return of();
              },
            },
          }).subscribe();
        }

        this.store.dispatch(new ImportResourceFromFile(documentRef.documentId, Type.VALUESET, Type.IGDOCUMENT, result.file));
      }),
    ).subscribe();
  }
  copy($event: ICopyResourceData) {
    const dialogRef = this.dialog.open(CopyResourceComponent, {
      data: { ...$event, targetScope: Scope.USER, title: this.getCopyTitle($event.element.type) },
    });
    dialogRef.afterClosed().pipe(
      filter((x) => x !== undefined),
      withLatestFrom(this.documentRef$),
      map(([result, documentRef]) => {
        if (result && result.redirect) {
          RxjsStoreHelperService.listenAndReact(this.actions, {
            [IgEditActionTypes.CopyResourceSuccess]: {
              do: (action: CopyResourceSuccess) => {
                this.router.navigate(['./' + action.payload.display.type.toLowerCase() + '/' + action.payload.display.id], { relativeTo: this.activeRoute });
                return of();
              },
            },
          }).subscribe();
        }
        this.store.dispatch(new CopyResource({ documentId: documentRef.documentId, selected: result.flavor }));
      }),
    ).subscribe();
  }
  delete($event: IDisplayElement) {
    this.documentRef$.pipe(
      take(1),
      concatMap((documentRef: IDocumentRef) => {
        return this.crossReferencesService.findUsagesDisplay(documentRef, Type.IGDOCUMENT, $event.type, $event.id).pipe(
          take(1),
          map((usages: IUsages[]) => {
            if (usages.length === 0) {
              const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                  question: 'Are you sure you want to delete this ' + this.getStringFromType($event.type) + '?',
                  action: 'Delete ' + this.getStringFromType($event.type),
                },
              });
              dialogRef.afterClosed().subscribe(
                (answer) => {
                  if (answer) {
                    this.store.dispatch(new DeleteResource({ documentId: documentRef.documentId, element: $event }));
                  }
                },
              );
            } else {
              const dialogRef = this.dialog.open(UsageDialogComponent, {
                data: {
                  title: 'Cross References found',
                  usages,
                  element: $event,
                  documentId: documentRef.documentId,
                },
              });
              this.router.events
                .subscribe((h) => {
                  dialogRef.close();
                });
              dialogRef.afterClosed().subscribe(
              );
            }
          }),
        );
      }),
    ).subscribe();
  }
  private getDialogTitle(event: IAddWrapper) {
    return 'Add ' + this.getStringFormScope(event.scope) + ' ' + this.getStringFromType(event.type);
  }

  private getStringFormScope(scope: Scope) {
    switch (scope) {
      case Scope.HL7STANDARD:
        return 'HL7 Standard';
      case Scope.USER:
        return 'USER';
      case Scope.SDTF:
        return 'Standard Data Type Flavor';
      default:
        return '';
    }
  }

  private getStringFromType(type: Type) {
    switch (type) {
      case Type.DATATYPE:
        return 'Data type';
      case Type.SEGMENT:
        return 'Segment';
      case Type.CONFORMANCEPROFILE:
        return 'Conformance Profiles';
      case Type.VALUESET:
        return 'Value Sets';
      case Type.PROFILECOMPONENT:
        return 'Profile Component';
      case Type.COMPOSITEPROFILE:
        return 'Composite Profile';
      default:
        return '';
    }
  }
  private getCopyTitle(type: Type) {
    return 'Copy ' + this.getStringFromType(type);
  }

  private getNewTitle(type: Type) {
    return 'Add new ' + this.getStringFromType(type);
  }

  addChild($event: IAddNewWrapper) {
    switch ($event.type) {
      case Type.VALUESET:
        this.addValueSet($event);
        break;
      case Type.COCONSTRAINTGROUP:
        this.addCoConstraintGroup($event);
        break;
      case Type.PROFILECOMPONENT:
        this.addProfileComponent($event);
        break;
      case Type.COMPOSITEPROFILE:
        this.addCompositeProfile($event);
        break;
    }
  }

  addProfileComponent(event: IAddNewWrapper) {
    combineLatest(this.documentRef$, this.store.select(fromIgamtDisplaySelectors.selectAllSegments), this.store.select(selectAllMessages)).pipe(
      take(1),
      tap(([{ documentId, type }, segments, messages]) => {
        const dialogRef = this.dialog.open(AddProfileComponentComponent, {
          data: {
            children: segments.concat(messages),
          },
        });
        dialogRef.afterClosed().pipe(
          filter((x) => x !== undefined),
          take(1),
          map((result) => {
            if (result) {
              RxjsStoreHelperService.listenAndReact(this.actions, {
                [IgEditActionTypes.CreateProfileComponentSuccess]: {
                  do: (action: CreateProfileComponentSuccess) => {
                    this.router.navigate(['./' + action.payload.display.type.toLowerCase() + '/' + action.payload.display.id], { relativeTo: this.activeRoute });
                    return of();
                  },
                },
              }).subscribe();
              this.store.dispatch(new CreateProfileComponent({ documentId, ...result }));
            }
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  addCompositeProfile(event: IAddNewWrapper) {
    combineLatest(this.documentRef$, this.store.select(fromIgamtDisplaySelectors.selectAllProfileComponents), this.store.select(fromIgamtDisplaySelectors.selectAllCompositeProfiles), this.store.select(selectAllMessages)).pipe(
      take(1),
      tap(([{ documentId, type }, profileComponents, compositeProfiles, messages]) => {
        const dialogRef = this.dialog.open(AddCompositeComponent, {
          data: {
            messages,
            profileComponents,
            compositeProfiles,
          },
        });
        dialogRef.afterClosed().pipe(
          filter((x) => x !== undefined),
          take(1),
          map((result) => {
            if (result) {
              RxjsStoreHelperService.listenAndReact(this.actions, {
                [IgEditActionTypes.CreateProfileComponentSuccess]: {
                  do: (action: CreateProfileComponentSuccess) => {
                    this.router.navigate(['./' + action.payload.display.type.toLowerCase() + '/' + action.payload.display.id], { relativeTo: this.activeRoute });
                    return of();
                  },
                },
              }).subscribe();
              this.store.dispatch(new CreateCompositeProfile({ documentId, ...result }));
            }
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  addCoConstraintGroup($event: IAddNewWrapper) {
    combineLatest(this.documentRef$, this.store.select(fromIgamtDisplaySelectors.selectAllSegments)).pipe(
      take(1),
      tap(([{ documentId, type }, segments]) => {
        const dialogRef = this.dialog.open(AddCoConstraintGroupComponent, {
          data: {
            segments: segments.filter((f) => {
              return f.domainInfo.scope === Scope.USER;
            }),
            baseSegment: undefined,
          },
        });
        dialogRef.afterClosed().pipe(
          filter((x) => x !== undefined),
          take(1),
          map((result) => {
            if (result) {
              RxjsStoreHelperService.listenAndReact(this.actions, {
                [IgEditActionTypes.CreateCoConstraintGroupSuccess]: {
                  do: (action: CreateCoConstraintGroupSuccess) => {
                    this.router.navigate(['./' + action.payload.display.type.toLowerCase() + '/' + action.payload.display.id], { relativeTo: this.activeRoute });
                    return of();
                  },
                },
              }).subscribe();
              this.store.dispatch(new CreateCoConstraintGroup({ documentId, ...result }));
            }
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  addValueSet($event: IAddNewWrapper) {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      data: { existing: $event.node.children, scope: Scope.USER, title: this.getNewTitle($event.type), type: $event.type },
    });
    dialogRef.afterClosed().pipe(
      filter((x) => x !== undefined),
      withLatestFrom(this.documentRef$),
      take(1),
      map(([result, documentRef]) => {
        this.store.dispatch(new IgEditTocAddResource({ documentId: documentRef.documentId, selected: [result], type: $event.type }));
      }),
    ).subscribe();
  }

  toggleDelta() {
    this.toc.filter('');
    this.store.select(selectIgId).pipe(
      take(1),
      withLatestFrom(this.deltaMode$),
      map(([id, delta]) => {
        this.store.dispatch(new ToggleDelta(id, !delta));
      }),
    ).subscribe();
  }

  filterByDelta($event: string[]) {
    if (this.delta) {
      this.toc.filterByDelta($event);
    }
  }

  checkDeleteNarrative($event: string) {
    this.store.select(selectWorkspaceActive).pipe(
      take(1),
      map((x) => {
        if (x.display && x.display.id && x.display.id === $event) {
          this.store.dispatch(new EditorReset());
          this.router.navigate(['./' + 'metadata'], { relativeTo: this.activeRoute });
        }
      }),
    ).subscribe();
  }

  onAddPcChildren($event: IDisplayElement) {
    combineLatest(this.documentRef$, this.store.select(fromIgamtDisplaySelectors.selectAllSegments), this.store.select(selectAllMessages)).pipe(
      take(1),
      tap(([{ documentId, type }, segments, messages]) => {
        const dialogRef = this.dialog.open(AddProfileComponentContextComponent, {
          data: {
            available: segments.concat(messages),
            pc: $event,
          },
        });
        dialogRef.afterClosed().pipe(
          filter((x) => x !== undefined),
          take(1),
          map((result) => {
            if (result) {
              console.log(result);
              this.store.dispatch(new AddProfileComponentContext({ documentId, pcId: $event.id, added: result }));
            }
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  deleteOneChild($event: { child: IDisplayElement; parent: IDisplayElement }) {
    this.documentRef$.pipe(
      take(1),
      tap((documentRef) => {

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            question: 'Are you sure you want to remove ' + getLabel($event.child.fixedName, $event.child.variableName) + ' from ' + getLabel($event.parent.fixedName, $event.parent.variableName) + ' ?',
            action: 'Delete Profile Component Context',
          },
        });
        dialogRef.afterClosed().subscribe(
          (answer) => {
            if (answer) {
              this.store.dispatch(new DeleteProfileComponentContext({
                documentId: documentRef.documentId,
                element: $event.child,
                parent: $event.parent,
              }));
            }
          },
        );
      })).subscribe();
  }

  ngOnDestroy(): void {
    if (this.selectedSubscription) {
      this.selectedSubscription.unsubscribe();
    }
  }

}
