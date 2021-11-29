import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IChangeReason } from '../../models/save-change';
import { IChangeReasonSection } from '../../services/change-log.service';
import { ChangeReasonListDialogComponent } from '../change-reason-list-dialog/change-reason-list-dialog.component';

@Component({
  selector: 'app-change-log-list-info',
  templateUrl: './change-log-list-info.component.html',
  styleUrls: ['./change-log-list-info.component.scss'],
})
export class ChangeLogListInfoComponent implements OnInit {

  @Input()
  changes: IChangeReason[];
  @Input()
  viewOnly: boolean;
  @Output()
  editChange: EventEmitter<IChangeReason[]>;

  constructor(private dialog: MatDialog) {
    this.editChange = new EventEmitter<IChangeReason[]>();
  }

  edit(changeReason: IChangeReasonSection) {
    this.dialog.open(ChangeReasonListDialogComponent, {
      data: {
        edit: true,
        changeReason: this.changes,
      },
    }).afterClosed().subscribe((value) => {
      if (value) {
        this.editChange.emit(value);
      }
    });
  }

  delete(i: number) {
    this.changes.splice(i, 1);
    this.editChange.emit(this.changes);
  }

  ngOnInit() {
  }
}
