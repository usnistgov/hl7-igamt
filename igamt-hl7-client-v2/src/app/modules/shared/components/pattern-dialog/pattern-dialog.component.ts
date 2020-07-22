import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Assertion, BinaryOperator, NaryOperator, Operator, Pattern, Statement, UnaryOperator } from './cs-pattern.domain';

@Component({
  selector: 'app-pattern-dialog',
  templateUrl: './pattern-dialog.component.html',
  styleUrls: ['./pattern-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PatternDialogComponent implements OnInit {

  dragOp: Operator;
  dragSta: Statement;
  pattern: Pattern = null;
  backUp: Pattern;
  condition: boolean;
  operatorList = [
    new BinaryOperator('D', 'OR', null, 0),
    new BinaryOperator('D', 'AND', null, 0),
    new BinaryOperator('D', 'XOR', null, 0),
    new UnaryOperator('D', 'NOT', null, 0),
    new NaryOperator('D', 'ALL', null, 0),
    new NaryOperator('D', 'EXISTS', null, 0),
    new BinaryOperator('D', 'IF-THEN', null, 0),
  ];

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PatternDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.condition = data.condition;
    if (!data.pattern) {
      this.initPattern();
    } else {
      this.pattern = data.pattern;
    }

    this.backUp = this.pattern.clone();
  }

  reset() {
    this.pattern = this.backUp.clone();
  }

  cancel() {
    this.dialogRef.close();
  }

  finish() {
    const leafs = [];
    if (this.pattern.assertion instanceof Statement) {
      this.pattern.leafs = [this.pattern.assertion];
    } else {
      this.pattern.leafs = this.getLeafs(this.pattern.assertion as Operator);
    }
    this.dialogRef.close(this.pattern);
  }

  initPattern() {
    const statement = new Statement(this.condition ? 'P' : 'D', 0, null, 0);
    this.pattern = new Pattern(statement);
  }

  ngOnInit() {

  }

  isNary(node) {
    return node instanceof NaryOperator;
  }

  add(node: NaryOperator) {
    const statements = this.pattern.leafs;
    const st = new Statement('D', statements.length, node, node.children.length);
    statements.push(st);
    node.putOne(st, node.children.length);
  }

  dragStartOp(event, op: Operator) {
    this.dragOp = op;
  }

  dragStartSta(event, sta: Statement) {
    this.dragSta = sta;
  }

  dropOp(event, node: Statement) {

    // -- Can't drop an IF-THEN in a preposition
    if (node.data.type === 'P' && this.dragOp.data.type === 'IF-THEN') {
      return;
    }

    const that = node;
    const positionInParent = that.data.position;
    const op = this.dragOp.clone(that.parent);
    op.data.branch = this.condition ? 'P' : node.data.type;

    const cloneOfThis = that.clone(op);
    if (op.data.type === 'IF-THEN') {
      cloneOfThis.data.type = 'P';
    }

    op.putOne(cloneOfThis, 0);
    op.complete(this.pattern.leafs);

    if (that.parent) {
      that.parent.putOne(op, positionInParent);
    } else {
      this.pattern.assertion = op;
    }
  }

  dropSta(event, node: Assertion) {
    const destination_parent = node.parent;
    const d_i = node.data.position;
    const d = this.dragSta.clone(destination_parent);
    destination_parent.putOne(d, d_i);

    const source_parent = this.dragSta.parent;
    const s_i = this.dragSta.data.position;
    const s = node.clone(source_parent);
    source_parent.putOne(s, s_i);
  }

  remove(node: any) {
    if (node.parent) {
      node.parent.children.splice(node.data.position);
      this.removeLeafs(this.pattern, node);
      node.parent.complete(this.pattern.leafs);
    } else {
      this.initPattern();
    }
  }

  dragEndOp(event) {
    this.dragOp = null;
  }

  dragEndSta(event) {
    this.dragSta = null;
  }

  public html(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }

  removeLeafs(pattern: Pattern, node: Operator) {
    const rmLeafs = this.getLeafs(node);
    for (const leaf of rmLeafs) {
      const i = pattern.leafs.indexOf(leaf);
      if (i !== -1) {
        pattern.leafs.splice(i);
      }
    }
  }

  getLeafs(op: Operator) {
    const leafs = [];
    for (const child of op.children) {
      if (child instanceof Statement) {
        leafs.push(child);
      } else {
        leafs.push.apply(leafs, this.getLeafs(child));
      }
    }
    return leafs;
  }

}
