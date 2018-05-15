/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";

@Component({
  selector : 'edit-free-constraint',
  templateUrl : './edit-freeconstraint.component.html',
  styleUrls : ['./edit-freeconstraint.component.css']
})
export class EditFreeConstraintComponent {
  @Input() constraint : any;

  constructor(){}
  ngOnInit(){}
}
