import {Component, OnInit, ViewChild} from '@angular/core';
import {Assertion, BinaryOperator, Pattern, Statement} from '../pattern-dialog/cs-pattern.domain';
import {PatternDialogComponent} from '../pattern-dialog/pattern-dialog.component';

@Component({
  selector: 'app-pattern-editor-demo',
  templateUrl: './pattern-editor-demo.component.html',
  styleUrls: ['./pattern-editor-demo.component.css']
})
export class PatternEditorDemoComponent implements OnInit {

  @ViewChild(PatternDialogComponent) dialog: PatternDialogComponent;
  assertions: {
    custom: Pattern[],
    predefined: Pattern[]
  } = {
    custom: [],
    predefined: []
  };

  selected: Pattern;

  constructor() { }

  startFrom(pattern: Pattern) {
    const ctrl = this;
    if (pattern && pattern.assertion) {
      const payload = {
        pattern : pattern.clone()
      };
      this.dialog.open(payload).subscribe({
        next(p) {
          ctrl.assertions.custom.push(p);
        },
        complete() {
          console.log('COMPLETE');
        }
      });
    }
  }

  edit(pattern: Pattern) {
    if (pattern) {
      const payload = {
        pattern : pattern
      };
      this.dialog.open(payload);
    }
  }

  write(assertion: Assertion) {
    if (assertion) {
      return this.dialog.html(assertion.write());
    }
  }

  create() {
    const ctrl = this;
    this.dialog.open({ pattern: null}).subscribe({
      next(p) {
        ctrl.assertions.custom.push(p);
      },
      complete() {
        console.log('COMPLETE');
      }
    });
  }

  ngOnInit() {
    const ifthen = new BinaryOperator('D', 'IF-THEN', null, 0);
    const or = new BinaryOperator('P', 'OR', null, 0);
    const st_1 = new Statement('P', 0, or, 0);
    const st_2 = new Statement('P', 1, or, 1);
    const st_3 = new Statement('D', 2, or, 1);
    ifthen.putOne(or, 0);
    ifthen.putOne(st_3, 1);
    or.putOne(st_1, 0);
    or.putOne(st_2, 1);
    this.assertions.predefined.push(new Pattern(ifthen));
  }

}
