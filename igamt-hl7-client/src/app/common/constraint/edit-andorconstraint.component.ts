/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'edit-andor-constraint',
  templateUrl : './edit-andorconstraint.component.html',
  styleUrls : ['./edit-andorconstraint.component.css']
})
export class EditAndOrConstraintComponent {
  @Input() constraint : any;
  @Input() idMap : any;
  @Input() treeData : any[];
  @Input() ifVerb: boolean;
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

  changeOperator(){
    console.log("ANDOR Operator changed!");
    if(!this.constraint.assertions) this.constraint.assertions = [];
  }

  addConstraint() {
    this.constraint.assertions.push({mode : 'SIMPLE'});
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
