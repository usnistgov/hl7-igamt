import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { combineLatest, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, flatMap, map, take, tap } from 'rxjs/operators';
import { DamWidgetComponent } from 'src/app/modules/dam-framework';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { UserMessage } from '../../../dam-framework/models/messages/message.class';
import { CsDialogComponent } from '../../../shared/components/cs-dialog/cs-dialog.component';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import {
  CoConstraintGroupBindingType,
  ICoConstraintBindingSegment,
  ICoConstraintGroupBindingRef,
  ICoConstraintTable,
  ICoConstraintTableConditionalBinding,
  IStructureElementRef,
} from '../../../shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { IPath } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ISegment } from '../../../shared/models/segment.interface';
import { ElementNamingService, IPathInfo } from '../../../shared/services/element-naming.service';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { PathService } from '../../../shared/services/path.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { CoConstraintEntityService } from '../../services/co-constraint-entity.service';
import { FileUploadService } from '../../services/file-upload.service';
import { CoConstraintGroupSelectorComponent } from '../co-constraint-group-selector/co-constraint-group-selector.component';
import { CoConstraintImportDialogComponent } from '../co-constraint-import-dialog/co-constraint-import-dialog.component';
import { CoConstraintAction, CoConstraintTableComponent } from '../co-constraint-table/co-constraint-table.component';
import { IContextCoConstraint } from './../context-co-constraint-binding/context-co-constraint-binding.component';

export interface ISegmentCoConstraint {
  resolved: boolean;
  issue?: string;
  segment?: ISegment;
  display?: IDisplayElement;
  pathInfo?: IPathInfo;
  name?: string;
}

@Component({
  selector: 'app-segment-co-constraint-binding',
  templateUrl: './segment-co-constraint-binding.component.html',
  styleUrls: ['./segment-co-constraint-binding.component.scss'],
})
export class SegmentCoConstraintBindingComponent implements OnInit, OnDestroy {

  binding: ICoConstraintBindingSegment;
  userMessage: UserMessage;

  formMap: {
    [id: number]: NgForm;
  } = {};

  @Input()
  delta: boolean;
  @Input()
  derived: boolean;
  @Input()
  viewOnly: boolean;
  @Input()
  datatypes: IDisplayElement[];
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  segments: IDisplayElement[];
  @Input()
  conformanceProfile: Observable<IConformanceProfile>;
  @Input()
  structure: IHL7v2TreeNode[];
  @Input()
  context: IStructureElementRef;
  @Input()
  contextInfo: IContextCoConstraint;
  @Input()
  documentRef: IDocumentRef;
  @Output()
  valueChange: EventEmitter<ICoConstraintBindingSegment>;
  @Output()
  formValid: EventEmitter<boolean>;
  @ViewChildren(CoConstraintTableComponent)
  tableComponents: QueryList<CoConstraintTableComponent>;
  @Output()
  delete: EventEmitter<boolean>;
  segmentCoConstraint$: Observable<ISegmentCoConstraint>;
  unsavedChanges: boolean;
  changesSubscription: Subscription;

  @Input()
  set value(binding: ICoConstraintBindingSegment) {
    this.binding = {
      ...binding,
    };
  }

  constructor(
    protected actions$: Actions,
    private dialog: MatDialog,
    protected store: Store<any>,
    public repository: StoreResourceRepositoryService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService,
    private treeService: Hl7V2TreeService,
    private pathService: PathService,
    private elementNamingService: ElementNamingService,
    private widget: DamWidgetComponent,
    protected ccService: CoConstraintEntityService) {
    this.valueChange = new EventEmitter<ICoConstraintBindingSegment>();
    this.delete = new EventEmitter<boolean>();
    this.formValid = new EventEmitter<boolean>();
    this.changesSubscription = this.widget.containsUnsavedChanges$().subscribe((value) => this.unsavedChanges = value);
  }

  exportAsExcel(table: ICoConstraintTable) {
    this.conformanceProfile.pipe(
      take(1),
      tap((cp) => {
        this.ccService.exportAsExcel(table, cp.id, this.context.pathId, this.binding.segment.pathId);
      }),
    ).subscribe();
  }

  exportAsJson(table: ICoConstraintTable, index: number) {
    this.conformanceProfile.pipe(
      take(1),
      tap((cp) => {
        this.ccService.exportAsJson(cp.id, this.context.pathId, this.binding.segment.pathId, index);
      }),
    ).subscribe();
  }

  triggerRemove() {
    this.delete.emit(true);
  }

  getSegment(id: string): Observable<ISegment> {
    return this.repository.fetchResource(Type.SEGMENT, id).pipe(take(1), map((seg) => seg as ISegment));
  }

  generateTableId(segment: ISegmentCoConstraint, context: IContextCoConstraint, rand: string) {
    const prefix = context.pathInfo && context.pathInfo.type === Type.GROUP && context.name ? context.name.replace('.', '_') + '_' : '';
    const postfix = segment.name ? segment.name.replace('.', '_') + '_' : '';
    return prefix + postfix + rand;
  }

  createTable(binding: ICoConstraintBindingSegment, scc: ISegmentCoConstraint) {
    const id = this.generateTableId(scc, this.contextInfo, Guid.create().toString().substring(0, 5));
    this.ccService.createCoConstraintTableForSegment(scc.segment, this.repository).pipe(
      take(1),
      tap((table) => {
        binding.tables.push({
          condition: undefined,
          value: table,
          id,
        });
        this.triggerChange();
      }),
    ).subscribe();
  }

  importCoConstraintGroup(id: number, display: IDisplayElement) {
    const component = this.tableComponents.find((table) => table.id === id);
    if (display && component) {
      const dialogRef = this.dialog.open(CoConstraintGroupSelectorComponent, {
        data: {
          segment: display,
          documentRef: this.documentRef,
        },
      });

      dialogRef.afterClosed().subscribe(
        (result: IDisplayElement[]) => {
          if (result) {
            result.forEach((groupDisplay) => {
              const exist = component.value.groups.find((elm) => {
                return elm.type === CoConstraintGroupBindingType.REF && (elm as ICoConstraintGroupBindingRef).refId === groupDisplay.id;
              });

              if (!exist) {
                component.dispatch({
                  type: CoConstraintAction.IMPORT_GROUP,
                  payload: this.ccService.createCoConstraintGroupBinding(groupDisplay.id),
                });
              }
            });
          }
        },
      );
    }
  }

  openConditionDialog(context: any, conditional: ICoConstraintTableConditionalBinding) {
    const dialogRef = this.dialog.open(CsDialogComponent, {
      maxWidth: '150vw',
      maxHeight: '130vh',
      data: {
        title: 'Co-Constraint Table Conditional',
        assertionMode: true,
        context: context.path,
        assertion: conditional.condition,
        resource: this.conformanceProfile,
        excludePaths: [this.binding.segment.pathId],
        hideFreeText: true,
      },
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          conditional.condition = result.assertion;
          this.triggerChange();
        }
      },
    );
  }

  addCoConstraintGroup(id: number) {
    const component = this.tableComponents.find((table) => table.id === id);
    if (component) {
      component.dispatch({
        type: CoConstraintAction.ADD_GROUP,
      });
    }
  }

  deleteTable(segment: ICoConstraintBindingSegment, i: number) {
    segment.tables.splice(i, 1);
    this.triggerChange();
  }

  clearCondition(conditional: ICoConstraintTableConditionalBinding) {
    conditional.condition = undefined;
    this.triggerChange();
  }

  tableChange(table: ICoConstraintTable, id: number) {
    if (id >= 0 && this.binding.tables.length > id) {
      this.formValid.emit(this.isFormValid());
      this.valueChange.emit({
        ...this.binding,
        tables: [
          ...this.binding.tables.map((elm, i) => {
            if (i !== id) {
              return elm;
            } else {
              return {
                ...elm,
                value: table,
              };
            }
          }),
        ],
      });
    }
  }

  formChange(form: NgForm, id: number) {
    this.formMap[id] = form;
  }

  triggerChange() {
    this.valueChange.emit(this.binding);
  }

  isFormValid(): boolean {
    for (const key of Object.keys(this.formMap)) {
      if (!this.formMap[key].valid) {
        return false;
      }
    }
    return true;
  }

  getTargetResource(path: IPath): Observable<{ display: IDisplayElement, segment: ISegment }> {
    return this.treeService.getNodeByPath(
      this.structure[0].children,
      path,
      this.repository,
    ).pipe(
      take(1),
      flatMap((segmentRef) => {
        if (segmentRef.data.type === Type.SEGMENTREF) {
          const segmentId = segmentRef.data.ref.getValue().id;
          return combineLatest(
            this.getSegment(segmentId),
            this.repository.getResourceDisplay(Type.SEGMENT, segmentId),
          ).pipe(
            map(([segment, display]) => {
              return { segment, display };
            }),
            catchError((error) => {
              return throwError({
                message: 'Could not find segment : ' + error.message,
              });
            }),
          );
        } else {
          return throwError({
            message: 'SegmentRef path is not referencing a segment but a : ' + segmentRef.data.type,
          });
        }
      }),
      // tslint:disable-next-line: no-identical-functions
      catchError((error) => {
        return throwError({
          message: 'Invalid segment path : ' + error.message,
        });
      }),
    );
  }

  getTargetPathName(path: IPath, startFrom: string): Observable<{ pathInfo: IPathInfo, name: string }> {
    return this.conformanceProfile.pipe(
      flatMap((conformanceProfile) => {
        return this.elementNamingService.getPathInfoFromPath(conformanceProfile, this.repository, path).pipe(
          take(1),
          map((pathInfo) => {
            const name = this.elementNamingService.getStringNameFromPathInfo(this.elementNamingService.getStartPathInfo(pathInfo, startFrom));
            const nodeInfo = this.elementNamingService.getLeaf(pathInfo);
            return {
              name,
              pathInfo: nodeInfo,
            };
          }),
        );
      }),
    );
  }

  getSegmentCoConstraint(contextPath: IPath, segmentPath: IPath): Observable<ISegmentCoConstraint> {
    const path = this.pathService.straightConcatPath(contextPath, segmentPath);
    return path ? combineLatest(
      this.getTargetResource(path),
      this.getTargetPathName(path, segmentPath.elementId),
    ).pipe(
      map(([{ segment, display }, { name, pathInfo }]) => {
        return {
          resolved: true,
          segment,
          display,
          pathInfo,
          name,
        };
      }),
      catchError((error) => {
        return of({
          resolved: false,
          issue: error.message,
        });
      }),
    ) : of({
      resolved: false,
      issue: 'Invalid segment path',
    });
  }

  importTable(format: string) {
    this.conformanceProfile.pipe(
      take(1),
      tap((cp) => {
        this.dialog.open(CoConstraintImportDialogComponent, {
          disableClose: true,
          data: {
            segmentPathId: this.binding.segment.pathId,
            conformanceProfileId: cp.id,
            documentId: this.documentRef.documentId,
            contextPathId: this.context.pathId,
            format,
            files: format === 'json' ? 'application/json' : format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' : '',
            importFile: (file: File, cpId: string, contextId: string, segmentId: string) => this.fileUploadService.importCoConstraints(
              file, cpId, contextId, segmentId, format,
            ),
          },
        });
      }),
    ).subscribe();
  }

  ngOnInit() {
    this.segmentCoConstraint$ = this.getSegmentCoConstraint(this.context.path, this.binding.segment.path);
  }

  ngOnDestroy() {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
  }
}
