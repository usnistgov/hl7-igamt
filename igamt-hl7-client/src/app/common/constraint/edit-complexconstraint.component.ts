/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'edit-complex-constraint',
  templateUrl : './edit-complexconstraint.component.html',
  styleUrls : ['./edit-complexconstraint.component.css']
})
export class EditComplexConstraintComponent {
  @Input() constraint : any;
  @Input() idMap : any;
  @Input() treeData : any[];
  @Input() limited : boolean;
  @Input() ifVerb: boolean;
  complexAssertionTypes: any[];
  simpleAssertionTypes: any[];
  verbs: any[];
  operators: any[];
  formatTypes:any[];

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    this.verbs = this.configService._simpleConstraintVerbs;
    this.operators = this.configService._operators;
    this.formatTypes = this.configService._formatTypes;
    this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
    if(this.limited){
      this.complexAssertionTypes = this.configService._partialComplexAssertionTypes;
    }else {
      this.complexAssertionTypes = this.configService._complexAssertionTypes;
    }

  }

  changeComplexAssertionType(){
    if(this.constraint.complexAssertionType === 'ANDOR'){
      this.constraint.child = undefined;
      this.constraint.ifAssertion = undefined;
      this.constraint.thenAssertion = undefined;
      this.constraint.assertions = [];
      this.constraint.assertions.push({
        "mode": "SIMPLE"
      });

      this.constraint.assertions.push({
        "mode": "SIMPLE"
      });
    }else if(this.constraint.complexAssertionType === 'NOT'){
      this.constraint.assertions = undefined;
      this.constraint.ifAssertion = undefined;
      this.constraint.thenAssertion = undefined;
      this.constraint.child = {
        "mode": "SIMPLE"
      };
    }else if(this.constraint.complexAssertionType === 'IFTHEN'){
      this.constraint.assertions = undefined;
      this.constraint.child = undefined;
      this.constraint.ifAssertion = {
        "mode": "SIMPLE"
      };
      this.constraint.thenAssertion = {
        "mode": "SIMPLE"
      };
    }
  }
}
