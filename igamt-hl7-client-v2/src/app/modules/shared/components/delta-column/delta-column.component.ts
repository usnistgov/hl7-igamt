import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { DeltaAction } from '../../models/delta';
import { IChangeReason } from '../../models/save-change';

@Component({
  selector: 'app-delta-column',
  templateUrl: './delta-column.component.html',
  styleUrls: ['./delta-column.component.scss'],
})
export class DeltaColumnComponent implements OnInit {

  @Input()
  action: DeltaAction;
  @Input()
  currentValue: any;
  @Input()
  previousValue: any;
  @Input()
  styleClassCurrent: string;
  @Input()
  styleClassPrevious: string;
  @Input()
  styleClassUnchanged: string;
  @Input()
  reason: IChangeReason;
  @Input()
  rtl: boolean;

  @ContentChild('current')
  current: TemplateRef<any>;

  @ContentChild('previous')
  previous: TemplateRef<any>;

  @ContentChild('default')
  default: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
