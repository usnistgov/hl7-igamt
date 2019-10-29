import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { combineLatest, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { SegmentService } from '../../../segment/services/segment.service';
import { BindingSelectorComponent } from '../../../shared/components/binding-selector/binding-selector.component';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { CoConstraintColumnType, CoConstraintHeaderType, ICoConstraint, ICoConstraintGroup, ICoConstraintHeader, ICoConstraintTable, ICoConstraintValueSetCell, ICoConstraintVariesCell, IDataElementHeader } from '../../../shared/models/co-constraint.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { BindingService } from '../../../shared/services/binding.service';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { CoConstraintEntityService } from '../../services/co-constraint-entity.service';
import { DataHeaderDialogComponent } from '../data-header-dialog/data-header-dialog.component';

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
  usages = [
    {
      label: 'O',
      value: 'O',
    },
    {
      label: 'R',
      value: 'R',
    },
  ];

  @Input()
  _igId: string;
  @Input()
  value: ICoConstraintTable | ICoConstraintGroup;
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  datatypes: IDisplayElement[];
  _repository: AResourceRepositoryService;
  _segment: ISegment;
  structure: IHL7v2TreeNode[];

  @ViewChild('codeCell')
  codeTmplRef: TemplateRef<any>;
  @ViewChild('valueCell')
  valueTmplRef: TemplateRef<any>;
  @ViewChild('valueSetCell')
  valueSetTmplRef: TemplateRef<any>;
  @ViewChild('datatypeCell')
  datatypeTmplRef: TemplateRef<any>;
  @ViewChild('variesCell')
  variesTmplRef: TemplateRef<any>;

  datatypeOptions = [];

  filter(values: IDisplayElement[], value: string) {
    return values.filter((v) => {
      return v.fixedName === value;
    });
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
    private treeService: Hl7V2TreeService) { }

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
  }

  openDataColumnDialog(list: IDataElementHeader[]) {
    const ref = this.dialog.open(DataHeaderDialogComponent, {
      data: {
        structure: this.structure,
        repository: this._repository,
        segment: this._segment,
      },
    });

    ref.afterClosed().subscribe(
      (header: IDataElementHeader) => {
        if (header) {
          list.push(header);
          this.coconstraintEntity.addColumn(header, this.value);
        }
      },
    );
  }

  getCellTemplate(header: ICoConstraintHeader) {
    if (header.type === CoConstraintHeaderType.DATAELEMENT) {
      const dataHeader = header as IDataElementHeader;
      return this.getCellTemplateForType(dataHeader.columnType);
    }
  }

  openVsPicker(vsCell: ICoConstraintValueSetCell, dataHeader: IDataElementHeader) {
    const info = dataHeader.elementInfo;
    combineLatest(
      this.bindingsService.getBingdingInfo(info.version, info.parent, info.elementName, info.location, info.type),
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
            vsCell.bindings = result.selectedValueSets.map((element) => {
              return {
                valueSets: element.valueSets.map((vs) => vs.id),
                bindingStrength: element.bindingStrength,
                bindingLocation: element.bindingLocation,
              };
            });
            console.log(vsCell);
          },
        );
      }),
    ).subscribe();
  }

  numberOfColumns() {
    const ifSize = this.value.headers.selectors.length;
    const thenSize = this.value.headers.constraints.length;
    const userSize = this.value.headers.narratives.length;

    const oneOrMore = (n: number): number => {
      return (n === 0) ? 1 : n;
    };

    return oneOrMore(ifSize) + oneOrMore(thenSize) + oneOrMore(userSize);
  }

  getVsById(id: string): IDisplayElement {
    return this.valueSets.find((vs) => {
      return vs.id === id;
    });
  }

  addCoConstraint(list) {
    const cc = this.coconstraintEntity.createEmptyCoConstraint(this.value.headers);
    list.push(cc);
  }

  addCoConstraintGroup(list: ICoConstraint[]) {
    const group = this.coconstraintEntity.createEmptyContainedGroupBinding();
    (this.value as ICoConstraintTable).groups.push(group);
  }

  ngOnInit() {

  }

}
