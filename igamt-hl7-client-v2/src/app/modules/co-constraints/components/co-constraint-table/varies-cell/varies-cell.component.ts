import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { IBindingLocationInfo } from 'src/app/modules/shared/components/binding-selector/binding-selector.component';
import { CoConstraintColumnType, ICoConstraintVariesCell, IDataElementHeaderInfo } from '../../../../shared/models/co-constraint.interface';
import { IDisplayElement } from '../../../../shared/models/display-element.interface';
import { BindingService } from '../../../../shared/services/binding.service';
import { CoConstraintEntityService } from '../../../services/co-constraint-entity.service';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-varies-cell',
  templateUrl: './varies-cell.component.html',
  styleUrls: ['./varies-cell.component.scss'],
})
export class VariesCellComponent extends CellComponent<ICoConstraintVariesCell> implements OnInit, OnChanges {

  @Input()
  datatypeId: string;
  @Input()
  excludeBindingStrength: boolean;
  @Input()
  codeTmplRef: TemplateRef<any>;
  @Input()
  valueTmplRef: TemplateRef<any>;
  @Input()
  valueSetTmplRef: TemplateRef<any>;
  @Input()
  datatypeTmplRef: TemplateRef<any>;
  @Input()
  narrativeTmplRef: TemplateRef<any>;
  @Input()
  variesTmplRef: TemplateRef<any>;
  @Input()
  datatypes: IDisplayElement[];
  overrideElementInfo: IDataElementHeaderInfo;
  allowedColumns: CoConstraintColumnType[];

  constructor(
    private coconstraintEntity: CoConstraintEntityService,
    private bindingsService: BindingService,
  ) {
    super();
  }

  validate(cell: ICoConstraintVariesCell): string[] {
    return [];
  }

  getDatatype(id: string): IDisplayElement {
    return this.datatypes.find((dt) => {
      return dt.id === id;
    });
  }

  datatypeValueChange(datatypeId: string) {
    const dt = this.getDatatype(datatypeId);
    this.overrideElementInfo = undefined;
    this.allowedColumns = [];
    this.getHeaderInfoByDatatype(dt).pipe(
      take(1),
      tap((elementInfo) => {
        this.overrideElementInfo = elementInfo;
        if (dt && elementInfo.bindingInfo) {
          this.allowedColumns = this.getDatatypeAllowedConstraints(dt, elementInfo.bindingInfo);
        }
      }),
    ).subscribe();
  }

  getHeaderInfoByDatatype(datatype: IDisplayElement): Observable<IDataElementHeaderInfo> {
    return datatype ? this.bindingsService.getBingdingInfo(
      datatype.domainInfo.version,
      this.elementInfo.parent,
      datatype.fixedName,
      this.elementInfo.location,
      this.elementInfo.type,
    ).pipe(
      take(1),
      map((bindingInfo) => {
        return {
          ...this.elementInfo,
          version: datatype.domainInfo.version,
          datatype: datatype.fixedName,
          bindingInfo,
        };
      }),
    ) : of(this.elementInfo);
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

  setTemplateType(varies: ICoConstraintVariesCell, type: CoConstraintColumnType) {
    varies.cellType = type;
    varies.cellValue = this.coconstraintEntity.createEmptyCell(type);
    this.emitChange();
  }

  clearVariesCell(cell: ICoConstraintVariesCell) {
    cell.cellType = undefined;
    cell.cellValue = undefined;
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datatypeId']) {
      if (!changes['datatypeId'].firstChange) {
        this.clearVariesCell(this.cellValue);
      }
      this.datatypeValueChange(changes['datatypeId'].currentValue);
    }
  }

  ngOnInit() {
  }

}
