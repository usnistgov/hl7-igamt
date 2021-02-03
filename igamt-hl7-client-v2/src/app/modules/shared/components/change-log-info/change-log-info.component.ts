import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IChangeReason, PropertyType } from '../../models/save-change';
import { ChangeReasonDialogComponent } from '../change-reason-dialog/change-reason-dialog.component';

export interface IChangeReasonSection extends IChangeReason {
  property: PropertyType;
}

@Component({
  selector: 'app-change-log-info',
  templateUrl: './change-log-info.component.html',
  styleUrls: ['./change-log-info.component.scss'],
})
export class ChangeLogInfoComponent implements OnInit {

  @Input()
  sections: IChangeReasonSection[];
  @Input()
  viewOnly: boolean;
  @Output()
  editChange: EventEmitter<IChangeReasonSection>;

  constructor(private dialog: MatDialog) {
    this.editChange = new EventEmitter<IChangeReasonSection>();
  }

  edit(changeReason: IChangeReasonSection) {
    this.dialog.open(ChangeReasonDialogComponent, {
      data: {
        edit: true,
        caption: changeReason.property,
        changeReason,
      },
    }).afterClosed().subscribe((value) => {
      this.editChange.emit({
        property: changeReason.property,
        reason: value ? value.reason : undefined,
        date: value ? value.date : undefined,
      });
    });
  }

  delete(property: PropertyType) {
    this.editChange.emit({
      property,
      reason: undefined,
      date: undefined,
    });
  }

  ngOnInit() {
  }

}
