import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'datatype-readonly-col',
  templateUrl : './datatype-readonly-col.component.html',
  styleUrls : ['./datatype-readonly-col.component.css']
})

export class DatatypeReadonlyColComponent {
  @Input() ref: any;
  @Input() datatypeLabel: any;

  constructor(){}
  ngOnInit(){}
}
