import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { DeltaAction, IDelta } from '../../models/delta';

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
