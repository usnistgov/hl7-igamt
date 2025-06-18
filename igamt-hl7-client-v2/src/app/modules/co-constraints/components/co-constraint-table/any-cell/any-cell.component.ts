import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CoConstraintColumnType, ICoConstraintAnyCell } from '../../../../shared/models/co-constraint.interface';
import { CellComponent } from '../cell/cell.component';
import { CoConstraintEntityService } from '../../../services/co-constraint-entity.service';
import { BindingService } from 'src/app/modules/shared/services/binding.service';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IBindingLocationInfo } from 'src/app/modules/shared/components/binding-selector/binding-selector.component';

@Component({
  selector: 'app-any-cell',
  templateUrl: './any-cell.component.html',
  styleUrls: ['./any-cell.component.scss'],
})
export class AnyCellComponent extends CellComponent<ICoConstraintAnyCell> implements OnInit {

  @Input()
  excludeBindingStrength: boolean;
  @Input()
  codeTmplRef: TemplateRef<any>;
  @Input()
  valueSetTmplRef: TemplateRef<any>;
  @Input()
  valueTmplRef: TemplateRef<any>;
  @Input()
  datatypes: IDisplayElement[];
  allowedColumns: CoConstraintColumnType[];

  constructor(
    private coconstraintEntity: CoConstraintEntityService,
    private bindingsService: BindingService,
  ) {
    super();
  }

  validate(cell: ICoConstraintAnyCell): string[] {
    return [];
  }

  clearCell(cell: ICoConstraintAnyCell) {
    cell.cellType = undefined;
    cell.cellValue = undefined;
    this.emitChange();
  }

  getCellTemplateForType(type: CoConstraintColumnType) {
    switch (type) {
      case CoConstraintColumnType.CODE:
        return this.codeTmplRef;
      case CoConstraintColumnType.VALUESET:
        return this.valueSetTmplRef;
      case CoConstraintColumnType.VALUE:
        return this.valueTmplRef;
    }
  }

  setTemplateType(varies: ICoConstraintAnyCell, type: CoConstraintColumnType) {
    varies.cellType = type;
    varies.cellValue = this.coconstraintEntity.createEmptyCell(type);
    this.emitChange();
  }

  getDatatype(id: string): IDisplayElement {
    return this.datatypes.find((dt) => {
      return dt.id === id;
    });
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

  ngOnInit() {
    this.allowedColumns = this.getDatatypeAllowedConstraints(this.getDatatype(this.elementInfo.datatypeId), this.elementInfo.bindingInfo);
  }
}
