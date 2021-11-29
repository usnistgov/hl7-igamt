import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Assertion, BinaryOperator, IfThenOperator, LeafStatementType, NaryOperator, Operator, OperatorType, Pattern, Statement, StatementIdIndex, SubContextOperator, UnaryOperator } from './cs-pattern.domain';

@Component({
  selector: 'app-pattern-dialog',
  templateUrl: './pattern-dialog.component.html',
  styleUrls: ['./pattern-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PatternDialogComponent implements OnInit {

  dragOp: Operator;
  dragSta: Statement;
  assertion: Assertion;
  backUp: Assertion;
  condition: boolean;
  operatorList = [
    new BinaryOperator(LeafStatementType.DECLARATION, OperatorType.OR, null, 0),
    new BinaryOperator(LeafStatementType.DECLARATION, OperatorType.AND, null, 0),
    new BinaryOperator(LeafStatementType.DECLARATION, OperatorType.XOR, null, 0),
    new UnaryOperator(LeafStatementType.DECLARATION, OperatorType.NOT, null, 0),
    new SubContextOperator(LeafStatementType.DECLARATION, null, 0),
    new NaryOperator(LeafStatementType.DECLARATION, OperatorType.ALL, null, 0),
    new NaryOperator(LeafStatementType.DECLARATION, OperatorType.EXISTS, null, 0),
    new IfThenOperator(LeafStatementType.DECLARATION, null, 0),
  ];
  statementIndex = new StatementIdIndex();

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PatternDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.condition = data.condition;
    if (!data.pattern) {
      this.initAssertion();
    } else {
      this.setAssertion(data.pattern.assertion);
    }

    this.backUp = this.assertion.clone(null);
  }

  setAssertion(assertion: Assertion) {
    this.assertion = assertion.clone(null);
    this.statementIndex.alignIds(this.assertion);
  }

  reset() {
    this.setAssertion(this.backUp);
  }

  cancel() {
    this.dialogRef.close();
  }

  finish() {
    this.dialogRef.close(new Pattern(this.assertion));
  }

  initAssertion() {
    this.setAssertion(new Statement(this.condition ? LeafStatementType.PROPOSITION : LeafStatementType.DECLARATION, 0, null, 0));
  }

  ngOnInit() {

  }

  isNary(node) {
    return node instanceof NaryOperator;
  }

  add(node: NaryOperator) {
    const st = new Statement(LeafStatementType.DECLARATION, this.statementIndex.useNextAvailableId(), node, node.children.length);
    node.putOne(st, node.children.length);
  }

  dragStartOp(_, op: Operator) {
    this.dragOp = op;
  }

  dragStartSta(_, sta: Statement) {
    this.dragSta = sta;
  }

  dropOp(event, dropZone: Statement) {
    const dropNode = this.dragOp;

    // -- Can't drop an IF-THEN in a preposition
    if (dropZone.data.branch === LeafStatementType.PROPOSITION && dropNode.data.type === OperatorType.IF_THEN) {
      return;
    }

    const positionInParent = dropZone.data.position;
    const dropOp = this.dragOp.clone(dropZone.parent);
    dropOp.data.branch = this.condition ? LeafStatementType.PROPOSITION : dropZone.data.branch;
    const dropZoneClone = dropZone.clone(dropOp);

    if (dropOp.data.type === OperatorType.IF_THEN) {
      dropZoneClone.data.branch = LeafStatementType.PROPOSITION;
    }

    dropOp.putOne(dropZoneClone, 0);
    dropOp.complete(this.statementIndex);

    if (dropZone.parent) {
      dropZone.parent.putOne(dropOp, positionInParent);
    } else {
      this.assertion = dropOp;
    }
  }

  dropSta(_, node: Assertion) {
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
      node.parent.resetOne(node.data.position, this.statementIndex);
      this.statementIndex.alignIds(this.assertion);
    } else {
      this.initAssertion();
    }
  }

  dragEndOp(_) {
    this.dragOp = null;
  }

  dragEndSta(_) {
    this.dragSta = null;
  }

  public html(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }

}
