import {TreeNode} from 'primeng/api';
import {COLORS} from './pattern-dialog.colors';



export type OperatorType = 'IF-THEN' | 'OR' | 'AND' | 'XOR' | 'ALL' | 'EXISTS' | 'NOT';
export type StatementType = 'P' | 'D';
export type Position = 0 | 1;
export let LEFT: Position = 0;
export let RIGHT: Position = 1;

// -------------------- -------------------- --------------------
// --------------------      UI WRAPPER      --------------------
// -------------------- -------------------- --------------------

export class Pattern {
  assertion: Assertion;
  leafs: Statement[];
  constructor(assertion: Assertion) {
    this.assertion = assertion;
    this.leafs = this.collectLeafs(assertion);
  }

  collectLeafs(a: Assertion): Statement[] {
    let leafs: Statement[] = [];
    if (a instanceof Statement) {
      leafs.push(<Statement>a);
    } else {
      for (const child of a.children) {
        leafs = leafs.concat(this.collectLeafs(child));
      }
    }
    return leafs;
  }

  clone(){
    return new Pattern(this.assertion.clone(null));
  }
}

// -------------------- -------------------- --------------------
// --------------------      ABSTRACT        --------------------
// -------------------- -------------------- --------------------

export abstract class Assertion implements TreeNode {
  label: string;
  data: any;
  type: string;
  styleClass: string;
  parent: Operator;
  children = [];

  protected constructor(branch: StatementType, parent: Operator, position: number) {
    this.parent = parent;
    this.data = {
      position: position,
      branch: branch
    };
  }

  // Writes Assertion As String
  public abstract write();
  // Clones an Assertion
  public abstract clone(parent: Operator);
}

export abstract class Operator extends  Assertion {
  expanded = true;
  children = [];

  protected constructor(branch: StatementType, type: OperatorType, parent: Operator, position: number) {
    super(branch, parent, position);
    this.type = 'operator';
    this.styleClass = 'ui-operator';
    this.data.type = type;
  }

  // Writes Assertion As String
  public abstract write();
  // Puts Statement at Index i
  public abstract putOne(a: Assertion, i: number);
  // Completes the operator's children with enough statements
  public abstract complete(statements: Statement[]);
}

// -------------------- -------------------- --------------------
// --------------------      OPERATORS       --------------------
// -------------------- -------------------- --------------------

export class UnaryOperator extends Operator {

  label: string;
  data: any;
  children: Assertion[] = [];

  constructor(branch: StatementType, type: OperatorType, parent: Operator, position: number) {
    super(branch, type, parent, position);
  }

  getOperand() {
    return this.children !== null && this.children.length === 1 ? this.children[0] : null;
  }

  setOperand(operand: Assertion) {
    this.children = [operand];
  }

  write() {
    return this.data.type + ' ( ' + this.getOperand().write() + ' ) ';
  }

  public putOne(a: Assertion, i: number) {
    a.parent = this;
    a.data.position = i;
    a.data.branch = this.data.branch;
    if (i === 0) {
      this.children = [a];
    }
  }

  public complete(statements: Statement[]) {
    if (this.getOperand() === null) {
      const st = new Statement(this.parent.data.branch , statements.length, this, 0);
      this.setOperand(st);
      statements.push(st);
    }
  }

  public clone(parent: Operator) {
    const branch = parent ? parent.data.branch : 'D';
    const uo: UnaryOperator = new UnaryOperator(branch, this.data.type, parent, this.data.position);
    for (const child of this.children){
      uo.children.push(child.clone(uo));
    }
    return uo;
  }
}

export class BinaryOperator extends Operator {
  label: string;
  data: any;
  children: Assertion[] = [null, null];


  constructor(branch: StatementType, type: OperatorType, parent: Operator, position: number) {
    super(branch, type, parent, position);
    this.children = [];
  }

  public getLeft() {
    return this.children[LEFT];
  }

  public getRight() {
    return this.children[RIGHT];
  }

  public setOperand(i: Position, operand: Assertion) {
    if (this.data.type === 'IF-THEN' && i === LEFT) {
      operand.data.branch = 'P';
    }
    this.children[i] = operand;
  }

  public putOne(a: Assertion, i: number) {
    a.parent = this;
    a.data.position = i;
    a.data.branch = this.data.branch;

    if (i === RIGHT || i === LEFT) {
      this.setOperand(i, a);
    }
  }

  public write() {
    if (this.data.type === 'IF-THEN') {
      return ' IF ( ' + this.getLeft().write() + ' ) THEN ( ' + this.getRight().write() + ' ) ';
    }else if (this.data.type === 'NOT') {
      return ' NOT ( ' + this.getLeft().write() + ' )';
    }
    return ' ( ' + this.getLeft().write() + ' ) ' + this.data.type + ' ( ' + this.getRight().write() + ' ) ';
  }

  public complete(statements: Statement[]) {

    if (!this.getLeft()) {
      const type = this.data.type === 'IF-THEN' ? 'P' : this.data.branch;
      const st = new Statement(type, statements.length, this, LEFT);
      this.setOperand(LEFT, st);
      statements.push(st);
    }

    if (!this.getRight()) {
      const type = this.data.type === 'IF-THEN' ? 'D' : this.data.branch;
      const st = new Statement(type, statements.length, this, RIGHT);
      this.setOperand(RIGHT, st);
      statements.push(st);
    }
  }

  public clone(parent: Operator) {
    const branch = parent ? parent.data.branch : 'D';
    const bo: BinaryOperator = new BinaryOperator(branch, this.data.type, parent, this.data.position);

    if (this.getLeft()) {
      bo.setOperand(LEFT, this.getLeft().clone(bo));
    }

    if (this.getRight()) {
      bo.setOperand(RIGHT, this.getRight().clone(bo));
    }
    return bo;
  }
}

export class NaryOperator extends Operator  {
  label: string;
  data: any;
  children: Assertion[] = [];

  constructor(branch: StatementType, type: OperatorType, parent: Operator, position: number) {
    super(branch, type, parent, position);
  }

  public getOperand(i: number) {
    return this.children !== null && this.children.length > i ? this.children[i] : null;
  }

  public setOperand(operand: Assertion) {
    this.children.push(operand);
  }

  public putOne(a: Assertion, i: number) {
    a.parent = this;
    a.data.position = i;
    a.data.branch = this.data.branch;
    if (i < this.children.length) {
      this.children[i] = a;
    } else {
      this.setOperand(a);
    }
  }

  write() {
    let str = this.data.type + ' ( ';
    let i = 0;
    for (const elm of this.children){
      if (i  === this.children.length - 1) {
        str += elm.write();
      } else {
        str += elm.write() + ' , ';
      }
      i++;
    }
    return str + ' ) ';
  }

  public complete(statements: Statement[]) {
    if (this.getOperand(0) === null) {
      const st = new Statement('D', statements.length, this, 0);
      this.setOperand(st);
      statements.push(st);
    }
  }

  public clone(parent: Operator) {
    const branch = parent ? parent.data.branch : 'D';
    const no: NaryOperator = new NaryOperator(branch, this.data.type, parent, this.data.position);

    for (const child of this.children){
      no.children.push(child.clone(no));
    }

    return no;
  }
}

// -------------------- -------------------- --------------------
// --------------------      STATEMENT       --------------------
// -------------------- -------------------- --------------------

export class Statement extends Assertion  {

  label: string;
  type: string;
  data: any;
  styleClass: string;
  children: Assertion[] = [];

  constructor(type: StatementType, id: number, op: Operator, position: number) {
    super(type, op, position);
    this.styleClass = 'ui-statement';
    this.type = 'statement';
    this.data.type = type;
    this.data.id = id;
    this.data.color = COLORS[id % COLORS.length].hex;
  }

  write() {
    return '<strong style="color : ' + this.data.color + '; ">' + this.name() + '</strong>';
  }

  name() {
    return this.data.name && this.data.name !== '' ?
      this.data.name :
      (this.data.branch === 'D' ? 'DECLARATION_' : 'PROPOSITION_') + (this.data.id + 1);
  }

  public clone(parent: Operator) {
    const branch = this.data.branch === 'P' ? 'P' : parent ? parent.data.branch : 'D';
    const no: Statement = new Statement(branch, this.data.id, parent, this.data.position);
    return no;
  }

}
