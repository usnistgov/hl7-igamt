/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'edit-not-constraint',
  templateUrl : './edit-notconstraint.component.html',
  styleUrls : ['./edit-notconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditNotConstraintComponent {
  @Input() constraint : any;
  @Input() idMap : any;
  @Input() treeData : any[];
  @Input() ifVerb:any[];
  @Input() groupName: string;
  partialComplexAssertionTypes: any[];
  simpleAssertionTypes: any[];
  verbs: any[];
  operators: any[];
  formatTypes:any[];
  andorOptions:any[];
  assertionModes:any[];

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    this.andorOptions = [
      {label: 'AND', value: 'AND'},
      {label: 'OR', value: 'OR'}
    ];
    this.verbs = this.configService._simpleConstraintVerbs;
    this.operators = this.configService._operators;
    this.formatTypes = this.configService._formatTypes;
    this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
    this.partialComplexAssertionTypes = this.configService._partialComplexAssertionTypes;
    this.assertionModes = this.configService._assertionModes;
  }

  makeConstraintMode(constraint) {
    constraint.complement = undefined;
    constraint.subject = undefined;
    constraint.complexAssertionType = undefined;
    constraint.assertions = undefined;
    constraint.child = undefined;
    constraint.ifAssertion = undefined;
    constraint.thenAssertion = undefined;
    constraint.operator = undefined;
    constraint.verbKey = undefined;
  }
}
