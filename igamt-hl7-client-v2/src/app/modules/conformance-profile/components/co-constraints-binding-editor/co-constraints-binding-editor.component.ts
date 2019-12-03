import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectAllDatatypes, selectIgId, selectSegmentsById, selectValueSetsNodes } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { CoConstraintBindingDialogComponent } from '../../../co-constraints/components/co-constraint-binding-dialog/co-constraint-binding-dialog.component';
import { CoConstraintGroupSelectorComponent } from '../../../co-constraints/components/co-constraint-group-selector/co-constraint-group-selector.component';
import { CoConstraintEntityService } from '../../../co-constraints/services/co-constraint-entity.service';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { CsDialogComponent } from '../../../shared/components/cs-dialog/cs-dialog.component';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { ICoConstraintTable, ICoConstraintGroup } from '../../../shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { IAssertion, IPath } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ISegment } from '../../../shared/models/segment.interface';
import { ConformanceStatementService } from '../../../shared/services/conformance-statement.service';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';

export interface ICoConstraintBindingContext {
  context: {
    pathId: string;
    name: string;
    path: IPath;
  };
  bindings: ICoConstraintBindingSegment[];
}

export interface ICoConstraintBindingSegment {
  segment: {
    pathId: string;
    segmentId: string;
    name: string;
    path: IPath;
  };
  tables: ICoConstraintTableConditionalBinding[];
}

export interface ICoConstraintTableConditionalBinding {
  condition: IAssertion;
  table: ICoConstraintTable;
}

export interface IBindingDialogResult {
  context: {
    name: string;
    node: IHL7v2TreeNode;
    path: IPath;
  };
  segment: {
    name: string;
    segmentId: string;
    node: IHL7v2TreeNode;
    path: IPath;
  };
}

export interface ISegmentMap {
  [id: string]: ISegment;
}

@Component({
  selector: 'app-co-constraints-binding-editor',
  templateUrl: './co-constraints-binding-editor.component.html',
  styleUrls: ['./co-constraints-binding-editor.component.scss'],
})
export class CoConstraintsBindingEditorComponent extends AbstractEditorComponent implements OnInit {

  conformanceProfile$: Observable<IConformanceProfile>;
  conformanceProfile: ReplaySubject<IConformanceProfile>;
  segments: ReplaySubject<IConformanceProfile>;
  structure: IHL7v2TreeNode[];
  group$: Observable<ICoConstraintTable>;
  groupSubject: ReplaySubject<ICoConstraintTable>;
  nameSubject: ReplaySubject<ICoConstraintTable>;
  public datatypes: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;
  public igId: Observable<string>;
  bindings: ICoConstraintBindingContext[] = [];
  accordionState: {
    [id: string]: boolean,
  } = {};

  constructor(
    protected actions$: Actions,
    private dialog: MatDialog,
    protected store: Store<any>,
    public repository: StoreResourceRepositoryService,
    private csService: ConformanceStatementService,
    private treeService: Hl7V2TreeService,
    protected ccService: CoConstraintEntityService) {
    super({
      id: EditorID.CP_CC_BINDING,
      title: 'Co-Constraints Binding',
      resourceType: Type.CONFORMANCEPROFILE,
    },
      actions$,
      store);

    this.groupSubject = new ReplaySubject<ICoConstraintTable>(1);
    this.group$ = this.groupSubject.asObservable();

    this.datatypes = this.store.select(selectAllDatatypes);
    this.valueSets = this.store.select(selectValueSetsNodes);
    this.igId = this.store.select(selectIgId);
    this.conformanceProfile = new ReplaySubject<IConformanceProfile>(1);
    this.conformanceProfile$ = this.conformanceProfile.asObservable();
    this.currentSynchronized$.pipe(
      tap((data) => {
        this.conformanceProfile.next(data.resource);
      }),
    ).subscribe();

    this.conformanceProfile$.pipe(
      map((message) => {
        this.treeService.getTree(message, this.repository, true, true, (value) => {
          this.structure = [
            {
              data: {
                id: message.id,
                pathId: message.id,
                name: message.name,
                type: message.type,
                position: 0,
              },
              expanded: true,
              children: [...value],
              parent: undefined,
            },
          ];
        });
      }),
    ).subscribe();
  }

  change($event) {
  }

  clearCondition(conditional: ICoConstraintTableConditionalBinding) {
    conditional.condition = undefined;
  }

  openConditionDialog(context: any, conditional: ICoConstraintTableConditionalBinding) {
    const dialogRef = this.dialog.open(CsDialogComponent, {
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: 'Co-Constraint Table Conditional',
        assertionMode: true,
        context: context.path,
        assertion: conditional.condition,
        resource: this.conformanceProfile$,
      },
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          console.log(result);
          conditional.condition = result.assertion;
        }
      },
    );
  }

  createTable(segment: ICoConstraintBindingSegment) {
    this.repository.fetchResource(Type.SEGMENT, segment.segment.segmentId).pipe(
      take(1),
      map((seg: ISegment) => {
        this.ccService.createCoConstraintTableForSegment(seg, this.repository).pipe(
          map((table) => {
            segment.tables.push({
              condition: undefined,
              table,
            });
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  getSegment(id: string): Observable<ISegment> {
    return this.repository.fetchResource(Type.SEGMENT, id);
  }

  openBindingCreateDialog() {
    const ref = this.dialog.open(CoConstraintBindingDialogComponent, {
      data: {
        structure: this.structure,
        repository: this.repository,
      },
    });

    ref.afterClosed().subscribe(
      (result: IBindingDialogResult) => {
        if (result) {
          let binding = this.bindings.find((b) => b.context.pathId === result.context.node.data.pathId);
          if (!binding) {
            binding = {
              context: {
                pathId: result.context.node.data.pathId,
                path: result.context.path,
                name: result.context.name,
              },
              bindings: [],
            };
            this.bindings.push(binding);
          }

          const segmentBinding = binding.bindings.find((b) => b.segment.pathId === result.segment.node.data.pathId);
          if (!segmentBinding) {
            const bd = {
              segment: {
                pathId: result.segment.node.data.pathId,
                segmentId: result.segment.segmentId,
                path: result.segment.path,
                name: result.segment.name,
              },
              tables: [],
            };
            binding.bindings.push(bd);
            this.createTable(bd);
          }
          this.openAccordion(result.context.node.data.pathId);
        }
      },
    );
  }

  deleteTable(segment: ICoConstraintBindingSegment, i: number) {
    segment.tables.splice(i, 1);
  }

  importCoConstraintGroup(binding: ICoConstraintBindingSegment, table: ICoConstraintTable) {
    combineLatest(
      this.store.select(selectSegmentsById, { id: binding.segment.segmentId }),
      this.igId,
    ).pipe(
      map(([segment, igId]) => {
        const dialogRef = this.dialog.open(CoConstraintGroupSelectorComponent, {
          data: {
            segment,
            igId,
          },
        });

        dialogRef.afterClosed().subscribe(
          (result: IDisplayElement[]) => {
            if (result) {
              result.forEach((groupDisplay) => {
                this.repository.fetchResource(Type.COCONSTRAINTGROUP, groupDisplay.id).pipe(
                  take(1),
                  tap((group: ICoConstraintGroup) => {
                    this.ccService.mergeGroupWithTable(table, group);
                    table.groups.push(
                      this.ccService.createCoConstraintGroupBinding(group),
                    );
                  }),
                ).subscribe();
              });
            }
          },
        );
      }),
    ).subscribe();
  }

  addCoConstraintGroup(table: ICoConstraintTable) {
    const group = this.ccService.createEmptyContainedGroupBinding();
    table.groups.push(group);
  }

  openAccordion(id: string) {
    for (const key of Object.keys(this.accordionState)) {
      this.accordionState[key] = false;
    }
    this.accordionState[id] = true;
  }

  toggleAccordion(id: string) {
    if (this.accordionState[id]) {
      this.accordionState[id] = false;
    } else {
      this.openAccordion(id);
    }
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return of();
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return of();
  }

  onDeactivate(): void {

  }

  ngOnInit() {
  }

}
