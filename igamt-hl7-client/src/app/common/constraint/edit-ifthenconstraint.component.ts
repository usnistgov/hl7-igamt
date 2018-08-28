/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'edit-ifthen-constraint',
  templateUrl : './edit-ifthenconstraint.component.html',
  styleUrls : ['./edit-ifthenconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditIfThenConstraintComponent {
  @Input() constraint : any;
  @Input() idMap : any;
  @Input() treeData : any[];
  @Input() groupName: string;
  simpleAssertionTypes: any[];
  verbs: any[];
  operators: any[];
  formatTypes:any[];
  andorOptions:any[];
  assertionModes:any[];

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){

    this.assertionModes = this.configService._assertionModes;
    this.andorOptions = [
      {label: 'AND', value: 'AND'},
      {label: 'OR', value: 'OR'}
    ];
    this.verbs = this.configService._simpleConstraintVerbs;
    this.operators = this.configService._operators;
    this.formatTypes = this.configService._formatTypes;
    this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
  }

  makeConstraintMode(constraint) {
    constraint.complement = undefined;
    constraint.subject = undefined;
    constraint.assertions = undefined;
    constraint.child = undefined;
    constraint.ifAssertion = undefined;
    constraint.thenAssertion = undefined;
    constraint.operator = undefined;
    constraint.verbKey = undefined;

    if(constraint.mode === 'ANDOR'){
      constraint.child = undefined;
      constraint.ifAssertion = undefined;
      constraint.thenAssertion = undefined;
      constraint.operator = 'AND';
      constraint.assertions = [];
      constraint.assertions.push({
        "mode": "SIMPLE"
      });

      constraint.assertions.push({
        "mode": "SIMPLE"
      });
    }else if(constraint.mode === 'NOT'){
      constraint.assertions = undefined;
      constraint.ifAssertion = undefined;
      constraint.thenAssertion = undefined;
      constraint.child = {
        "mode": "SIMPLE"
      };
    }else if(constraint.mode === 'IFTHEN'){
      constraint.assertions = undefined;
      constraint.child = undefined;
      constraint.ifAssertion = {
        "mode": "SIMPLE"
      };
      constraint.thenAssertion = {
        "mode": "SIMPLE"
      };
    }
  }
}
