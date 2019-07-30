import { Injectable } from '@angular/core';
import { Assertion, BinaryOperator, LEFT, NaryOperator, Operator, Pattern, RIGHT, Statement, UnaryOperator } from '../components/pattern-dialog/cs-pattern.domain';
import { AssertionMode, ConstraintType, IAssertion, IAssertionConformanceStatement, IFreeTextConformanceStatement, IIfThenAssertion, INotAssertion, IOperatorAssertion, ISimpleAssertion, Operator as CsOperator } from '../models/cs.interface';

export interface IAssertionBag<T> {
  assertion: T;
  leafs: ISimpleAssertion[];
}

@Injectable({
  providedIn: 'root',
})
export class ConformanceStatementService {

  constructor() { }

  getFreeConformanceStatement(): IFreeTextConformanceStatement {
    return {
      id: '',
      identifier: '',
      freeText: '',
      assertionScript: '',
      type: ConstraintType.FREE,
    };
  }

  getAssertionConformanceStatement(assertion: Assertion): { cs: IAssertionConformanceStatement, statements: ISimpleAssertion[] } {
    const bag = this.getCsDataAssertion(assertion);
    return {
      cs: {
        id: '',
        identifier: '',
        type: ConstraintType.ASSERTION,
        assertion: bag.assertion,
      },
      statements: bag.leafs,
    };
  }

  getCsPattern(assertion: IAssertion): Pattern {
    return new Pattern(this.getCsViewAssertion(assertion, 0));
  }

  createSimpleAssertion(): ISimpleAssertion {
    return {
      mode: AssertionMode.SIMPLE,
      complement: {
        complementKey: undefined,
        path: undefined,
        occurenceIdPath: undefined,
        occurenceLocationStr: undefined,
        occurenceValue: undefined,
        occurenceType: undefined,
        value: '',
        values: [],
        desc: '',
        descs: [],
        codesys: [''],
      },
      subject: {
        path: undefined,
        occurenceIdPath: undefined,
        occurenceLocationStr: undefined,
        occurenceValue: undefined,
        occurenceType: undefined,
      },
      verbKey: '',
      description: '',
    };
  }

  createIfThenAssertion(_if: IAssertion, _then: IAssertion): IIfThenAssertion {
    return {
      mode: AssertionMode.IFTHEN,
      ifAssertion: _if,
      thenAssertion: _then,
      description: '',
    };
  }

  createNotAssertion(_a: IAssertion): INotAssertion {
    return {
      mode: AssertionMode.NOT,
      child: _a,
      description: '',
    };
  }

  createOpAssertion(operator: CsOperator, ..._a: IAssertion[]): IOperatorAssertion {
    return {
      mode: AssertionMode.ANDOR,
      operator,
      assertions: _a,
      description: '',
    };
  }

  getCsDataAssertion(assertion: Assertion): IAssertionBag<IAssertion> {
    if (assertion instanceof Statement) {
      const simple = this.createSimpleAssertion();
      assertion.payload = simple;
      simple.id = assertion.name();
      return {
        assertion: simple,
        leafs: [simple],
      };
    } else if (assertion instanceof UnaryOperator) {
      if (assertion.data.type !== 'NOT') {
        throw new Error('Unrecognized unary operator');
      } else {
        const inner = this.getCsDataAssertion(assertion.getOperand());
        return {
          assertion: this.createNotAssertion(inner.assertion),
          leafs: inner.leafs,
        };
      }
    } else if (assertion instanceof BinaryOperator) {
      if (assertion.data.type === 'IF-THEN') {
        const left = this.getCsDataAssertion(assertion.getLeft());
        const right = this.getCsDataAssertion(assertion.getRight());
        return {
          assertion: this.createIfThenAssertion(left.assertion, right.assertion),
          leafs: [...left.leafs, ...right.leafs],
        };
      } else if (assertion.data.type === 'AND') {
        const left = this.getCsDataAssertion(assertion.getLeft());
        const right = this.getCsDataAssertion(assertion.getRight());
        return {
          assertion: this.createOpAssertion(
            CsOperator.AND,
            left.assertion,
            right.assertion),
          leafs: [...left.leafs, ...right.leafs],
        };
      } else if (assertion.data.type === 'OR') {
        const left = this.getCsDataAssertion(assertion.getLeft());
        const right = this.getCsDataAssertion(assertion.getRight());
        return {
          assertion: this.createOpAssertion(
            CsOperator.OR,
            left.assertion,
            right.assertion),
          leafs: [...left.leafs, ...right.leafs],
        };
      } else if (assertion.data.type === 'XOR') {
        const left = this.getCsDataAssertion(assertion.getLeft());
        const right = this.getCsDataAssertion(assertion.getRight());
        return {
          assertion: this.createOpAssertion(
            CsOperator.XOR,
            left.assertion,
            right.assertion),
          leafs: [...left.leafs, ...right.leafs],
        };
      }
    } else if (assertion instanceof NaryOperator) {
      if (assertion.data.type === 'ALL') {
        const assertions = assertion.getOperands().map((a) => this.getCsDataAssertion(a));
        let leafs = [];
        assertions.forEach((a) => leafs = leafs.concat(a.leafs));
        return {
          assertion: this.createOpAssertion(
            CsOperator.AND,
            ...assertions.map((a) => a.assertion)),
          leafs,
        };
      } else if (assertion.data.type === 'EXISTS') {
        const assertions = assertion.getOperands().map((a) => this.getCsDataAssertion(a));
        let leafs = [];
        assertions.forEach((a) => leafs = leafs.concat(a.leafs));
        return {
          assertion: this.createOpAssertion(
            CsOperator.OR,
            ...assertions.map((a) => a.assertion)),
          leafs,
        };
      }
    }
    throw new Error('Unrecognized assertion');
  }

  getCsViewAssertion(assertion: IAssertion, id: number, parent?: Operator, position?: number): Assertion {
    switch (assertion.mode) {
      case AssertionMode.SIMPLE:
        return this.getCsSimplePattern(assertion as ISimpleAssertion, id, parent, position);
      case AssertionMode.IFTHEN:
        const ifThenAssertion = assertion as IIfThenAssertion;
        const ifThen = this.getCsConditionalPattern(ifThenAssertion, parent, position);
        ifThen.putOne(this.getCsViewAssertion(ifThenAssertion.ifAssertion, id + 1, ifThen, LEFT), LEFT);
        ifThen.putOne(this.getCsViewAssertion(ifThenAssertion.thenAssertion, id + 2, ifThen, RIGHT), RIGHT);
        return ifThen;
      case AssertionMode.NOT:
        const notAssertion = assertion as INotAssertion;
        const not = this.getCsNotPattern(notAssertion, parent, position);
        not.putOne(this.getCsViewAssertion(notAssertion.child, id + 1, not, LEFT), LEFT);
        return not;
      case AssertionMode.ANDOR:
        const opAssertion = assertion as IOperatorAssertion;
        if (opAssertion.assertions) {
          if (opAssertion.assertions.length > 2) {
            const nOp = this.getCsNaryOpPattern(opAssertion, parent, position);
            opAssertion.assertions.forEach((a, i) => {
              nOp.putOne(this.getCsViewAssertion(a, id + i, nOp, i), i);
            });
            return nOp;
          } else {
            const biOp = this.getCsBinaryOpPattern(opAssertion, parent, position);
            opAssertion.assertions.forEach((a, i) => {
              biOp.putOne(this.getCsViewAssertion(a, id + i, biOp, i), i);
            });
            return biOp;
          }
        }
    }
  }

  getCsSimplePattern(assertion: ISimpleAssertion, id: number, parent?: Operator, position?: number): Statement {
    const statement = new Statement('D', id, parent, position || 1);
    statement.payload = assertion;
    return statement;
  }

  getCsConditionalPattern(assertion: IIfThenAssertion, parent?: Operator, position?: number): Operator {
    return new BinaryOperator('D', 'IF-THEN', parent, position);
  }

  getCsNotPattern(assertion: INotAssertion, parent?: Operator, position?: number): Operator {
    return new UnaryOperator('D', 'NOT', parent, position);
  }

  getCsBinaryOpPattern(assertion: IOperatorAssertion, parent?: Operator, position?: number): Operator {
    return new BinaryOperator('D', assertion.operator, parent, position);
  }

  getCsNaryOpPattern(assertion: IOperatorAssertion, parent?: Operator, position?: number): Operator {
    const op = assertion.operator === 'AND' ? 'ALL' : assertion.operator === 'OR' ? 'EXISTS' : undefined;
    if (!op) {
      throw Error(assertion.operator + ' is not Nary Op');
    }
    return new NaryOperator('D', op, parent, position);
  }
}
