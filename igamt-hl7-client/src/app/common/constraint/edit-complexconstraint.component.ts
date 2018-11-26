/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input, ViewChild, OnInit} from "@angular/core";
import {ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";
import {PatternDialogComponent} from '../pattern-dialog/pattern-dialog.component';
import {Assertion, BinaryOperator, Pattern, Statement, Operator} from '../pattern-dialog/cs-pattern.domain';

import { _ } from 'underscore';

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

  propsotions:any[] = [];
  declarations:any[] = [];

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
          ctrl.updateStatements();
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
          ctrl.updateStatements();
        }
      });
    }
  }

  write(pattern) {
    if (pattern && pattern.assertion) {
      return this.dialog.html(pattern.assertion.write());
    }
  }

  updateStatements(){
    this.declarations = [];
    this.propsotions = [];

    if(this.selected) this.constraint.assertion = this.generateAssertion(this.selected.assertion);

    // for(let item of this.selected.leafs){
    //   if(item.data.type === 'D'){
    //     this.declarations.push({mode:"SIMPLE", id:"DECLARATION_" + (item.data.id + 1)});
    //   }else if(item.data.type === 'P'){
    //     this.propsotions.push({mode:"SIMPLE", id:"PROPOSITION_" + (item.data.id + 1)});
    //   }
    // }
  }

  generateAssertion(current){
    if(current.data.type === 'IF-THEN'){
      let a:any = {mode:"IFTHEN"};
      a.ifAssertion = this.generateAssertion(_.find(current.children, function(child){ return child.data.position === 0; }));
      a.thenAssertion = this.generateAssertion(_.find(current.children, function(child){ return child.data.position === 1; }));
      return a;
    }else if(current.data.type === 'OR'){
      let a:any  = {mode:"ANDOR"};
      a.operator = 'OR';
      a.assertions = [];
      a.assertions.push(this.generateAssertion(_.find(current.children, function(child){ return child.data.position === 0; })));
      a.assertions.push(this.generateAssertion(_.find(current.children, function(child){ return child.data.position === 1; })));
      return a;
    }else if(current.data.type === 'AND'){
      let a:any  = {mode:"ANDOR"};
      a.operator = 'AND';
      a.assertions = [];
      a.assertions.push(this.generateAssertion(_.find(current.children, function(child){ return child.data.position === 0; })));
      a.assertions.push(this.generateAssertion(_.find(current.children, function(child){ return child.data.position === 1; })));
      return a;
    }else if(current.data.type === 'XOR'){
      let a:any  = {mode:"ANDOR"};
      a.operator = 'XOR';
      a.assertions = [];
      a.assertions.push(this.generateAssertion(_.find(current.children, function(child){ return child.data.position === 0; })));
      a.assertions.push(this.generateAssertion(_.find(current.children, function(child){ return child.data.position === 1; })));
      return a;
    }else if(current.data.type === 'ALL'){
      let a:any  = {mode:"ANDOR"};
      a.operator = 'AND';
      a.assertions = [];
      for (var i = 0; i < current.children.length; i++) {
        a.assertions.push(this.generateAssertion(_.find(current.children, function(child){ return child.data.position === i; })));
      }
      return a;
    }else if(current.data.type === 'EXISTS'){
      let a:any  = {mode:"ANDOR"};
      a.operator = 'OR';
      a.assertions = [];
      for (var i = 0; i < current.children.length; i++) {
        a.assertions.push(this.generateAssertion(_.find(current.children, function(child){ return child.data.position === i; })));
      }
      return a;
    }else if(current.data.type === 'NOT'){
      let a:any  = {mode:"NOT"};
      a.child = this.generateAssertion(_.find(current.children, function(child){ return child.data.position === i; }));
      return a;
    }else if(current.data.type === 'P'){
      let a:any  = {mode:"SIMPLE"};
      a.id = "PROPOSITION_" + (current.data.id + 1);
      this.propsotions.push(a);
      return a;
    }else if(current.data.type === 'D'){
      let a:any  = {mode:"SIMPLE"};
      a.id = "DECLARATION_" + (current.data.id + 1);
      this.declarations.push(a);
      return a;
    }
    return null;
  }

  ngOnInit() {
    this.declarations = [];
    this.propsotions = [];
    console.log(this.constraint);
    var pattern = this.load(this.constraint.assertion, 'D', null, 0);
    console.log(pattern);
    if(pattern) this.selected = new Pattern(pattern);
    console.log(this.selected);
  }

  load(assertion, parentType, parent: Operator, position:number){
    if(parent){
      var id = this.propsotions.length + this.declarations.length;

      if(assertion.mode === 'SIMPLE'){
        if(parentType === 'P') {
          assertion.id = "PROPOSITION_" + (id + 1);
          this.propsotions.push(assertion);
          const st_1 = new Statement('P', id, parent, position);
          parent.putOne(st_1, position);
        }else if(parentType === 'D') {
          assertion.id = "DECLARATION_" + (id + 1);
          this.declarations.push(assertion);
          const st_1 = new Statement('D', id, parent, position);
          parent.putOne(st_1, position);
        }
      }else if(assertion.mode === 'IFTHEN'){
        const ifthen = new BinaryOperator(parentType, 'IF-THEN', parent, position); ////branch: StatementType, type: OperatorType, parent: Operator, position: number
        var ifAssertion = assertion.ifAssertion;
        var thenAssertion = assertion.thenAssertion;
        if(ifAssertion && thenAssertion){
          this.load(ifAssertion, parentType, ifthen, 0);
          this.load(thenAssertion, parentType, ifthen, 1);
          parent.putOne(ifthen, position);
        }
      }else if(assertion.mode === 'NOT'){
        const not = new BinaryOperator(parentType, 'NOT', null, position);
        var notAssertion = assertion.child;
        if(notAssertion){
          this.load(notAssertion, parentType, not, 0);
          parent.putOne(not, position);
        }
      }else if(assertion.mode === 'ANDOR'){
        var assertions = assertion.assertions;
        if(assertion.operator === 'AND'){
          if(assertions.length === 2){
            const and = new BinaryOperator(parentType, 'AND', null, position);
            this.load(assertions[0], parentType, and, 0);
            this.load(assertions[1], parentType, and, 1);
            parent.putOne(and, position);
          }else if (assertions.length > 2){
            const all = new BinaryOperator(parentType, 'ALL', null, position);
            for (var i = 0; i < assertions.length; i++) {
              this.load(assertions[i], parentType, all, i);
            }
            parent.putOne(all, position);
          }
        }else if(assertion.operator === 'OR'){
          if(assertions.length === 2){
            const or = new BinaryOperator(parentType, 'OR', null, position);
            this.load(assertions[0], parentType, or, 0);
            this.load(assertions[1], parentType, or, 1);
            parent.putOne(or, position);
          }else if (assertions.length > 2){
            const exists = new BinaryOperator(parentType, 'EXISTS', null, position);
            for (var i = 0; i < assertions.length; i++) {
              this.load(assertions[i], parentType, exists, i);
            }
            parent.putOne(exists, position);
          }
        }else if(assertion.operator === 'XOR'){
          if(assertions.length === 2){
            const xor = new BinaryOperator(parentType, 'XOR', null, position);
            this.load(assertions[0], parentType, xor, 0);
            this.load(assertions[1], parentType, xor, 1);
            parent.putOne(xor, position);
          }
        }
      }
    }else {
      if(assertion.mode === 'IFTHEN'){
        const ifthen = new BinaryOperator('D', 'IF-THEN', null, 0);
        var ifAssertion = assertion.ifAssertion;
        var thenAssertion = assertion.thenAssertion;
        if(ifAssertion && thenAssertion){
          this.load(ifAssertion, 'P', ifthen, 0);
          this.load(thenAssertion, 'D', ifthen, 1);
          return ifthen;
        }
      }else if(assertion.mode === 'NOT'){
        const not = new BinaryOperator('D', 'NOT', null, 0);
        var notAssertion = assertion.child;
        if(notAssertion){
          this.load(notAssertion, 'D', not, 0);
          return not;
        }
      }else if(assertion.mode === 'ANDOR'){
        var assertions = assertion.assertions;
        if(assertion.operator === 'AND'){
          if(assertions.length === 2){
            const and = new BinaryOperator('D', 'AND', null, 0);
            this.load(assertions[0], 'D', and, 0);
            this.load(assertions[1], 'D', and, 1);
            return and;
          }else if (assertions.length > 2){
            const all = new BinaryOperator('D', 'ALL', null, 0);
            for (var i = 0; i < assertions.length; i++) {
              this.load(assertions[i], 'D', all, i);
            }
            return all;
          }
        }else if(assertion.operator === 'OR'){
          if(assertions.length === 2){
            const or = new BinaryOperator('D', 'OR', null, 0);
            this.load(assertions[0], 'D', or, 0);
            this.load(assertions[1], 'D', or, 1);
            return or;
          }else if (assertions.length > 2){
            const exists = new BinaryOperator('D', 'EXISTS', null, 0);
            for (var i = 0; i < assertions.length; i++) {
              this.load(assertions[i], 'D', exists, i);
            }
            return exists;
          }
        }else if(assertion.operator === 'XOR'){
          if(assertions.length === 2){
            const xor = new BinaryOperator('D', 'XOR', null, 0);
            this.load(assertions[0], 'D', xor, 0);
            this.load(assertions[1], 'D', xor, 1);
            return xor;
          }
        }
      }
    }
    return null;
  }
}
