import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICoConstraint, ICoConstraintCell, IDataElementHeader, IDataElementHeaderInfo } from '../../../../shared/models/co-constraint.interface';

export abstract class CellComponent<T extends ICoConstraintCell> implements OnInit {

  @Input()
  header: IDataElementHeader;
  @Input()
  cellValue: T;
  @Input()
  elementInfo: IDataElementHeaderInfo;
  @Output()
  cellValueChange: EventEmitter<T>;
  @Input()
  viewOnly: boolean;
  @Input()
  fieldId: string;
  @Input()
  column: string;
  @Input()
  id: string;
  @Input()
  anchor: any;
  @Input()
  row: ICoConstraint;

  constructor() {
    this.cellValueChange = new EventEmitter<T>();
  }
  abstract validate(cell: T): string[];

  emitChange() {
    this.cellValueChange.emit(this.cellValue);
  }

  ngOnInit() {
  }

}
