import { TreeNode } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { COLORS } from './pattern-dialog.colors';

export enum OperatorType {
  IF_THEN = 'IF-THEN',
  OR = 'OR',
  AND = 'AND',
  XOR = 'XOR',
  ALL = 'ALL',
  EXISTS = 'EXISTS',
  NOT = 'NOT',
  SUBCONTEXT = 'SUBCONTEXT',
}
export enum LeafStatementType {
  PROPOSITION = 'PROPOSITION',
  DECLARATION = 'DECLARATION',
  CONTEXT = 'CONTEXT',
}
export enum Position {
  LEFT = 0,
  RIGHT = 1,
}
export enum NodeType {
  STATEMENT = 'statement',
  OPERATOR = 'operator',
}

export enum TokenType {
  TEXT = 'TEXT',
  STATEMENT = 'STATEMENT',
}

export interface Token<T, E> {
  type: TokenType;
  value: T;
  name?: string;
  valid?: boolean;
  dependency?: Token<any, any>;
  payload?: BehaviorSubject<E>;
}

// -------------------- -------------------- --------------------
// --------------------      ABSTRACT        --------------------
// -------------------- -------------------- --------------------

export interface IAssertionTreeData {
  position: Position;
  leaf: boolean;
  branch: LeafStatementType;
  id: number;
  color: string;
  type: OperatorType;
}

export abstract class Assertion implements TreeNode {
  data: IAssertionTreeData;
  styleClass: string;
  parent: Operator;
  type: NodeType;
  children: Assertion[] = [];

  protected constructor(branch: LeafStatementType, parent: Operator, position: number) {
    this.parent = parent;
    this.data = {
      ...this.data,
      position,
      branch,
    };
  }

  // Writes Assertion As String
  public abstract write(): string;
  // Clones an Assertion
  public abstract clone(parent: Operator): Assertion;
  // Get node leafs
  public abstract getLeafs(): Statement[];

  public abstract tokenize(): Array<Token<any, any>>;
}

// -------------------- -------------------- --------------------
// --------------------      STATEMENT       --------------------
// -------------------- -------------------- --------------------

export class Statement extends Assertion {

  data: IAssertionTreeData;
  styleClass: string;

  constructor(type: LeafStatementType, id: number, op: Operator, position: number, public payload?: any) {
    super(type, op, position);
    this.styleClass = 'ui-statement';
    this.type = NodeType.STATEMENT;
    this.data.id = id;
    this.data.color = COLORS[id % COLORS.length].hex;
  }

  write() {
    return '<strong style="color : ' + this.data.color + '; ">' + this.name() + '</strong>';
  }

  name() {
    return (this.data.branch) + '_' + (this.data.id + 1);
  }

  public clone(parent: Operator): Statement {
    const branch = (parent ? parent.data.branch : LeafStatementType.DECLARATION) || this.data.branch;
    return new Statement(branch, this.data.id, parent, this.data.position);
  }

  public getLeafs(): Statement[] {
    return [this];
  }

  public tokenize(): Array<Token<Statement, any>> {
    return [
      {
        type: TokenType.STATEMENT,
        value: this,
        name: this.name(),
      },
    ];
  }

}

// -------------------- -------------------- --------------------
// --------------------      UI WRAPPER      --------------------
// -------------------- -------------------- --------------------

export class Pattern {
  assertion: Assertion;
  leafs: Statement[];
  tokens: Array<Token<any, any>>;
  statements: Array<Token<any, any>>;

  constructor(assertion: Assertion) {
    this.assertion = assertion;
    this.tokens = assertion.tokenize();
    this.statements = this.tokens.filter((t) => t.type === TokenType.STATEMENT);
    this.leafs = this.statements.map((t) => t.value as Statement);
  }

  clone(): Pattern {
    return new Pattern(this.assertion.clone(null));
  }
}

export abstract class Operator extends Assertion {
  expanded = true;

  protected constructor(branch: LeafStatementType, type: OperatorType, parent: Operator, position: number) {
    super(branch, parent, position);
    this.type = NodeType.OPERATOR;
    this.data.type = type;
    this.styleClass = 'ui-operator';
  }

  public abstract clone(parent: Operator): Operator;
  // Writes Assertion As String
  public abstract write(): string;
  // Puts Statement at Index i
  public abstract putOne(a: Assertion, i: number): void;
  // Completes the operator's children with enough statements
  public abstract complete(statements: Statement[]): void;

  public getLeafs(): Statement[] {
    let sts = [];
    for (const child of this.children) {
      sts = [
        ...sts,
        ...child.getLeafs(),
      ];
    }
    return sts;
  }
}

// -------------------- -------------------- --------------------
// --------------------      OPERATORS       --------------------
// -------------------- -------------------- --------------------

export class UnaryOperator extends Operator {
  label: string;
  children: Assertion[] = [];

  constructor(branch: LeafStatementType, type: OperatorType, parent: Operator, position: number) {
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

  public tokenize(): Array<Token<any, any>> {
    return [
      {
        type: TokenType.TEXT,
        value: this.data.type + ' ( ',
      },
      ...this.getOperand().tokenize(),
      {
        type: TokenType.TEXT,
        value: ' ) ',
      },
    ];
  }

  public putOne(a: Assertion, position: Position) {
    a.parent = this;
    a.data.position = position;
    a.data.branch = this.data.branch;
    if (position === 0) {
      this.children = [a];
    }
  }

  public complete(statements: Statement[]) {
    if (this.getOperand() === null) {
      const st = new Statement(this.parent.data.branch, statements.length, this, 0);
      this.setOperand(st);
      statements.push(st);
    }
  }

  public clone(parent: Operator): UnaryOperator {
    const branch = parent ? parent.data.branch : LeafStatementType.DECLARATION;
    const uo: UnaryOperator = new UnaryOperator(branch, this.data.type, parent, this.data.position);
    for (const child of this.children) {
      uo.children.push(child.clone(uo));
    }
    return uo;
  }

}

export class SubContextOperator extends UnaryOperator {
  label: string;
  children: Assertion[] = [];
  context: Statement;

  constructor(branch: LeafStatementType, parent: Operator, position: number) {
    super(branch, OperatorType.SUBCONTEXT, parent, position);
  }

  getOperand() {
    return this.children !== null && this.children.length === 1 ? this.children[0] : null;
  }

  setOperand(operand: Assertion) {
    this.children = [operand];
  }

  write() {
    return ' ( ' + this.getOperand().write() + ' ) IN ' + this.context.write();
  }

  public tokenize(): Array<Token<any, any>> {
    const context: Token<Statement, any> = {
      type: TokenType.STATEMENT,
      value: this.context,
      name: this.context.name(),
    };

    return [
      ...this.getOperand().tokenize().map((t) => Object.assign(t, { dependency: t.dependency || context })),
      {
        type: TokenType.TEXT,
        value: ' IN ',
      },
      context,
    ];
  }

  public putOne(a: Assertion, i: number) {
    a.parent = this;
    a.data.position = i;
    a.data.branch = this.data.branch;
    if (i === 0) {
      this.children = [a];
    }
  }

  public getLeafs(): Statement[] {
    return [
      ...super.getLeafs(),
      ...(this.context ? [this.context] : []),
    ];
  }

  public complete(statements: Statement[]) {
    if (this.getOperand() === null) {
      const st = new Statement(this.parent.data.branch, statements.length, this, 0);
      statements.push(st);
      this.setOperand(st);
    }
    if (!this.context) {
      this.context = new Statement(LeafStatementType.CONTEXT, statements.length, this, 0);
      statements.push(this.context);
    }
  }

  public clone(parent: Operator): UnaryOperator {
    const branch = parent ? parent.data.branch : LeafStatementType.DECLARATION;
    const uo: SubContextOperator = new SubContextOperator(branch, parent, this.data.position);
    if (this.context) {
      uo.context = this.context.clone(parent);
    }
    for (const child of this.children) {
      uo.children.push(child.clone(uo));
    }
    return uo;
  }
}

export class BinaryOperator extends Operator {
  label: string;
  children: Assertion[] = [null, null];

  constructor(branch: LeafStatementType, type: OperatorType, parent: Operator, position: number) {
    super(branch, type, parent, position);
    this.children = [];
  }

  public getLeft() {
    return this.children[Position.LEFT];
  }

  public getRight() {
    return this.children[Position.RIGHT];
  }

  public setOperand(i: Position, operand: Assertion) {
    this.children[i] = operand;
  }

  drillDown(operand: Assertion, branch: LeafStatementType) {
    operand.data.branch = branch;
    operand.children.forEach((child) => {
      this.drillDown(child, branch);
    });
  }

  public putOne(a: Assertion, i: number) {
    a.parent = this;
    a.data.position = i;
    a.data.branch = this.data.branch;

    if (i === Position.RIGHT || i === Position.LEFT) {
      this.setOperand(i, a);
    }
  }

  public write() {
    return ' ( ' + this.getLeft().write() + ' ) ' + this.data.type + ' ( ' + this.getRight().write() + ' ) ';
  }

  public tokenize(): Array<Token<any, any>> {
    return [
      {
        type: TokenType.TEXT,
        value: ' ( ',
      },
      ...this.getLeft().tokenize(),
      {
        type: TokenType.TEXT,
        value: ' ) ',
      },
      {
        type: TokenType.TEXT,
        value: this.data.type,
      },
      {
        type: TokenType.TEXT,
        value: ' ( ',
      },
      ...this.getRight().tokenize(),
      {
        type: TokenType.TEXT,
        value: ' ) ',
      },
    ];
  }

  public complete(statements: Statement[]) {
    if (!this.getLeft()) {
      const st = new Statement(this.data.branch, statements.length, this, Position.LEFT);
      this.setOperand(Position.LEFT, st);
      statements.push(st);
    }
    if (!this.getRight()) {
      const st = new Statement(this.data.branch, statements.length, this, Position.RIGHT);
      this.setOperand(Position.RIGHT, st);
      statements.push(st);
    }
  }

  public clone(parent: Operator): BinaryOperator {
    const branch = parent ? parent.data.branch : LeafStatementType.DECLARATION;
    const bo: BinaryOperator = new BinaryOperator(branch, this.data.type, parent, this.data.position);

    if (this.getLeft()) {
      bo.setOperand(Position.LEFT, this.getLeft().clone(bo));
    }

    if (this.getRight()) {
      bo.setOperand(Position.RIGHT, this.getRight().clone(bo));
    }
    return bo;
  }
}

export class IfThenOperator extends BinaryOperator {
  constructor(branch: LeafStatementType, parent: Operator, position: number) {
    super(branch, OperatorType.IF_THEN, parent, position);
  }
  public write() {
    return ' IF ( ' + this.getLeft().write() + ' ) THEN ( ' + this.getRight().write() + ' ) ';
  }
  public tokenize(): Array<Token<any, any>> {
    return [
      {
        type: TokenType.TEXT,
        value: ' IF ( ',
      },
      ...this.getLeft().tokenize(),
      {
        type: TokenType.TEXT,
        value: ' ) THEN ( ',
      },
      ...this.getRight().tokenize(),
      {
        type: TokenType.TEXT,
        value: ' ) ',
      },
    ];
  }
  public setOperand(i: Position, operand: Assertion) {
    if (i === Position.LEFT) {
      this.drillDown(operand, LeafStatementType.PROPOSITION);
    }
    this.children[i] = operand;
  }
  public clone(parent: Operator): BinaryOperator {
    const branch = parent ? parent.data.branch : LeafStatementType.DECLARATION;
    const bo: IfThenOperator = new IfThenOperator(branch, parent, this.data.position);

    if (this.getLeft()) {
      bo.setOperand(Position.LEFT, this.getLeft().clone(bo));
    }

    if (this.getRight()) {
      bo.setOperand(Position.RIGHT, this.getRight().clone(bo));
    }
    return bo;
  }
  public complete(statements: Statement[]) {
    if (!this.getLeft()) {
      const st = new Statement(LeafStatementType.PROPOSITION, statements.length, this, Position.LEFT);
      this.setOperand(Position.LEFT, st);
      statements.push(st);
    }
    if (!this.getRight()) {
      const st = new Statement(this.data.branch, statements.length, this, Position.RIGHT);
      this.setOperand(Position.RIGHT, st);
      statements.push(st);
    }
  }
}

export class NaryOperator extends Operator {
  label: string;
  data: any;
  children: Assertion[] = [];

  constructor(branch: LeafStatementType, type: OperatorType, parent: Operator, position: number) {
    super(branch, type, parent, position);
  }

  public getOperand(i: number) {
    return this.children !== null && this.children.length > i ? this.children[i] : null;
  }

  public getOperands() {
    return this.children !== null ? this.children : [];
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
    for (const elm of this.children) {
      if (i === this.children.length - 1) {
        str += elm.write();
      } else {
        str += elm.write() + ' , ';
      }
      i++;
    }
    return str + ' ) ';
  }

  public tokenize(): Array<Token<any, any>> {
    let children = [];
    for (const ls of this.children.map((c) => c.tokenize())) {
      children = [
        ...children,
        ...(children.length > 0 ? [{
          type: TokenType.TEXT,
          value: ' , ',
        }] : []),
        ...ls,
      ];
    }
    return [
      {
        type: TokenType.TEXT,
        value: this.data.type + ' ( ',
      },
      ...children,
      {
        type: TokenType.TEXT,
        value: ' ) ',
      },
    ];
  }

  public complete(statements: Statement[]) {
    if (this.getOperand(0) === null) {
      const st = new Statement(this.parent.data.branch || LeafStatementType.DECLARATION, statements.length, this, 0);
      this.setOperand(st);
      statements.push(st);
    }
  }

  public clone(parent: Operator): NaryOperator {
    const branch = parent ? parent.data.branch : LeafStatementType.DECLARATION;
    const no: NaryOperator = new NaryOperator(branch, this.data.type, parent, this.data.position);
    for (const child of this.children) {
      no.children.push(child.clone(no));
    }
    return no;
  }
}
