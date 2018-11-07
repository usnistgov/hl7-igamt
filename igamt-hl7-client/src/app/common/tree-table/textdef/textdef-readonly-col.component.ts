import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'textdef-readonly-col',
  templateUrl : './textdef-readonly-col.component.html',
  styleUrls : ['./textdef-readonly-col.component.css']
})

export class TextdefReadonlyColComponent {
  @Input() text: string;

  constructor(){}

  ngOnInit(){
  }
}