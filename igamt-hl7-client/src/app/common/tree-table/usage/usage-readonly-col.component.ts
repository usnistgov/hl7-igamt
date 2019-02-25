/**
 * Created by hnt5 on 10/26/17.
 */
import {Component, Input} from "@angular/core";
@Component({
  selector : 'usage-readonly-col',
  templateUrl : './usage-readonly-col.component.html',
  styleUrls : ['./usage-readonly-col.component.css']
})
export class UsageReadonlyColComponent {
  @Input() usage: string;
  @Input() trueUsage: string;
  @Input() falseUsage: string;
  @Input() bindings: any[];
  @Input() idPath : string;


  constructor(){}
  ngOnInit(){
  }
}
