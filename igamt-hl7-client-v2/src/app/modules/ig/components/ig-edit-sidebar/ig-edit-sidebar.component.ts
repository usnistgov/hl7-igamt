import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { combineLatest, Observable, of } from 'rxjs';
import { concatMap, filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import {
  IgEditActionTypes,
  ImportResourceFromFile,
  ImportResourceFromFileSuccess, selectViewOnly,
} from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import {
  CopyResource, CopyResourceSuccess,
  DeleteResource,
  IgEditTocAddResource, selectDerived,
  UpdateSections,
} from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { selectIgId } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { ToggleDelta } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as config from '../../../../root-store/config/config.reducer';
import { CollapseTOC, CreateCoConstraintGroup, CreateCoConstraintGroupSuccess } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import * as fromIgEdit from '../../../../root-store/ig/ig-edit/ig-edit.index';
import { selectAllSegments } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { ClearResource, LoadResource } from '../../../../root-store/resource-loader/resource-loader.actions';
import * as fromResource from '../../../../root-store/resource-loader/resource-loader.reducer';
import { AddCoConstraintGroupComponent } from '../../../shared/components/add-co-constraint-group/add-co-constraint-group.component';
import { AddResourceComponent } from '../../../shared/components/add-resource/add-resource.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CopyResourceComponent } from '../../../shared/components/copy-resource/copy-resource.component';
import { ImportCsvValuesetComponent } from '../../../shared/components/import-csv-valueset/import-csv-valueset.component';
import { ResourcePickerComponent } from '../../../shared/components/resource-picker/resource-picker.component';
import { UsageDialogComponent } from '../../../shared/components/usage-dialog/usage-dialog.component';
import { Scope } from '../../../shared/constants/scope.enum';
import { Type } from '../../../shared/constants/type.enum';
import { ICopyResourceData } from '../../../shared/models/copy-resource-data';
import { IUsages } from '../../../shared/models/cross-reference';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IResourcePickerData } from '../../../shared/models/resource-picker-data.interface';
import { CrossReferencesService } from '../../../shared/services/cross-references.service';
import { RxjsStoreHelperService } from '../../../shared/services/rxjs-store-helper.service';
import { IAddNewWrapper, IAddWrapper } from '../../models/ig/add-wrapper.class';
import { IGDisplayInfo } from '../../models/ig/ig-document.class';
import { IgTocComponent } from '../ig-toc/ig-toc.component';

@Component({
  selector: 'app-ig-edit-sidebar',
  templateUrl: './ig-edit-sidebar.component.html',
  styleUrls: ['./ig-edit-sidebar.component.scss'],
})
export class IgEditSidebarComponent implements OnInit {

  nodes$: Observable<any[]>;
  hl7Version$: Observable<string[]>;
  igId$: Observable<string>;
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

  derived: boolean;
  constructor(
    private store: Store<IGDisplayInfo>,
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
    this.igId$ = store.select(fromIgDocumentEdit.selectIgId);
    this.version$ = store.select(fromIgDocumentEdit.selectVersion);
    this.viewOnly$ = this.store.select(selectViewOnly);
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
  collapseToc() {
    this.store.dispatch(new CollapseTOC());
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
          versionChange: (version: string) => {
            this.store.dispatch(new LoadResource({ type: event.type, scope: event.scope, version }));
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
          withLatestFrom(this.igId$),
          take(1),
          map(([result, igId]) => {
            this.store.dispatch(new IgEditTocAddResource({ documentId: igId, selected: result, type: event.type }));
          }),
        ).subscribe();
      }),
    ).subscribe();
    subscription.unsubscribe();
  }

  addVSFromCSV($event) {
    console.log($event);
    const dialogRef = this.dialog.open(ImportCsvValuesetComponent, {
      data: { ...$event, targetScope: Scope.USER, title: 'Add Valueset from CSV file' },
    });

    dialogRef.afterClosed().pipe(
      filter((x) => x !== undefined),
      withLatestFrom(this.igId$),
      take(1),
      map(([result, igId]) => {
        console.log([result]);
        console.log([igId]);
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

        this.store.dispatch(new ImportResourceFromFile(igId, Type.VALUESET, Type.IGDOCUMENT, result.file));
      }),
    ).subscribe();
  }
  copy($event: ICopyResourceData) {
    const dialogRef = this.dialog.open(CopyResourceComponent, {
      data: { ...$event, targetScope: Scope.USER, title: this.getCopyTitle($event.element.type) },
    });
    dialogRef.afterClosed().pipe(
      filter((x) => x !== undefined),
      withLatestFrom(this.igId$),
      map(([result, igId]) => {
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
       this.store.dispatch(new CopyResource({ documentId: igId, selected: result.flavor }));
      }),
    ).subscribe();
  }
  delete($event: IDisplayElement) {
    this.igId$.pipe(
      take(1),
      concatMap((id: string) => {
        return this.crossReferencesService.findUsagesDisplay(id, Type.IGDOCUMENT, $event.type, $event.id).pipe(
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
                    this.store.dispatch(new DeleteResource({ documentId: id, element: $event }));
                  }
                },
              );
            } else {
              const dialogRef = this.dialog.open(UsageDialogComponent, {
                data: {
                  title: 'Cross References found',
                  usages,
                  documentId: id,
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
    }
  }

  addCoConstraintGroup($event: IAddNewWrapper) {
    combineLatest(this.igId$, this.store.select(selectAllSegments)).pipe(
      take(1),
      tap(([igId, segments]) => {
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
              this.store.dispatch(new CreateCoConstraintGroup({ documentId: igId, ...result }));
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
      withLatestFrom(this.igId$),
      take(1),
      map(([result, igId]) => {
        this.store.dispatch(new IgEditTocAddResource({ documentId: igId, selected: [result], type: $event.type }));
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
}
