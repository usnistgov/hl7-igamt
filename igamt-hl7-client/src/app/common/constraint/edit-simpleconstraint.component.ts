/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'edit-simple-constraint',
  templateUrl : './edit-simpleconstraint.component.html',
  styleUrls : ['./edit-simpleconstraint.component.css']
})
export class EditSimpleConstraintComponent {
  @Input() constraint : any;
  @Input() idMap : any;
  @Input() treeData : any[];
  @Input() ifVerb: boolean;
  simpleAssertionTypes: any[];
  verbs: any[];
  operators: any[];
  formatTypes:any[];

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    if(!this.constraint.complement) this.constraint.complement = {};
    if(!this.constraint.subject) this.constraint.subject = {};
    if(this.ifVerb){
      this.verbs = this.configService._ifConstraintVerbs;
    }else{
      this.verbs = this.configService._simpleConstraintVerbs;
    }
    this.operators = this.configService._operators;
    this.formatTypes = this.configService._formatTypes;
    this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
  }

  addValue(){
    if(!this.constraint.complement.values) this.constraint.complement.values = [];


    this.constraint.complement.values.push('');
  }
}
