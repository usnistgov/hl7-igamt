/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";


@Component({
  selector : 'edit-simple-constraint',
  templateUrl : './edit-simpleconstraint.component.html',
  styleUrls : ['./edit-simpleconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditSimpleConstraintComponent {
  @Input() constraint : any;
  @Input() idMap : any;
  @Input() treeData : any[];
  @Input() ifVerb: boolean;
  @Input() groupName: string;

  simpleAssertionTypes: any[];
  verbs: any[];
  instanceNums : any[];
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

    this.instanceNums = this.configService._instanceNums;
    this.operators = this.configService._operators;
    this.formatTypes = this.configService._formatTypes;
    this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
  }

  addValue(){
    if(!this.constraint.complement.values) this.constraint.complement.values = [];


    this.constraint.complement.values.push('');
  }

  generateAssertionScript(constraint){
    constraint.path1 = "OBX-4[" + constraint.instanceNum + "].1[1]";
    constraint.positionPath1 = "4[" + constraint.instanceNum + "].1[1]";
    constraint.assertionScript = "<PlainText Path=\"4[" + constraint.instanceNum + "].1[1]\" Text=\"AAAA\" IgnoreCase=\"false\"/>";
  }
}
