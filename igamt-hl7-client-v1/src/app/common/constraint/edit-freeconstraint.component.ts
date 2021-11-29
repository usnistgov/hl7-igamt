/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector : 'edit-free-constraint',
  templateUrl : './edit-freeconstraint.component.html',
  styleUrls : ['./edit-freeconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditFreeConstraintComponent {
  @Input() constraint : any;
  @Input() isPredicate : boolean;
  advanced:boolean = false;
  cUsages:any;


  constructor(private configService : GeneralConfigurationService){}
  ngOnInit(){
    this.cUsages = this.configService._cUsages;
  }
}
