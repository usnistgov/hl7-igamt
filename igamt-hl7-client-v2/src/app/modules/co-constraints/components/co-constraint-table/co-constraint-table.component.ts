import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { combineLatest } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { SegmentService } from '../../../segment/services/segment.service';
import { BindingSelectorComponent } from '../../../shared/components/binding-selector/binding-selector.component';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { ICoConstraintHeaders } from '../../../shared/models/co-constraint.interface';
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
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { BindingService } from '../../../shared/services/binding.service';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { CoConstraintEntityService } from '../../services/co-constraint-entity.service';
import { DataHeaderDialogComponent } from '../data-header-dialog/data-header-dialog.component';
import { NarrativeHeaderDialogComponent } from '../narrative-header-dialog/narrative-header-dialog.component';

@Component({
  selector: 'app-co-constraint-table',
  templateUrl: './co-constraint-table.component.html',
  styleUrls: ['./co-constraint-table.component.scss'],
})
export class CoConstraintTableComponent implements OnInit {

  @Input()
  set segment(seg: ISegment) {
    this.processTree(seg, this._repository, this._igId);
  }

  @Input()
  set igId(id: string) {
    this.processTree(this._segment, this._repository, id);
  }

  @Input()
  set repository(repo: AResourceRepositoryService) {
    this.processTree(this._segment, repo, this._igId);
  }

  @Input()
  set value(table: ICoConstraintTable & ICoConstraintGroup) {
    this._value = _.cloneDeep(table);
    const datatype: IDataElementHeader = this._value.headers.constraints.find((header) => header.type === CoConstraintHeaderType.DATAELEMENT && (header as IDataElementHeader).columnType === CoConstraintColumnType.DATATYPE) as IDataElementHeader;
    const varies: IDataElementHeader = this._value.headers.constraints.find((header) => header.type === CoConstraintHeaderType.DATAELEMENT && (header as IDataElementHeader).columnType === CoConstraintColumnType.VARIES) as IDataElementHeader;
    this.dynamicMappingHeaders = {
      datatype,
      varies,
    };
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
  _repository: AResourceRepositoryService;
  _segment: ISegment;
  _value: ICoConstraintTable & ICoConstraintGroup;

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

  datatypeOptionsMap = {};
  variesOptionMap = {};

  filterDatatype(id: string, value: string) {
    this.datatypeOptionsMap[id] = this.filter(this.datatypes, value);
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

  processTree(segment: ISegment, repository: AResourceRepositoryService, id: string) {
    if (segment) {
      this._segment = segment;
    }

    if (repository) {
      this._repository = repository;
    }

    if (id) {
      this._igId = id;
    }

    if (segment && repository && id) {
      this.treeService.getTree(segment, repository, true, true, (value) => {
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

  constructor(
    private dialog: MatDialog,
    private segmentService: SegmentService,
    private bindingsService: BindingService,
    private coconstraintEntity: CoConstraintEntityService,
    private treeService: Hl7V2TreeService) {
    this.valueChange = new EventEmitter();
  }

  emitChange() {
    console.log(this.form);
    this.valueChange.emit(this.value);
  }

  initOptions() {
    this.segmentService.getObx2Values(this._segment, this._igId).pipe(
      tap((values) => {
        this.datatypeOptions = values.map((value) => {
          return {
            value,
            label: value,
          };
        });
        console.log(this.datatypeOptions);
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

  setTemplateType(varies: ICoConstraintVariesCell, type: CoConstraintColumnType) {
    varies.cellType = type;
    varies.cellValue = this.coconstraintEntity.createEmptyCell(type);
    this.emitChange();
  }

  openDataColumnDialog(list: IDataElementHeader[]) {
    const ref = this.dialog.open(DataHeaderDialogComponent, {
      data: {
        structure: this.structure,
        repository: this._repository,
        segment: this._segment,
        excludePaths: this.getDataElementPaths(this._value.headers),
      },
    });

    ref.afterClosed().subscribe(
      (header: IDataElementHeader) => {
        this.addHeaderToList(list, header);
      },
    );
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

  openVsPicker(vsCell: ICoConstraintValueSetCell, dataHeader: IDataElementHeader) {
    const info = dataHeader.elementInfo;
    combineLatest(
      this.bindingsService.getBingdingInfo(info.version, info.parent, info.datatype, info.location, info.type),
      this.bindingsService.getValueSetBindingDisplay(vsCell.bindings, this._repository),
    ).pipe(
      take(1),
      tap(([bindingInfo, bindings]) => {
        const dialogRef = this.dialog.open(BindingSelectorComponent, {
          minWidth: '40%',
          minHeight: '40%', data: {
            resources: this.valueSets,
            locationInfo: {
              ...bindingInfo,
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
                  bindingStrength: element.bindingStrength,
                  bindingLocation: element.bindingLocation,
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
      const allowed = this.getDatatypeAllowedConstraints(datatype.fixedName);
      this.variesOptionMap[row.id] = allowed;
      if (row.cells[this.dynamicMappingHeaders.varies.key]) {
        const varies = row.cells[this.dynamicMappingHeaders.varies.key] as ICoConstraintVariesCell;
        if (!allowed.includes(varies.cellType)) {
          this.clearVariesCell(varies);
        }
      }
      this.emitChange();
    }
  }

  getDatatypeAllowedConstraints(name: string): CoConstraintColumnType[] {
    if (['CE', 'CNE', 'CWE'].includes(name)) {
      return [CoConstraintColumnType.VALUESET, CoConstraintColumnType.CODE];
    } else if (['ID', 'ST', 'IS', 'FT', 'DT', 'DTM', 'TM'].includes(name)) {
      return [CoConstraintColumnType.VALUE];
    } else {
      return [];
    }
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

  deleteCoConstraintGroup(list: ICoConstraintGroup[], index: number) {
    list.splice(index, 1);
    this.emitChange();
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
