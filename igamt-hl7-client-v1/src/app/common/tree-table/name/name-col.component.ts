import {Component, Input} from "@angular/core";
@Component({
  selector : 'name-col',
  templateUrl : './name-col.component.html',
  styleUrls : ['./name-col.component.css']
})
export class NameColComponent {
  @Input() type : string;
  @Input() index : number;
  @Input() position : string;
  @Input() description : string;
  @Input() size : string;
  @Input() rowNode : any;

  constructor(){}
  ngOnInit(){}
}
