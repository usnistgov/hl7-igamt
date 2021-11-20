import { Component, Input, OnInit } from '@angular/core';
import { Scope } from 'src/app/modules/shared/constants/scope.enum';
import { ICoConstraintDatatypeCell } from '../../../../shared/models/co-constraint.interface';
import { IDisplayElement } from '../../../../shared/models/display-element.interface';
import { ISegment } from '../../../../shared/models/segment.interface';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-datatype-cell',
  templateUrl: './datatype-cell.component.html',
  styleUrls: ['./datatype-cell.component.scss'],
})
export class DatatypeCellComponent extends CellComponent<ICoConstraintDatatypeCell> implements OnInit {

  @Input()
  datatypes: IDisplayElement[];
  @Input()
  segment: ISegment;
  @Input()
  datatypeOptions: any[];

  constructor() {
    super();
  }

  validate(cell: ICoConstraintDatatypeCell): string[] {
    return [];
  }

  datatypeValueChange(value, cell) {
    const candidates = this.datatypes.filter((dt) => dt.fixedName === value);
    if (candidates && candidates.length > 0) {
      const found = candidates.find((dt) => dt.id === cell.datatypeId);
      if (!found) {
        if (candidates.length === 1) {
          cell.datatypeId = candidates[0].id;
        } else {
          const standard = candidates.find((dt) => dt.domainInfo.scope === Scope.HL7STANDARD && dt.domainInfo.version === this.segment.domainInfo.version);
          if (standard) {
            cell.datatypeId = standard.id;
          } else {
            cell.datatypeId = null;
          }
        }
      }
    } else {
      cell.datatypeId = null;
    }
    this.emitChange();
  }

  filterDatatypeValue = (str: string, values: any[]) => {
    return values.filter((v) => str === '' || v.value.includes(str));
  }

  getDatatype(id: string): IDisplayElement {
    return this.datatypes.find((dt) => {
      return dt.id === id;
    });
  }

  ngOnInit() {
  }

}
