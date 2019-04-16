/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";


@Component({
  selector : 'edit-simple-proposition-constraint',
  templateUrl : './edit-simplepropositionconstraint.component.html',
  styleUrls : ['./edit-simplepropositionconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditSimplePropositionConstraintComponent {
  @Input() constraint : any;
  @Input() ifAssertion : any;
  @Input() thenAssertion : any;
  @Input() structure : any;
  @Input() groupName: string;
  @Input() level: string;

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
  }
}
