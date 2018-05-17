/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector : 'edit-free-constraint',
  templateUrl : './edit-freeconstraint.component.html',
  styleUrls : ['./edit-freeconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditFreeConstraintComponent {
  @Input() constraint : any;

  constructor(){}
  ngOnInit(){}
}
