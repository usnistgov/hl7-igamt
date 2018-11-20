/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input, ViewChild, OnInit} from "@angular/core";
import {ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";
import {PatternDialogComponent} from '../pattern-dialog/pattern-dialog.component';
import {Assertion, BinaryOperator, Pattern, Statement} from '../pattern-dialog/cs-pattern.domain';

@Component({
  selector : 'edit-complex-constraint',
  templateUrl : './edit-complexconstraint.component.html',
  styleUrls : ['./edit-complexconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditComplexConstraintComponent  implements OnInit{
  @ViewChild(PatternDialogComponent) dialog: PatternDialogComponent;
  @Input() constraint : any;
  @Input() structure : any;
  @Input() groupName: string;
  @Input() level: string;

  selected:Pattern;

  constructor(private configService : GeneralConfigurationService){}

  edit(pattern: Pattern) {
    const ctrl = this;
    if (pattern) {
      const payload = {
        pattern : pattern
      };
      this.dialog.open(payload).subscribe({
        next(p) {
          ctrl.selected = p;
        },
        complete() {
          console.log('COMPLETE');
          console.log(ctrl.selected);
        }
      });
    }else {
      this.dialog.open({ pattern: null}).subscribe({
        next(p) {
          ctrl.selected = p;
        },
        complete() {
          console.log('COMPLETE');
          console.log(ctrl.selected);
        }
      });
    }
  }

  write(pattern) {
    if (pattern && pattern.assertion) {
      return this.dialog.html(pattern.assertion.write());
    }
  }

  writeLeaf(leaf){
    
    if(leaf){
      return this.dialog.html(leaf.write());
    }
  }

  ngOnInit() {
  }
}
