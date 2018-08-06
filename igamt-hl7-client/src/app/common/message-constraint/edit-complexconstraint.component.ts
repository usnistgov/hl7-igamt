/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'edit-complex-constraint',
  templateUrl : './edit-complexconstraint.component.html',
  styleUrls : ['./edit-complexconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditComplexConstraintComponent {
  @Input() constraint : any;
  @Input() idMap : any;
  @Input() treeData : any[];
  @Input() limited : boolean;
  @Input() ifVerb: boolean;
  @Input() groupName: string;

  verbs: any[];
  operators: any[];
  formatTypes:any[];

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    this.verbs = this.configService._simpleConstraintVerbs;
    this.operators = this.configService._operators;
    this.formatTypes = this.configService._formatTypes;
  }
}
