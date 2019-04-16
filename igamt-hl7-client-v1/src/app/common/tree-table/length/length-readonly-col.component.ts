import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'length-readonly-col',
  templateUrl : './length-readonly-col.component.html',
  styleUrls : ['./length-readonly-col.component.css']
})

export class LengthReadonlyColComponent {
  @Input() minLength: string;
  @Input() maxLength: string;
  @Input() leaf: boolean;

  constructor(){}

  ngOnInit(){}
}