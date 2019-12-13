import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, Observable, ReplaySubject, Subject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take, tap } from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { EditorSave, EditorUpdate, LoadResourceReferences, LoadSelectedResource } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectAllDatatypes, selectAllSegments, selectIgId, selectMessagesById, selectValueSetsNodes } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { CoConstraintBindingDialogComponent, IBindingDialogResult } from '../../../co-constraints/components/co-constraint-binding-dialog/co-constraint-binding-dialog.component';
import { CoConstraintEntityService } from '../../../co-constraints/services/co-constraint-entity.service';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../core/services/message.service';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { ICoConstraintBindingContext, ICoConstraintBindingSegment } from '../../../shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ChangeType, PropertyType } from '../../../shared/models/save-change';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { ConformanceProfileService } from '../../services/conformance-profile.service';

export interface IExpansionPanelView {
  [key: string]: boolean;
}

export enum ChangeLevel {
  CONTEXT,
  SEGMENT,
}

export interface IChange {
  type: ChangeType;
  level: ChangeLevel;
  contextId?: string;
  context?: ICoConstraintBindingContext;
  segment?: ICoConstraintBindingSegment;
}

@Component({
  selector: 'app-co-constraints-binding-editor',
  templateUrl: './co-constraints-binding-editor.component.html',
  styleUrls: ['./co-constraints-binding-editor.component.scss'],
})
export class CoConstraintsBindingEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  conformanceProfile$: Observable<IConformanceProfile>;
  conformanceProfile: ReplaySubject<IConformanceProfile>;

  bindings$: Observable<ICoConstraintBindingContext[]>;
  bindings: ReplaySubject<ICoConstraintBindingContext[]>;

  bindingsSync$: Observable<ICoConstraintBindingContext[]>;
  bindingsSync: ReplaySubject<ICoConstraintBindingContext[]>;

  changes: Subject<IChange>;

  public structure: IHL7v2TreeNode[];
  public segments: Observable<IDisplayElement[]>;
  public datatypes: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;
  public igId: Observable<string>;

  ccTableBinding: ICoConstraintBindingContext[];
  expansionPanelView: IExpansionPanelView;
  s_workspace: Subscription;
  s_changes: Subscription;
  s_tree: Subscription;

  constructor(
    protected actions$: Actions,
    private dialog: MatDialog,
    protected store: Store<any>,
    public repository: StoreResourceRepositoryService,
    private conformanceProfileService: ConformanceProfileService,
    private messageService: MessageService,
    private treeService: Hl7V2TreeService,
    protected ccService: CoConstraintEntityService) {
    super({
      id: EditorID.CP_CC_BINDING,
      title: 'Co-Constraints Binding',
      resourceType: Type.CONFORMANCEPROFILE,
    },
      actions$,
      store,
    );

    this.expansionPanelView = {};
    this.datatypes = this.store.select(selectAllDatatypes);
    this.segments = this.store.select(selectAllSegments);
    this.valueSets = this.store.select(selectValueSetsNodes);
    this.igId = this.store.select(selectIgId);

    this.conformanceProfile = new ReplaySubject<IConformanceProfile>(1);
    this.conformanceProfile$ = this.conformanceProfile.asObservable();

    this.bindings = new ReplaySubject<ICoConstraintBindingContext[]>(1);
    this.bindings$ = this.bindings.asObservable();

    this.bindingsSync = new ReplaySubject<ICoConstraintBindingContext[]>(1);
    this.bindingsSync$ = this.bindingsSync.asObservable();

    this.changes = new Subject<IChange>();
    this.s_changes = this.changes.pipe(
      concatMap((change) => {
        switch (change.level) {
          case ChangeLevel.CONTEXT:
            return this.changeContext(change.type, change.context);
          case ChangeLevel.SEGMENT:
            return this.changeSegment(change.contextId, change.type, change.segment);
        }
      }),
    ).subscribe();

    this.s_workspace = this.currentSynchronized$.pipe(
      tap((data) => {

        // -- Set CP
        this.conformanceProfile.next(data.resource);

        // -- Set Tree
        this.s_tree = this.treeService.getTree(data.resource, this.repository, true, true, (value) => {
          this.structure = [
            {
              data: {
                id: data.resource.id,
                pathId: data.resource.id,
                name: data.resource.name,
                type: data.resource.type,
                position: 0,
              },
              expanded: true,
              children: [...value],
              parent: undefined,
            },
          ];
        });

        if (data.value && data.value.length > 0) {
          this.openPanel(data.value[0].context.pathId);
        }

        // -- Set bindings value
        this.bindings.next(data.value || []);
        this.bindingsSync.next(_.cloneDeep(data.value) || []);
      }),
    ).subscribe();
  }

  openPanel(id: string) {
    for (const key of Object.keys(this.expansionPanelView)) {
      this.expansionPanelView[key] = false;
    }
    this.expansionPanelView[id] = true;
  }

  togglePanel(id: string) {
    if (this.expansionPanelView[id]) {
      this.expansionPanelView[id] = false;
    } else {
      this.openPanel(id);
    }
  }

  deleteSegmentBinding(segments: ICoConstraintBindingSegment[], segment: ICoConstraintBindingSegment, contextId: string, i: number) {
    segments.splice(i, 1);
    this.registerChange({
      type: ChangeType.DELETE,
      level: ChangeLevel.SEGMENT,
      contextId,
      segment,
    });
  }

  deleteContextBinding(contexts: ICoConstraintBindingContext[], context: ICoConstraintBindingContext, contextId: string, i: number) {
    contexts.splice(i, 1);
    this.registerChange({
      type: ChangeType.DELETE,
      level: ChangeLevel.CONTEXT,
      contextId,
      context,
    });
  }

  openBindingCreateDialog(contexts: ICoConstraintBindingContext[]) {
    const ref = this.dialog.open(CoConstraintBindingDialogComponent, {
      data: {
        structure: this.structure,
        repository: this.repository,
      },
    });

    ref.afterClosed().subscribe(
      (result: IBindingDialogResult) => {
        if (result) {

          const contextNode = {
            context: {
              pathId: result.context.node.data.pathId,
              path: result.context.path,
              name: result.context.name,
            },
            bindings: [],
          };

          const segmentNode = {
            segment: {
              pathId: result.segment.node.data.pathId,
              path: result.segment.path,
              name: result.segment.name,
            },
            name: '',
            flavorId: result.segment.flavorId,
            tables: [],
          };

          const context = contexts.find((b) => b.context.pathId === result.context.node.data.pathId);
          if (context) {
            const segment = context.bindings.find((b) => b.segment.pathId === result.segment.node.data.pathId);
            if (!segment) {
              context.bindings.push(segmentNode);

              this.registerChange({
                type: ChangeType.ADD,
                level: ChangeLevel.SEGMENT,
                contextId: result.context.node.data.pathId,
                segment: segmentNode,
              });

              this.openPanel(contextNode.context.pathId);
            }
          } else {

            contexts.push({
              ...contextNode,
              bindings: [
                segmentNode,
              ],
            });

            this.openPanel(contextNode.context.pathId);

            this.registerChange({
              type: ChangeType.ADD,
              level: ChangeLevel.CONTEXT,
              context: contextNode,
            });

            this.registerChange({
              type: ChangeType.ADD,
              level: ChangeLevel.SEGMENT,
              contextId: result.context.node.data.pathId,
              segment: segmentNode,
            });
          }
        }
      });
  }

  segmentBindingChange(contextId: string, value: ICoConstraintBindingSegment) {
    this.registerChange({
      type: ChangeType.UPDATE,
      level: ChangeLevel.SEGMENT,
      contextId,
      segment: value,
    });
  }

  registerChange(change: IChange) {
    this.changes.next(change);
  }

  changeContext(changeType: ChangeType, value: ICoConstraintBindingContext): Observable<ICoConstraintBindingContext[]> {
    const closure = (list: ICoConstraintBindingContext[]): ICoConstraintBindingContext[] => {
      switch (changeType) {
        case ChangeType.ADD:
          return this.addContext(list, value);
        case ChangeType.DELETE:
          return this.deleteContext(value.context.pathId, list);
      }
    };

    return this.change(closure);
  }

  changeSegment(contextId: string, changeType: ChangeType, value: ICoConstraintBindingSegment): Observable<ICoConstraintBindingContext[]> {
    const closure = (list: ICoConstraintBindingContext[]): ICoConstraintBindingContext[] => {
      switch (changeType) {
        case ChangeType.ADD:
          return this.addSegment(contextId, list, value);
        case ChangeType.DELETE:
          return this.deleteSegment(contextId, value.segment.pathId, list, value);
        case ChangeType.UPDATE:
          return this.updateSegment(contextId, value.segment.pathId, value, list);
      }
    };

    return this.change(closure);
  }

  change(closure: (list: ICoConstraintBindingContext[]) => ICoConstraintBindingContext[]): Observable<ICoConstraintBindingContext[]> {
    return combineLatest(
      this.bindings$,
      this.conformanceProfile$).pipe(
        take(1),
        map(([current, cp]) => {
          const transformed = closure(current);
          this.editorChange({
            value: transformed,
            resource: cp,
          }, true);
          this.bindings.next(transformed);
          return transformed;
        }),
      );
  }

  updateSegment(contextId: string, segmentId: string, value: ICoConstraintBindingSegment, bindings: ICoConstraintBindingContext[]) {
    const context = bindings.find((elm) => elm.context.pathId === contextId);
    return this.replaceContext(
      contextId,
      bindings,
      {
        ...context,
        bindings: this.replaceSegment(
          segmentId,
          context.bindings,
          value,
        ),
      },
    );
  }

  replaceContext(contextId: string, bindings: ICoConstraintBindingContext[], value: ICoConstraintBindingContext): ICoConstraintBindingContext[] {
    return [
      ...bindings.filter((elm) => elm.context.pathId !== contextId),
      ...[value].filter((elm) => !!elm),
    ];
  }

  replaceSegment(segmentId: string, bindings: ICoConstraintBindingSegment[], value: ICoConstraintBindingSegment): ICoConstraintBindingSegment[] {
    return [
      ...bindings.filter((elm) => elm.segment.pathId !== segmentId),
      ...[value].filter((elm) => !!elm),
    ];
  }

  addContext(bindings: ICoConstraintBindingContext[], value: ICoConstraintBindingContext) {
    return this.replaceContext(undefined, bindings, value);
  }

  addSegment(contextId: string, bindings: ICoConstraintBindingContext[], value: ICoConstraintBindingSegment) {
    const context = bindings.find((elm) => elm.context.pathId === contextId);
    return this.replaceContext(
      contextId,
      bindings,
      {
        ...context,
        bindings: this.replaceSegment(
          undefined,
          context.bindings,
          value,
        ),
      },
    );
  }

  deleteContext(contextId: string, bindings: ICoConstraintBindingContext[]) {
    return this.replaceContext(contextId, bindings, undefined);
  }

  deleteSegment(contextId: string, segmentId: string, bindings: ICoConstraintBindingContext[], value: ICoConstraintBindingSegment) {
    const context = bindings.find((elm) => elm.context.pathId === contextId);
    return this.replaceContext(
      contextId,
      bindings,
      {
        ...context,
        bindings: this.replaceSegment(
          segmentId,
          context.bindings,
          undefined,
        ),
      },
    );
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.igId, this.current$, this.initial$).pipe(
      take(1),
      concatMap(([id, igId, current, initial]) => {
        return this.conformanceProfileService.saveChanges(id, igId, [
          {
            location: id,
            propertyType: PropertyType.COCONSTRAINTBINDINGS,
            oldPropertyValue: initial.value,
            propertyValue: current.data.value,
            changeType: ChangeType.UPDATE,
          },
        ]).pipe(
          mergeMap((message) => {
            return this.conformanceProfileService.getById(id).pipe(
              flatMap((resource) => {
                return [this.messageService.messageToAction(message), new LoadSelectedResource(resource), new LoadResourceReferences({ resourceType: this.editor.resourceType, id }), new EditorUpdate({ value: { value: resource.coConstraintsBindings, resource }, updateDate: false })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectMessagesById, { id });
      }),
    );
  }

  ngOnDestroy(): void {
    this.s_workspace.unsubscribe();
    this.s_changes.unsubscribe();
    if (this.s_tree) {
      this.s_tree.unsubscribe();
    }
  }

  onDeactivate(): void {
    this.ngOnDestroy();
  }

  ngOnInit() {
  }

}
