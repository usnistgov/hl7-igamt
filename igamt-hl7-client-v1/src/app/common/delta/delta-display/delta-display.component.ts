import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-delta-display',
  templateUrl: './delta-display.component.html',
  styleUrls: ['./delta-display.component.css']
})
export class DeltaDisplayComponent implements OnInit {

  @ContentChild('unchanged') unchangedTmpl: TemplateRef<any>;
  @ContentChild('current') currentTmpl: TemplateRef<any>;
  @ContentChild('previous') previousTmpl: TemplateRef<any>;
  @ContentChild(TemplateRef) defaultTmpl: TemplateRef<any>;

  _op: DeltaOperation;
  _current: any;
  _previous: any;

  @Input() set operation(op: DeltaOperation) {
    this._op = op;
  }

  @Input() set currentValue(current: any) {
    this._current = current;
  }

  @Input() set previousValue(previous: any) {
    this._previous = previous;
  }

  constructor() { }

  ngOnInit() {
  }

}

export type DeltaOperation = 'UPDATED' | 'UNCHANGED' | 'ADDED' | 'DELETED';
