import { OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take, tap, filter } from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { EditorVerificationResult, EditorVerify } from 'src/app/modules/dam-framework/store/index';
import { IValueSetBindingDisplay } from 'src/app/modules/shared/components/binding-selector/binding-selector.component';
import { IFlatResourceBindings } from 'src/app/modules/shared/models/binding.interface';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import { getHl7ConfigState, selectBindingConfig } from '../../../../root-store/config/config.reducer';
import { selectDerived, selectValueSetsNodes } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { IVerificationEnty } from '../../../dam-framework/models/data/workspace';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { IStructureChanges } from '../../../segment/components/segment-structure-editor/segment-structure-editor.component';
import { ISingleCodeDisplay } from '../../../shared/components/binding-selector/binding-selector.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IBindingContainer, InternalSingleCode, IValuesetBinding } from '../../../shared/models/binding.interface';
import { Hl7Config, IValueSetBindingConfigMap } from '../../../shared/models/config.class';
import { ConstraintType, IAssertionConformanceStatement, IConformanceStatement, IFreeTextConformanceStatement } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../../shared/models/editor.enum';
import { IAssertionPredicate, IFreeTextPredicate, IPredicate } from '../../../shared/models/predicate.interface';
import { IResource } from '../../../shared/models/resource.interface';
import { ChangeType, IChange, PropertyType } from '../../../shared/models/save-change';
import { IVerificationIssue } from '../../../shared/models/verification.interface';
import { BindingService } from '../../../shared/services/binding.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export enum BindingsTabs {
  VALUESETS = 'ValueSet Bindings',
  SINGLECODE = 'Single Code Bindings',
  PREDICATE = 'Predicates',
}

export abstract class BindingsEditorComponent extends AbstractEditorComponent implements OnDestroy, OnInit {

  BindingsTabs = BindingsTabs;
  activeTab = BindingsTabs.VALUESETS;
  tabs = Object.values(BindingsTabs);
  type = Type;
  bindingsSubject: ReplaySubject<IFlatResourceBindings>;
  public datatypes: Observable<IDisplayElement[]>;
  public segments: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;
  public bindingConfig: Observable<IValueSetBindingConfigMap>;
  public config: Observable<Hl7Config>;
  changes: ReplaySubject<IStructureChanges>;
  username: Observable<string>;
  workspace_s: Subscription;
  hasOrigin$: Observable<boolean>;
  resourceType: Type;
  derived$: Observable<boolean>;
  entries$: Observable<Record<string, Record<string, IVerificationEnty[]>>>;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    actions$: Actions,
    store: Store<any>,
    private bindingService: BindingService,
    editorMetadata: IHL7EditorMetadata) {
    super(editorMetadata, actions$, store);
    this.resourceType = editorMetadata.resourceType;
    this.hasOrigin$ = this.store.select(fromIgamtSelectedSelectors.selectedResourceHasOrigin);
    this.config = this.store.select(getHl7ConfigState).pipe(
      filter((config) => !!config),
    );
    this.datatypes = this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes);
    this.segments = this.store.select(fromIgamtDisplaySelectors.selectAllSegments);
    this.valueSets = this.store.select(selectValueSetsNodes);
    this.username = this.store.select(fromAuth.selectUsername);
    this.bindingConfig = this.store.select(selectBindingConfig);
    this.bindingConfig.subscribe();
    this.bindingsSubject = new ReplaySubject<IFlatResourceBindings>(1);
    this.changes = new ReplaySubject<IStructureChanges>(1);
    this.derived$ = combineLatest(this.store.select(selectDerived), this.hasOrigin$).pipe(
      map(([derivedIg, elmHadOrigin]) => {
        return derivedIg && elmHadOrigin;
      }),
    );
    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.bindingsSubject.next({ ...current.bindings });
        this.changes.next({ ...current.changes });
      }),
    ).subscribe();
    this.entries$ = this.getGroupedEntries();
  }

  ngOnDestroy(): void {
    this.workspace_s.unsubscribe();
  }

  onDeactivate() {
  }

  getGroupedEntries(): Observable<Record<string, Record<string, IVerificationEnty[]>>> {
    return this.getEditorVerificationEntries().pipe(
      map((entries) => {
        return entries.reduce((acc, entry) => {
          return {
            ...acc,
            [entry.property]: {
              ...(acc[entry.property] || {}),
              [entry.pathId]: [
                ...((acc[entry.property] || {})[entry.pathId] || []),
                entry,
              ],
            },
          };
        }, {} as Record<string, Record<string, IVerificationEnty[]>>);
      }),
    );
  }

  getCsDescription(cs: IConformanceStatement) {
    if (cs.type === ConstraintType.ASSERTION) {
      return (cs as IAssertionConformanceStatement).assertion.description;
    } else {
      return (cs as IFreeTextConformanceStatement).freeText;
    }
  }

  getPredicateDescription(pr: IPredicate) {
    if (pr.type === ConstraintType.ASSERTION) {
      return (pr as IAssertionPredicate).assertion.description;
    } else {
      return (pr as IFreeTextPredicate).freeText;
    }
  }

  getVsBindingDisplay(binding: IValuesetBinding[]): Observable<IValueSetBindingDisplay[]> {
    return this.bindingService.getValueSetBindingDisplay(binding, this.repository);
  }

  getSgBindingDisplay(binding: InternalSingleCode): Observable<ISingleCodeDisplay> {
    return this.bindingService.getSingleCodeBindingDisplay(binding, this.repository);
  }

  markedForDeletion(binding: IBindingContainer<any>, type: PropertyType): Observable<{ flag: boolean }> {
    return this.changes.pipe(
      map((value) => ({ flag: !!value[binding.pathId] && !!value[binding.pathId][type] })),
    );
  }

  restore(binding: IBindingContainer<any>, type: PropertyType) {
    combineLatest(this.changes.asObservable()).pipe(
      take(1),
      map(([changes, resource]) => {
        if (changes[binding.pathId][type]) {
          delete changes[binding.pathId][type];
          this.changes.next(changes);
          this.editorChange({ changes, resource }, true);
        }
      }),
    ).subscribe();
  }

  delete(binding: IBindingContainer<any>, type: PropertyType) {
    this.change({
      location: binding.pathId,
      propertyType: type,
      propertyValue: null,
      oldPropertyValue: binding.value,
      changeType: ChangeType.DELETE,
    });
  }

  change(change: IChange) {
    combineLatest(this.changes.asObservable()).pipe(
      take(1),
      map(([changes, resource]) => {
        changes = this.mergeStructChange(change, changes);
        this.changes.next(changes);
        this.editorChange({ changes, resource }, true);
      }),
    ).subscribe();
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$, this.changes.asObservable()).pipe(
      take(1),
      concatMap(([id, documentRef, changes]) => {
        return this.saveChanges(id, documentRef, this.convert(changes)).pipe(
          mergeMap((message) => {
            return combineLatest(
              this.getBindingsById(id),
              this.getResourceById(id),
            ).pipe(
              flatMap(([bindings, resource]) => {
                this.changes.next({});
                this.bindingsSubject.next(bindings);
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: { changes: {}, bindings }, updateDate: false }), new fromDam.SetValue({ selected: resource })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  abstract verify(id: string, documentInfo: IDocumentRef): Observable<IVerificationIssue[]>;

  onEditorVerify(action: EditorVerify): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$).pipe(
      take(1),
      concatMap(([id, documentRef]) => {
        return this.verify(id, documentRef).pipe(
          flatMap((entries) => {
            return [
              new EditorVerificationResult({
                supported: true,
                entries: entries.map((entry) => ({
                  code: entry.code,
                  message: entry.description,
                  location: entry.locationInfo.name,
                  pathId: entry.locationInfo.pathId,
                  property: entry.locationInfo.property,
                  severity: entry.severity,
                  targetId: entry.target,
                  targetType: entry.targetType,
                }) as IVerificationEnty).filter((entry) => {
                  return [PropertyType.VALUESET, PropertyType.SINGLECODE, PropertyType.PREDICATE].includes(entry.property as PropertyType);
                }),
              }),
            ];
          }),
        );
      }),
    );
  }

  mergeStructChange(change: IChange, changes: IStructureChanges): IStructureChanges {
    const edits = {
      ...changes,
    };
    edits[change.location] = {
      ...edits[change.location],
      [change.propertyType]: change,
    };
    return edits;
  }

  abstract saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message>;
  abstract getBindingsById(id: string): Observable<IFlatResourceBindings>;
  abstract getResourceById(id: string): Observable<IResource>;

  convert(changes: IStructureChanges): IChange[] {
    let c = [];
    Object.keys(changes).forEach((id) => {
      c = c.concat(Object.keys(changes[id]).map((prop) => {
        return changes[id][prop];
      }));
    });
    return c;
  }

  abstract elementSelector(): MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>;

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id });
      }),
    );
  }

  ngOnInit() {
  }
}
