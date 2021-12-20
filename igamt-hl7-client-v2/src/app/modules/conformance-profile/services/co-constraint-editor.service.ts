import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { selectDerived, selectValueSetsNodes } from '../../../root-store/ig/ig-edit/ig-edit.selectors';
import { CoConstraintBindingDialogComponent, IBindingDialogResult } from '../../co-constraints/components/co-constraint-binding-dialog/co-constraint-binding-dialog.component';
import { CoConstraintEntityService } from '../../co-constraints/services/co-constraint-entity.service';
import { AbstractEditorComponent } from '../../core/components/abstract-editor-component/abstract-editor-component.component';
import { IHL7v2TreeNode } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { ICoConstraintBindingContext, ICoConstraintBindingSegment } from '../../shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../shared/models/editor.enum';
import { ChangeType } from '../../shared/models/save-change';
import { PathService } from '../../shared/services/path.service';
import { StoreResourceRepositoryService } from '../../shared/services/resource-repository.service';

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

export abstract class CoConstraintEditorService extends AbstractEditorComponent {
  conformanceProfile$: Observable<IConformanceProfile>;
  conformanceProfile: ReplaySubject<IConformanceProfile>;

  bindings$: Observable<ICoConstraintBindingContext[]>;
  bindings: ReplaySubject<ICoConstraintBindingContext[]>;

  bindingsSync$: Observable<ICoConstraintBindingContext[]>;
  bindingsSync: ReplaySubject<ICoConstraintBindingContext[]>;

  derived$: Observable<boolean>;

  changes: Subject<IChange>;

  formMap: {
    [id: string]: boolean;
  } = {};

  public structure: IHL7v2TreeNode[];
  public segments: Observable<IDisplayElement[]>;
  public datatypes: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;

  s_changes: Subscription;
  openPanelId: string;

  constructor(
    protected actions$: Actions,
    private dialog: MatDialog,
    protected store: Store<any>,
    public repository: StoreResourceRepositoryService,
    private pathService: PathService,
    protected ccService: CoConstraintEntityService,
    protected editorMetadata: IHL7EditorMetadata) {
    super(
      editorMetadata,
      actions$,
      store,
    );

    this.datatypes = this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes);
    this.segments = this.store.select(fromIgamtDisplaySelectors.selectAllSegments);
    this.valueSets = this.store.select(selectValueSetsNodes);

    this.conformanceProfile = new ReplaySubject<IConformanceProfile>(1);
    this.conformanceProfile$ = this.conformanceProfile.asObservable();

    this.bindings = new ReplaySubject<ICoConstraintBindingContext[]>(1);
    this.bindings$ = this.bindings.asObservable();

    this.bindingsSync = new ReplaySubject<ICoConstraintBindingContext[]>(1);
    this.bindingsSync$ = this.bindingsSync.asObservable();

    this.derived$ = this.store.select(selectDerived);

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
  }

  abstract emitEditorChange(value: ICoConstraintBindingContext[]): void;

  deleteSegmentBinding(event: any) {
    event.segments.splice(event.i, 1);
    this.registerChange({
      type: ChangeType.DELETE,
      level: ChangeLevel.SEGMENT,
      contextId: event.contextId,
      segment: event.segment,
    });
  }

  deleteContextBinding(event: any) {
    event.contexts.splice(event.i, 1);
    this.registerChange({
      type: ChangeType.DELETE,
      level: ChangeLevel.CONTEXT,
      contextId: event.contextId,
      context: event.context,
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

          const contextId = this.pathService.pathToString(result.context.path);
          const segmentId = this.pathService.pathToString(result.segment.path);

          const contextNode: ICoConstraintBindingContext = {
            context: {
              pathId: contextId,
              path: result.context.path,
            },
            bindings: [],
          };

          const segmentNode: ICoConstraintBindingSegment = {
            segment: {
              pathId: segmentId,
              path: result.segment.path,
            },
            name: '',
            tables: [],
          };

          const context = contexts.find((b) => b.context.pathId === contextId);
          if (context) {
            const segment = context.bindings.find((b) => b.segment.pathId === segmentId);
            if (!segment) {
              context.bindings.push(segmentNode);

              this.registerChange({
                type: ChangeType.ADD,
                level: ChangeLevel.SEGMENT,
                contextId,
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
              contextId,
              segment: segmentNode,
            });
          }
        }
      });
  }

  openPanel(id: string) {
    this.openPanelId = id;
  }

  segmentBindingChange(event: any) {
    this.registerChange({
      type: ChangeType.UPDATE,
      level: ChangeLevel.SEGMENT,
      contextId: event.contextId,
      segment: event.value,
    });
  }

  formValid(event: any) {
    this.formMap[event.path] = event.validity;
  }

  isFormValid(): boolean {
    for (const key of Object.keys(this.formMap)) {
      if (!this.formMap[key]) {
        return false;
      }
    }
    return true;
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
          this.emitEditorChange(transformed);
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

}
