/**
 * Created by hnt5 on 10/26/17.
 */
import {Component, Input} from "@angular/core";
@Component({
  selector : 'display-badge',
  templateUrl : './display-badge.component.html',
  styleUrls : ['./display-badge.component.css']
})
export class DisplayBadgeComponent {
  @Input() type : string;
  @Input() size : string;

  constructor(){}
  ngOnInit(){}
}
