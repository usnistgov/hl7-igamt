import { Component, OnInit } from '@angular/core';
import { ICoConstraintValueCell } from '../../../../shared/models/co-constraint.interface';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-value-cell',
  templateUrl: './value-cell.component.html',
  styleUrls: ['./value-cell.component.scss'],
})
export class ValueCellComponent extends CellComponent<ICoConstraintValueCell> implements OnInit {

  constructor() {
    super();
  }

  validate(cell: ICoConstraintValueCell): string[] {
    return [];
  }

  ngOnInit() {
  }

}
