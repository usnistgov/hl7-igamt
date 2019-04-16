import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'conflength-readonly-col',
  templateUrl : './conflength-readonly-col.component.html',
  styleUrls : ['./conflength-readonly-col.component.css']
})

export class ConfLengthReadonlyColComponent {
  @Input() leaf: boolean;
  @Input() confLength: string;

  constructor(){}

  ngOnInit(){}
}