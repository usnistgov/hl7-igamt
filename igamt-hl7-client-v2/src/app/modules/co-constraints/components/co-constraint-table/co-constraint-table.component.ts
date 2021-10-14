import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { combineLatest, Observable, of, Subject, EMPTY } from 'rxjs';
import { filter, map, take, tap, catchError } from 'rxjs/operators';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { SegmentService } from '../../../segment/services/segment.service';
import { ICardinalityRange, IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import {
  CoConstraintGroupBindingType,
  CoConstraintHeaderType,
  CoConstraintMode,
  ICoConstraint,
  ICoConstraintGroup,
  ICoConstraintGroupBindingContained,
  ICoConstraintGrouper,
  ICoConstraintHeader,
  ICoConstraintTable,
  IDataElementHeader,
  INarrativeHeader,
} from '../../../shared/models/co-constraint.interface';
import { ICoConstraintGroupBinding, ICoConstraintGroupBindingRef, ICoConstraintHeaders, ICoConstraintRequirement, IDataElementHeaderInfo, CoConstraintColumnType } from '../../../shared/models/co-constraint.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { PathService } from '../../../shared/services/path.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { CoConstraintEntityService } from '../../services/co-constraint-entity.service';
import { DataHeaderDialogComponent } from '../data-header-dialog/data-header-dialog.component';
import { GrouperDialogComponent } from '../grouper-dialog/grouper-dialog.component';
import { NarrativeHeaderDialogComponent } from '../narrative-header-dialog/narrative-header-dialog.component';

export enum CoConstraintAction {
  ADD_GROUP,
  IMPORT_GROUP,
  DELETE_GROUP,
  ADD_COCONSTRAINT,
  DELETE_COCONSTRAINT,
}

export interface ICoConstraintAction {
  type: CoConstraintAction;
  targetGroup?: number;
  targetCoConstraint?: number;
  payload?: any;
}

export interface IDynamicMappingHeaders {
  datatype: IDataElementHeader;
  varies: IDataElementHeader;
}

interface ICoConstraintGroupMap {
  [id: string]: ICoConstraintGroup;
}

@Component({
  selector: 'app-co-constraint-table',
  templateUrl: './co-constraint-table.component.html',
  styleUrls: ['./co-constraint-table.component.scss'],
})
export class CoConstraintTableComponent implements OnInit {

  @Input()
  delta: boolean;

  @Input()
  derived: boolean;

  @Input()
  id: number;

  @Input()
  vOnly: boolean;

  @Input()
  set segment(seg: ISegment) {
    this.processTree(seg, this._documentRef);
  }

  get segment() {
    return this._segment;
  }

  @Input()
  set documentRef(documentRef: IDocumentRef) {
    this.processTree(this._segment, documentRef);
  }

  @Input()
  set value(table: ICoConstraintTable & ICoConstraintGroup) {
    this._value = {
      ...table,
    };

    const datatype: IDataElementHeader = this._value.headers.constraints.find((header) => header.type === CoConstraintHeaderType.DATAELEMENT && (header as IDataElementHeader).columnType === CoConstraintColumnType.DATATYPE) as IDataElementHeader;
    const varies: IDataElementHeader = this._value.headers.constraints.find((header) => header.type === CoConstraintHeaderType.DATAELEMENT && (header as IDataElementHeader).columnType === CoConstraintColumnType.VARIES) as IDataElementHeader;
    this.dynamicMappingHeaders = {
      datatype,
      varies,
    };

    if (this._value.groups) {
      this._value.groups.filter((elm) => elm.type === CoConstraintGroupBindingType.REF).forEach((group) => {
        this.loadGroupRef(group as ICoConstraintGroupBindingRef);
      });
    }
  }

  get value() {
    return this._value;
  }

  @Output()
  valueChange: EventEmitter<ICoConstraintTable & ICoConstraintGroup>;
  @Output()
  formValue: EventEmitter<NgForm>;
  _documentRef: IDocumentRef;
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  datatypes: IDisplayElement[];
  @Input()
  mode: CoConstraintMode;
  _segment: ISegment;
  _value: ICoConstraintTable & ICoConstraintGroup;
  actions$: Subject<ICoConstraintAction>;
  structure: IHL7v2TreeNode[];
  @ViewChild('codeCell')
  codeTmplRef: TemplateRef<any>;
  @ViewChild('valueCell')
  valueTmplRef: TemplateRef<any>;
  @ViewChild('valueSetCell')
  valueSetTmplRef: TemplateRef<any>;
  @ViewChild('datatypeCell')
  datatypeTmplRef: TemplateRef<any>;
  @ViewChild('narrativeCell')
  narrativeTmplRef: TemplateRef<any>;
  @ViewChild('variesCell')
  variesTmplRef: TemplateRef<any>;
  @ViewChild('tableForm')
  form: NgForm;

  filteredOptions = [];
  datatypeOptions = [];
  dynamicMappingHeaders: {
    datatype: IDataElementHeader;
    varies: IDataElementHeader;
  };
  groupsMap: ICoConstraintGroupMap = {};
  datatypeOptionsMap = {};
  showGrouper = false;
  usages = [
    {
      label: 'R',
      value: 'R',
    },
    {
      label: 'S',
      value: 'S',
    },
    {
      label: 'O',
      value: 'O',
    },
  ];
  headersElementInfo: Record<string, IDataElementHeaderInfo> = {};

  constructor(
    private dialog: MatDialog,
    private segmentService: SegmentService,
    private coconstraintEntity: CoConstraintEntityService,
    private repository: StoreResourceRepositoryService,
    private pathService: PathService,
    private treeService: Hl7V2TreeService) {
    this.valueChange = new EventEmitter();
    this.formValue = new EventEmitter();
  }

  getHeaderElementInfo(header: IDataElementHeader): Observable<IDataElementHeaderInfo> {
    if (this.headersElementInfo[header.key]) {
      return of(this.headersElementInfo[header.key]);
    } else {
      return this.getDataElementHeaderElementInfo(this.segment.name, this.structure[0].children, header.columnType, header.key).pipe(
        take(1),
        map((info) => {
          this.headersElementInfo[header.key] = info;
          return info;
        }),
      );
    }
  }

  getGrouperElementInfo(grouper: ICoConstraintGrouper): Observable<IDataElementHeaderInfo> {
    if (!grouper) {
      return null;
    }

    if (this.headersElementInfo[grouper.pathId]) {
      return of(this.headersElementInfo[grouper.pathId]);
    } else {
      return this.getDataElementHeaderElementInfo(this.segment.name, this.structure[0].children, CoConstraintColumnType.GROUPER, grouper.pathId).pipe(
        take(1),
        map((info) => {
          this.headersElementInfo[grouper.pathId] = info;
          return info;
        }),
      );
    }
  }

  repeats(cardinality: ICardinalityRange): boolean {
    return cardinality && cardinality.max && cardinality.max !== '*' && +cardinality.max > 1;
  }

  getDataElementHeaderElementInfo(segment: string, tree: IHL7v2TreeNode[], columnType: CoConstraintColumnType, key: string): Observable<IDataElementHeaderInfo> {
    return this.treeService.getNodeByPath(tree, this.pathService.getPathFromPathId(key), this.repository).pipe(
      map((node) => {
        const resourceRef = node.data.ref.getValue();
        const parent = node.parent ? node.parent.data.ref.getValue() : undefined;
        return {
          version: resourceRef.version,
          parent: parent ? parent.name : segment,
          datatype: resourceRef.name,
          location: node.data.position,
          cardinality: node.data.cardinality,
          type: node.data.type,
          bindingInfo: node.data.valueSetBindingsInfo ? node.data.valueSetBindingsInfo.getValue() : null,
          displayCardinality: this.repeats(node.data.cardinality) && columnType === CoConstraintColumnType.VARIES,
          name: segment + '-' + (key || '').replace('-', '.'),
          resolved: true,
        };
      }),
      catchError((err) => {
        return of({
          resolved: false,
          error: err && err.message ? err.message : 'Could not find path ' + key,
          version: undefined,
          parent: undefined,
          datatype: undefined,
          location: undefined,
          cardinality: undefined,
          type: undefined,
          bindingInfo: undefined,
          displayCardinality: undefined,
          name: segment + '-' + (key || '').replace('-', '.'),
        });
      }),
    );
  }

  numberOfCardinalityColumns(headersObj: ICoConstraintHeaders): Observable<number> {
    const headers = [
      ...(headersObj.selectors ? headersObj.selectors : []),
      ...(headersObj.constraints ? headersObj.constraints : []),
    ];
    return combineLatest(headers.map((header) => this.getHeaderElementInfo(header as IDataElementHeader))).pipe(
      take(1),
      map((headerInfos) => {
        return headerInfos.map((hi) => hi.displayCardinality).reduce((acc, v) => {
          return v ? acc + 1 : acc;
        }, 0);
      }),
    );
  }

  promptSelectGrouper(deflt: boolean = false): Observable<ICoConstraintGrouper> {
    if (deflt) {
      const grouper = this.coconstraintEntity.getDefaultGrouper(this._segment, this.structure[0].children);
      if (grouper) {
        return of(grouper);
      }
    }

    return this.dialog.open(GrouperDialogComponent, {
      data: {
        structure: this.structure,
        repository: this.repository,
        segment: this._segment,
        excludePaths: this.getDataElementPaths(this._value.headers),
      },
    }).afterClosed();

  }

  setTableGrouper(_default: boolean = false, then?: (ICoConstraintGrouper) => void) {
    this.promptSelectGrouper(_default).pipe(
      filter((grouper) => !!grouper),
      tap((grouper) => {
        this.setGrouper(grouper);
        if (then) {
          then(grouper);
        }
      }),
    ).subscribe();
  }

  clearGrouper() {
    this.setGrouper(undefined);
  }

  // tslint:disable-next-line: cognitive-complexity
  dispatch(action: ICoConstraintAction) {
    switch (action.type) {
      case CoConstraintAction.ADD_COCONSTRAINT:
        if (action.targetGroup) {
          if (this.value.groups.length < action.targetGroup && this.value.groups[action.targetGroup].type === CoConstraintGroupBindingType.CONTAINED) {
            this.addCoConstraint((this.value.groups[action.targetGroup] as ICoConstraintGroupBindingContained).coConstraints);
          }
        } else {
          this.addCoConstraint(this.value.coConstraints);
        }
        break;
      case CoConstraintAction.ADD_GROUP:
        if (this.value.headers.grouper) {
          this.addCoConstraintGroup();
        } else {
          this.setTableGrouper(true, () => {
            this.addCoConstraintGroup();
          });
        }
        break;
      case CoConstraintAction.DELETE_COCONSTRAINT:
        if (action.targetGroup) {
          if (this.value.groups.length < action.targetGroup && this.value.groups[action.targetGroup].type === CoConstraintGroupBindingType.CONTAINED) {
            this.deleteCoConstraint((this.value.groups[action.targetGroup] as ICoConstraintGroupBindingContained).coConstraints, action.targetCoConstraint);
          }
        } else {
          this.deleteCoConstraint(this.value.coConstraints, action.targetCoConstraint);
        }
        break;
      case CoConstraintAction.DELETE_GROUP:
        this.deleteCoConstraintGroup(this.value.groups, action.targetGroup);
        break;
      case CoConstraintAction.IMPORT_GROUP:
        this.addImportedGroup(action.payload);
        break;
    }
  }

  loadGroupRef(group: ICoConstraintGroupBindingRef) {
    const id = group.refId;
    this.getGroup(id).pipe(
      tap((value) => {
        this.coconstraintEntity.mergeGroupWithTable(this.value, value);
        this.groupsMap[id] = value;
      }),
    ).subscribe();
  }

  setGrouper(grouper: ICoConstraintGrouper) {
    this.value.headers.grouper = grouper;
    this.emitChange();
  }

  addImportedGroup(group: ICoConstraintGroupBindingRef) {
    this.loadGroupRef(group);
    this.value.groups.push(group);
    this.emitChange();
  }

  getDatatype(id: string): IDisplayElement {
    return this.datatypes.find((dt) => {
      return dt.id === id;
    });
  }

  filter(values: IDisplayElement[], value: string): IDisplayElement[] {
    return values.filter((v) => {
      return v.fixedName === value;
    });
  }

  drop(event: CdkDragDrop<ICoConstraint[]>) {
    if (event.currentIndex === 0) {
      event.container.data[event.previousIndex].requirement.usage = 'R';
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  processTree(segment: ISegment, documentRef: IDocumentRef) {
    if (segment) {
      this._segment = segment;
    }

    if (documentRef) {
      this._documentRef = documentRef;
    }

    if (segment && documentRef) {
      this.treeService.getTree(segment, this.repository, true, true, (value) => {
        this.structure = [
          {
            data: {
              id: segment.id,
              pathId: segment.id,
              name: segment.name,
              type: segment.type,
              rootPath: { elementId: segment.id },
              position: 0,
            },
            expanded: true,
            children: [...value],
            parent: undefined,
          },
        ];
      });
      if (segment.name === 'OBX') {
        this.initOptions();
      }
    }
  }

  emitChange() {
    this.valueChange.emit(this.value);
    this.formValue.emit(this.form);
  }

  getGroup(id: string): Observable<ICoConstraintGroup> {
    return this.repository.fetchResource(Type.COCONSTRAINTGROUP, id).pipe(take(1), map((elm) => elm as ICoConstraintGroup));
  }

  initOptions() {
    this.segmentService.getObx2Values(this._segment, this._documentRef).pipe(
      take(1),
      tap((values) => {
        this.datatypeOptions = values.map((value) => {
          return {
            value,
            label: value,
          };
        }).sort((a, b) => {
          return a.value > b.value ? 1 : -1;
        });
      }),
    ).subscribe();
  }

  getCellTemplateForType(type: CoConstraintColumnType) {
    switch (type) {
      case CoConstraintColumnType.VALUE:
        return this.valueTmplRef;
      case CoConstraintColumnType.CODE:
        return this.codeTmplRef;
      case CoConstraintColumnType.VALUESET:
        return this.valueSetTmplRef;
      case CoConstraintColumnType.DATATYPE:
        return this.datatypeTmplRef;
      case CoConstraintColumnType.VARIES:
        return this.variesTmplRef;
    }
  }

  openDataColumnDialog(list: IDataElementHeader[], selector: boolean) {
    const ref = this.dialog.open(DataHeaderDialogComponent, {
      data: {
        structure: this.structure,
        repository: this.repository,
        segment: this._segment,
        selector,
        excludePaths: this.getDataElementPaths(this._value.headers),
      },
    });

    ref.afterClosed().subscribe(
      (header: IDataElementHeader) => {
        this.addHeaderToList(list, header);
      },
    );
  }

  usageChange(usage, req: ICoConstraintRequirement) {
    if (usage === 'R') {
      req.cardinality.min = 1;
    } else if (usage === 'O') {
      req.cardinality.min = 0;
    }
    this.emitChange();
  }

  getDataElementPaths(headers: ICoConstraintHeaders): string[] {
    return [...headers.selectors, ...headers.constraints].filter((header) => header.type === CoConstraintHeaderType.DATAELEMENT).map((header) => header.key);
  }

  openNarrativeColumnDialog(list: INarrativeHeader[]) {
    const ref = this.dialog.open(NarrativeHeaderDialogComponent);

    ref.afterClosed().subscribe(
      (header: INarrativeHeader) => {
        this.addHeaderToList(list, header);
      },
    );
  }

  addHeaderToList(list: ICoConstraintHeader[], header: ICoConstraintHeader) {
    if (header) {
      list.push(header);
      this.coconstraintEntity.addColumn(header, this.value);
      this.emitChange();
    }
  }

  getCellTemplate(header: ICoConstraintHeader) {
    if (header.type === CoConstraintHeaderType.DATAELEMENT) {
      const dataHeader = header as IDataElementHeader;
      return this.getCellTemplateForType(dataHeader.columnType);
    } else {
      return this.narrativeTmplRef;
    }
  }

  numberOfColumns() {
    const ifSize = this.listSize(this.value.headers.selectors);
    const thenSize = this.listSize(this.value.headers.constraints);
    const userSize = this.listSize(this.value.headers.narratives);

    return ifSize + thenSize + userSize + 1;
  }

  oneOrMore(n: number): number {
    return (n === 0) ? 1 : n;
  }

  listSize(headers: ICoConstraintHeader[]) {
    let size = 0;
    headers.forEach(
      (header) => {
        size++;
      },
    );

    return this.oneOrMore(size);
  }

  addCoConstraint(list) {
    const cc = this.coconstraintEntity.createEmptyCoConstraint(this.value.headers);
    list.push(cc);
    this.emitChange();
  }

  addCoConstraintGroup() {
    const group = this.coconstraintEntity.createEmptyContainedGroupBinding();
    (this.value as ICoConstraintTable).groups.push(group);
    this.emitChange();
  }

  deleteCoConstraint(list: ICoConstraint[], index: number) {
    list.splice(index, 1);
    this.emitChange();
  }

  deleteCoConstraintGroup(list: ICoConstraintGroupBinding[], index: number) {
    if (list.length > index) {
      if (list[index].type === CoConstraintGroupBindingType.REF) {
        delete this.groupsMap[(list[index] as ICoConstraintGroupBindingRef).refId];
      }
      list.splice(index, 1);
      this.emitChange();
    }
  }

  deleteColumn(list: ICoConstraintHeader[], header: ICoConstraintHeader, index: number) {
    this.value.coConstraints.forEach((cc) => {
      delete cc.cells[header.key];
    });

    if (this.value.tableType === CoConstraintMode.TABLE) {
      const table = this.value as ICoConstraintTable;
      table.groups.forEach((group) => {
        if (group.type === CoConstraintGroupBindingType.CONTAINED) {
          const ccgroup = group as ICoConstraintGroupBindingContained;
          ccgroup.coConstraints.forEach((cc) => {
            delete cc.cells[header.key];
          });
        }
      });
    }

    list.splice(index, 1);
    this.emitChange();
  }

  ngOnInit() {
    this.value.headers.selectors.forEach((header) => {
      this.getDataElementHeaderElementInfo(this.segment.name, this.structure[0].children, (header as IDataElementHeader).columnType, (header as IDataElementHeader).key);
    });
    this.value.headers.constraints.forEach((header) => {
      this.getDataElementHeaderElementInfo(this.segment.name, this.structure[0].children, (header as IDataElementHeader).columnType, (header as IDataElementHeader).key);
    });
  }

}
