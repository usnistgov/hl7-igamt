import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { combineLatest, Observable, of } from 'rxjs';
import { concatMap, filter, map, take, withLatestFrom } from 'rxjs/operators';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import * as fromLibraryEdit from 'src/app/root-store/library/library-edit/library-edit.index';
import {
  CopyResource,
  CopyResourceSuccess,
  DeactivateElements,
  DeleteResource,
  LibraryEditActionTypes,
  LibraryEditTocAddResource,
  selectLibraryId,
  selectViewOnly,
  ToggleDelta,
  UpdateSections,
} from 'src/app/root-store/library/library-edit/library-edit.index';
import * as config from '../../../../root-store/config/config.reducer';
import { ClearResource, LoadResource } from '../../../../root-store/resource-loader/resource-loader.actions';
import * as fromResource from '../../../../root-store/resource-loader/resource-loader.reducer';
import { ConfirmDialogComponent } from '../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { RxjsStoreHelperService } from '../../../dam-framework/services/rxjs-store-helper.service';
import { selectIsAdmin } from '../../../dam-framework/store/authentication';
import { EditorReset, selectWorkspaceActive } from '../../../dam-framework/store/data';
import { IAddWrapper } from '../../../document/models/document/add-wrapper.class';
import { IDocumentDisplayInfo } from '../../../ig/models/ig/ig-document.class';
import { CopyResourceComponent } from '../../../shared/components/copy-resource/copy-resource.component';
import { ResourcePickerComponent } from '../../../shared/components/resource-picker/resource-picker.component';
import { UsageDialogComponent } from '../../../shared/components/usage-dialog/usage-dialog.component';
import { Scope } from '../../../shared/constants/scope.enum';
import { Type } from '../../../shared/constants/type.enum';
import { ActiveStatus, IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { ICopyResourceData } from '../../../shared/models/copy-resource-data';
import { IUsages } from '../../../shared/models/cross-reference';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IResourcePickerData } from '../../../shared/models/resource-picker-data.interface';
import { CrossReferencesService } from '../../../shared/services/cross-references.service';
import { ILibrary } from '../../models/library.class';
import { LibraryTocComponent } from '../library-toc/library-toc.component';

@Component({
  selector: 'app-library-edit-sidebar',
  templateUrl: './library-edit-sidebar.component.html',
  styleUrls: ['./library-edit-sidebar.component.scss'],
})
export class LibraryEditSidebarComponent implements OnInit {

  nodes$: Observable<any[]>;
  hl7Version$: Observable<string[]>;
  documentRef$: Observable<IDocumentRef>;
  version$: Observable<string>;
  delta: boolean;
  viewOnly$: Observable<boolean>;
  @Input()
  deltaMode = false;
  master$: Observable<boolean>;
  @ViewChild(LibraryTocComponent) toc: LibraryTocComponent;
  optionsToDisplay: any;
  deltaOptions: SelectItem[] = [{ label: 'CHANGED', value: 'UPDATED' }, { label: 'DELETED', value: 'DELETED' }, { label: 'ADDED', value: 'ADDED' }];
  selectedValues = ['UPDATED', 'DELETED', 'ADDED', 'UNCHANGED'];
  deltaMode$: Observable<boolean> = of(false);

  derived: boolean;
  constructor(
    private store: Store<IDocumentDisplayInfo<ILibrary>>,
    private dialog: MatDialog,
    private crossReferencesService: CrossReferencesService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private actions: Actions) {
    this.deltaMode$.subscribe((x) => this.delta = x);
    this.nodes$ = this.getNodes();
    this.hl7Version$ = store.select(config.getHl7Versions);
    this.documentRef$ = store.select(fromIgamtSelectors.selectLoadedDocumentInfo);
    this.version$ = store.select(fromLibraryEdit.selectVersion);
    this.viewOnly$ = this.store.select(selectViewOnly);
    this.master$ = this.store.select(selectIsAdmin);
  }

  getNodes() {
    return this.store.select(fromLibraryEdit.selectToc);
  }

  ngOnInit() {
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
    const subscription = combineLatest(this.hl7Version$, this.version$, this.master$).pipe(
      take(1),
      map(([versions, selectedVersion, ms]) => {
        this.store.dispatch(new LoadResource({ type: event.type, scope: event.scope, version: selectedVersion, compatibility: true }));

        const dialogData: IResourcePickerData = {
          hl7Versions: versions,
          existing: event.node.children,
          title: this.getDialogTitle(event),
          data: this.store.select(fromResource.getData),
          version: selectedVersion,
          scope: event.scope,
          documentType: Type.DATATYPELIBRARY,
          master: ms,
          hideAsIs: event.hideAsIs,
          hideFlavor: event.hideFlavor,
          compatibility: true,
          versionChange: (version: string) => {
            this.store.dispatch(new LoadResource({ type: event.type, scope: event.scope, version, compatibility: true }));
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
            this.store.dispatch(new LibraryEditTocAddResource({ documentId: documentRef.documentId, selected: result, type: event.type }));
          }),
        ).subscribe();
      }),
    ).subscribe();
    subscription.unsubscribe();
  }
  copy($event: ICopyResourceData) {

    const subscription = combineLatest(this.documentRef$, this.master$).pipe(
      take(1),
      map(([documentRef, master]) => {
        const dialogRef = this.dialog.open(CopyResourceComponent, {
          data: { ...$event, targetScope: Scope.USER, title: this.getCopyTitle($event.element.type), documentType: documentRef.type, master },
        });
        dialogRef.afterClosed().pipe(
          filter((x) => x !== undefined),
          map((result) => {
            if (result && result.redirect) {
              RxjsStoreHelperService.listenAndReact(this.actions, {
                [LibraryEditActionTypes.CopyResourceSuccess]: {
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
      }),
    ).subscribe();
    subscription.unsubscribe();
  }
  delete($event: IDisplayElement) {
    this.documentRef$.pipe(
      take(1),
      concatMap((documentRef: IDocumentRef) => {
        return this.crossReferencesService.findUsagesDisplay(documentRef, Type.DATATYPELIBRARY, $event.type, $event.id).pipe(
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
    return 'Add ' + this.getStringFromType(event.type);
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
        return 'Code Sets';
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
  toggleDelta() {
    this.toc.filter('');
    this.store.select(selectLibraryId).pipe(
      take(1),
      withLatestFrom(this.deltaMode$),
      map(([id, delta]) => {
        this.store.dispatch(new ToggleDelta(id, !delta));
      }),
    ).subscribe();
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

  filterByDelta($event: string[]) {
    if (this.delta) {
      this.toc.filterByDelta($event);
    }
  }

  deactivate($event: IDisplayElement) {
    this.documentRef$.pipe(
      take(1),
      concatMap((documentRef: IDocumentRef) => {
        return this.crossReferencesService.findUsagesDisplay(documentRef, Type.DATATYPELIBRARY, $event.type, $event.id).pipe(
          take(1),
          map((usages: IUsages[]) => {
            usages = usages.filter((x) => x.element.activeInfo && x.element.activeInfo.status === ActiveStatus.ACTIVE);
            if (usages.length === 0) {
              const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                  question: 'Are you sure you want to Deactivate this ' + this.getStringFromType($event.type) + '?',
                  action: 'Deactivate ' + this.getStringFromType($event.type),
                },
              });
              dialogRef.afterClosed().subscribe(
                (answer) => {
                  if (answer) {
                    this.store.dispatch(new DeactivateElements(documentRef.documentId, [$event.id]));
                  }
                },
              );
            } else {
              const dialogRef = this.dialog.open(UsageDialogComponent, {
                data: {
                  title: 'Cross References found',
                  usages,
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

}
