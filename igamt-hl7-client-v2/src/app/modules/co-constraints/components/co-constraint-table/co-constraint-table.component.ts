import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Scope } from 'src/app/modules/shared/constants/scope.enum';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { SegmentService } from '../../../segment/services/segment.service';
import { BindingSelectorComponent, IBindingLocationInfo } from '../../../shared/components/binding-selector/binding-selector.component';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import {
  CoConstraintColumnType,
  CoConstraintGroupBindingType,
  CoConstraintHeaderType,
  CoConstraintMode,
  ICoConstraint,
  ICoConstraintGroup,
  ICoConstraintGroupBindingContained,
  ICoConstraintHeader,
  ICoConstraintTable,
  ICoConstraintValueSetCell,
  ICoConstraintVariesCell,
  IDataElementHeader,
  INarrativeHeader,
} from '../../../shared/models/co-constraint.interface';
import { ICoConstraintDatatypeCell, ICoConstraintGroupBinding, ICoConstraintGroupBindingRef, ICoConstraintHeaders, ICoConstraintRequirement } from '../../../shared/models/co-constraint.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { BindingService } from '../../../shared/services/binding.service';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { RxjsStoreHelperService } from '../../../shared/services/rxjs-store-helper.service';
import { CoConstraintEntityService } from '../../services/co-constraint-entity.service';
import { DataHeaderDialogComponent } from '../data-header-dialog/data-header-dialog.component';
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
  id: number;

  @Input()
  set segment(seg: ISegment) {
    this.processTree(seg, this._igId);
  }

  @Input()
  set igId(id: string) {
    this.processTree(this._segment, id);
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

    if (this._value && datatype) {
      this.initVariesOptionList(this.coconstraintEntity.getCoConstraintRowList(this._value), datatype);
    }
  }

  get value() {
    return this._value;
  }

  @Output()
  valueChange: EventEmitter<ICoConstraintTable & ICoConstraintGroup>;

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

  locations = [
    {
      label: '1',
      value: 1,
    },
    {
      label: '4',
      value: 4,
    },
    {
      label: '10',
      value: 10,
    },
  ];

  _igId: string;
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
  variesOptionMap: {
    allowed?: any[];
    bindingInfo?: IBindingLocationInfo;
  } = {};

  constructor(
    private dialog: MatDialog,
    private segmentService: SegmentService,
    private bindingsService: BindingService,
    private coconstraintEntity: CoConstraintEntityService,
    private repository: StoreResourceRepositoryService,
    private treeService: Hl7V2TreeService) {
    this.valueChange = new EventEmitter();
  }

  initVariesOptionList(rows: ICoConstraint[], header: IDataElementHeader) {
    const obs = rows.map((row) => {
      const dt = row.cells[header.key] as ICoConstraintDatatypeCell;
      if (dt && dt.datatypeId) {
        return this.repository.getResourceDisplay(Type.DATATYPE, dt.datatypeId).pipe(
          tap((datatype) => {
            this.setAllowedVariesConstraints(row.id, datatype).pipe(
              take(1),
            ).subscribe();
          }),
        );
      } else {
        return of();
      }
    });
    RxjsStoreHelperService.forkJoin(obs).subscribe();
  }

  dispatch(action: ICoConstraintAction) {
    switch (action.type) {
      case CoConstraintAction.ADD_COCONSTRAINT:
        if (action.targetGroup) {
          if (this.value.groups.length < action.targetGroup && this.value.groups[action.targetGroup].type === CoConstraintGroupBindingType.CONTAINED) {
            this.addCoConstraint((this.value.groups[action.targetGroup] as ICoConstraintGroupBindingContained).coConstraints);
          }
        } else {
          this.addCoConstraint(this.value);
        }
        break;
      case CoConstraintAction.ADD_GROUP:
        this.addCoConstraintGroup();
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

  addImportedGroup(group: ICoConstraintGroupBindingRef) {
    this.loadGroupRef(group);
    this.value.groups.push(group);
    this.emitChange();
  }

  filterDatatype(id: string, value: string) {
    this.datatypeOptionsMap[id] = this.filter(this.datatypes, value);
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

  processTree(segment: ISegment, id: string) {
    if (segment) {
      this._segment = segment;
    }

    if (id) {
      this._igId = id;
    }

    if (segment && id) {
      this.treeService.getTree(segment, this.repository, true, true, (value) => {
        this.structure = [
          {
            data: {
              id: segment.id,
              pathId: segment.id,
              name: segment.name,
              type: segment.type,
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
  }

  getGroup(id: string): Observable<ICoConstraintGroup> {
    return this.repository.fetchResource(Type.COCONSTRAINTGROUP, id).pipe(take(1), map((elm) => elm as ICoConstraintGroup));
  }

  initOptions() {
    this.segmentService.getObx2Values(this._segment, this._igId).pipe(
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

  datatypeValueChange(value, cell, row) {
    const candidates = this.datatypes.filter((dt) => dt.fixedName === value);
    if (candidates && candidates.length > 0) {
      const found = candidates.find((dt) => dt.id === cell.datatypeId);
      if (!found) {
        if (candidates.length === 1) {
          cell.datatypeId = candidates[0].id;
          this.datatypeChange(candidates[0], row);
        } else {
          const standard = candidates.find((dt) => dt.domainInfo.scope === Scope.HL7STANDARD && dt.domainInfo.version === this._segment.domainInfo.version);
          if (standard) {
            cell.datatypeId = standard.id;
            this.datatypeChange(standard, row);
          } else {
            cell.datatypeId = null;
            this.datatypeChange(null, row);
          }
        }
      }
    } else {
      cell.datatypeId = null;
      this.datatypeChange(null, row);
    }
    this.emitChange();
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

  setTemplateType(varies: ICoConstraintVariesCell, type: CoConstraintColumnType) {
    varies.cellType = type;
    varies.cellValue = this.coconstraintEntity.createEmptyCell(type);
    this.emitChange();
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

  clearVariesCell(cell: ICoConstraintVariesCell) {
    cell.cellType = undefined;
    cell.cellValue = undefined;
    this.emitChange();
  }

  getCellTemplate(header: ICoConstraintHeader) {
    if (header.type === CoConstraintHeaderType.DATAELEMENT) {
      const dataHeader = header as IDataElementHeader;
      return this.getCellTemplateForType(dataHeader.columnType);
    } else {
      return this.narrativeTmplRef;
    }
  }

  openVsPicker(vsCell: ICoConstraintValueSetCell, dataHeader: IDataElementHeader, excludeBindingStrength: boolean, override: IBindingLocationInfo) {
    const info = dataHeader.elementInfo;
    combineLatest(
      this.bindingsService.getValueSetBindingDisplay(vsCell.bindings, this.repository),
    ).pipe(
      take(1),
      tap(([bindings]) => {
        const dialogRef = this.dialog.open(BindingSelectorComponent, {
          minWidth: '40%',
          minHeight: '40%', data: {
            excludeBindingStrength,
            resources: this.valueSets,
            locationInfo: {
              ...(override ? override : info.bindingInfo),
              singleCodeAllowed: false,
              multiple: false,
              allowSingleCode: false,
            },
            selectedValueSetBinding: bindings,
          },
        });

        dialogRef.afterClosed().subscribe(
          (result) => {
            if (result) {
              vsCell.bindings = result.selectedValueSets.map((element) => {
                return {
                  valueSets: element.valueSets.map((vs) => vs.id),
                  strength: element.bindingStrength,
                  valuesetLocations: element.bindingLocation,
                };
              });
              this.emitChange();
            }
          },
        );
      }),
    ).subscribe();
  }

  numberOfColumns() {
    const ifSize = this.listSize(this.value.headers.selectors);
    const thenSize = this.listSize(this.value.headers.constraints);
    const userSize = this.listSize(this.value.headers.narratives);

    return ifSize + thenSize + userSize;
  }

  oneOrMore(n: number): number {
    return (n === 0) ? 1 : n;
  }

  listSize(headers: ICoConstraintHeader[]) {
    let size = 0;
    headers.forEach(
      (header) => {
        if (header.type === CoConstraintHeaderType.DATAELEMENT && (header as IDataElementHeader).cardinality) {
          size += 2;
        } else {
          size++;
        }
      },
    );

    return this.oneOrMore(size);
  }

  datatypeChange(datatype: IDisplayElement, row: ICoConstraint) {
    if (this.dynamicMappingHeaders && this.dynamicMappingHeaders.varies && this.dynamicMappingHeaders.datatype) {
      this.setAllowedVariesConstraints(row.id, datatype).pipe(
        tap((allowed) => {
          if (row.cells[this.dynamicMappingHeaders.varies.key]) {
            const varies = row.cells[this.dynamicMappingHeaders.varies.key] as ICoConstraintVariesCell;
            if (!allowed.includes(varies.cellType)) {
              this.clearVariesCell(varies);
            }
          }
          this.emitChange();
        }),
      ).subscribe();
    }
  }

  setAllowedVariesConstraints(rowId: string, datatype: IDisplayElement): Observable<CoConstraintColumnType[]> {
    return datatype ? this.bindingsService.getBingdingInfo(datatype.domainInfo.version, 'OBX', datatype.fixedName, 5, Type.FIELD).pipe(
      take(1),
      map((bindingInfo) => {
        const allowed = this.getDatatypeAllowedConstraints(datatype, bindingInfo);
        this.variesOptionMap[rowId] = {
          allowed,
          bindingInfo,
        };
        return allowed;
      }),
    ) : of([]).pipe(
      map((value) => {
        this.variesOptionMap[rowId] = [];
        return value;
      }),
    );
  }

  getDatatypeAllowedConstraints(elm: IDisplayElement, bindingInfo: IBindingLocationInfo): CoConstraintColumnType[] {
    const allow = [];
    if (elm.leaf) {
      allow.push(CoConstraintColumnType.VALUE);
    }

    if (bindingInfo.allowValueSets) {
      allow.push(CoConstraintColumnType.VALUESET);
    }

    if (bindingInfo.coded) {
      allow.push(CoConstraintColumnType.CODE);
    }

    return allow;
  }

  getVsById(id: string): IDisplayElement {
    return this.valueSets.find((vs) => {
      return vs.id === id;
    });
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

    if (this.value.type === CoConstraintMode.TABLE) {
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

  }

}
