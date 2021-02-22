import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Assertion, BinaryOperator, NaryOperator, Operator, Pattern, Statement, UnaryOperator, SubContextOperator, OperatorType, LeafStatementType, IfThenOperator } from './cs-pattern.domain';

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
    new BinaryOperator(LeafStatementType.DECLARATION, OperatorType.OR, null, 0),
    new BinaryOperator(LeafStatementType.DECLARATION, OperatorType.AND, null, 0),
    new BinaryOperator(LeafStatementType.DECLARATION, OperatorType.XOR, null, 0),
    new UnaryOperator(LeafStatementType.DECLARATION, OperatorType.NOT, null, 0),
    new SubContextOperator(LeafStatementType.DECLARATION, null, 0),
    new NaryOperator(LeafStatementType.DECLARATION, OperatorType.ALL, null, 0),
    new NaryOperator(LeafStatementType.DECLARATION, OperatorType.EXISTS, null, 0),
    new IfThenOperator(LeafStatementType.DECLARATION, null, 0),
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
    this.dialogRef.close(new Pattern(this.pattern.assertion));
  }

  initPattern() {
    const statement = new Statement(this.condition ? LeafStatementType.PROPOSITION : LeafStatementType.DECLARATION, 0, null, 0);
    this.pattern = new Pattern(statement);
  }

  ngOnInit() {

  }

  isNary(node) {
    return node instanceof NaryOperator;
  }

  add(node: NaryOperator) {
    const statements = this.pattern.leafs;
    const st = new Statement(LeafStatementType.DECLARATION, statements.length, node, node.children.length);
    statements.push(st);
    node.putOne(st, node.children.length);
  }

  dragStartOp(event, op: Operator) {
    this.dragOp = op;
  }

  dragStartSta(event, sta: Statement) {
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
    dropOp.complete(this.pattern.leafs);

    if (dropZone.parent) {
      dropZone.parent.putOne(dropOp, positionInParent);
    } else {
      this.pattern.assertion = dropOp;
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
    const rmLeafs = node.getLeafs();
    for (const leaf of rmLeafs) {
      const i = pattern.leafs.indexOf(leaf);
      if (i !== -1) {
        pattern.leafs.splice(i);
      }
    }
  }

}
