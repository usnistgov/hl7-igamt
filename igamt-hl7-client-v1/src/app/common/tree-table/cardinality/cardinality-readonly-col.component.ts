import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'cardinality-readonly-col',
  templateUrl : './cardinality-readonly-col.component.html',
  styleUrls : ['./cardinality-readonly-col.component.css']
})

export class CardinalityReadonlyColComponent {
  @Input() min: string;
  @Input() max: string;

  constructor(){}

  ngOnInit(){}
}