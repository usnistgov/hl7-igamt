import { Component, OnInit } from '@angular/core';
import { ICoConstraintCodeCell } from '../../../../shared/models/co-constraint.interface';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-code-cell',
  templateUrl: './code-cell.component.html',
  styleUrls: ['./code-cell.component.scss'],
})
export class CodeCellComponent extends CellComponent<ICoConstraintCodeCell> implements OnInit {

  constructor() {
    super();
  }

  validate(cell: ICoConstraintCodeCell): string[] {
    return [];
  }

  ngOnInit() {
    console.log('code', this.elementInfo);
  }

}
