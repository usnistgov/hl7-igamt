import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Type } from '../../constants/type.enum';
import { IChangeReasonSection } from '../../services/change-log.service';
import { IBindingContext } from '../../services/structure-element-binding.service';
import { ChangeReasonDialogComponent } from '../change-reason-dialog/change-reason-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-change-log-info',
  templateUrl: './change-log-info.component.html',
  styleUrls: ['./change-log-info.component.scss'],
})
export class ChangeLogInfoComponent implements OnInit {
  @Input()
  sections: IChangeReasonSection[];
  @Input()
  viewOnly: boolean;
  @Input()
  context: IBindingContext;
  @Output()
  editChange: EventEmitter<IChangeReasonSection>;

  constructor(private dialog: MatDialog) {
    this.editChange = new EventEmitter<IChangeReasonSection>();
  }

  contextIsEqual(a: Type, b: IBindingContext): boolean {
    return undefined === b.element && a === b.resource;
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
        context: changeReason.context,
      });
    });
  }

  delete(changeReason: IChangeReasonSection) {
    this.editChange.emit({
      property: changeReason.property,
      reason: undefined,
      date: undefined,
      context: changeReason.context,
    });
  }

  ngOnInit() {
  }

}
