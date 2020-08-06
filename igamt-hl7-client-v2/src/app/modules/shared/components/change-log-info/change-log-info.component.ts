import { Component, Input, OnInit } from '@angular/core';
import { IChangeLog, IChangeReason, PropertyType } from '../../models/save-change';

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
  sections: PropertyType[];

  constructor() { }

  ngOnInit() {
  }

}
