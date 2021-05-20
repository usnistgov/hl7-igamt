import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IConformanceStatementEditorData, IDependantConformanceStatements, IEditableConformanceStatementGroup, IEditableListNode } from '../../core/components/conformance-statement-editor/conformance-statement-editor.component';
import { Assertion, BinaryOperator, IfThenOperator, LeafStatementType, NaryOperator, Operator, OperatorType, Pattern, Position, Statement, SubContextOperator, UnaryOperator } from '../components/pattern-dialog/cs-pattern.domain';
import { Usage } from '../constants/usage.enum';
import { IConformanceStatementList, IConformanceStatementsContainerMap, ICPConformanceStatementList } from '../models/cs-list.interface';
import { AssertionMode, ConstraintType, IAssertion, IAssertionConformanceStatement, IConformanceStatement, IFreeTextConformanceStatement, IIfThenAssertion, INotAssertion, IOperatorAssertion, IPath, ISimpleAssertion, ISubContext, ISubContextAssertion, Operator as CsOperator } from '../models/cs.interface';
import { IDisplayElement } from '../models/display-element.interface';
import { IAssertionPredicate, IFreeTextPredicate, IPredicate } from '../models/predicate.interface';
import { IResource } from '../models/resource.interface';
import { ElementNamingService } from './element-naming.service';
import { PathService } from './path.service';
import { AResourceRepositoryService } from './resource-repository.service';

export type ConformanceStatementPluck = (cs: IConformanceStatementList | ICPConformanceStatementList) => IConformanceStatementEditorData;

export interface IAssertionBag<T> {
  assertion: T;
  leafs: ISimpleAssertion[];
}

export interface ICsGroup<T> {
  context: IPath;
  list: T[];
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConformanceStatementService {

  constructor(
    private http: HttpClient,
    private pathService: PathService,
    private store: Store<any>,
    private elementNamingService: ElementNamingService,
  ) { }

  createConformanceStatementGroups(data: IConformanceStatementEditorData, resource: IResource, repository: AResourceRepositoryService): Observable<IEditableConformanceStatementGroup[]> {
    const list = data.active;
    if (list.length > 0) {

      const grouped = list.reduce((acc, elm) => {
        const path = this.pathService.pathToString(elm.payload.context);
        if (acc[path]) {
          acc[path].list.push(elm);
        } else {
          acc[path] = {
            context: elm.payload.context,
            list: [elm],
            name: '',
          };
        }
        return acc;
      }, {} as Map<string, IEditableConformanceStatementGroup>);

      return combineLatest(
        Object
          .values(grouped)
          .sort((a) => {
            return !a.context ? -1 : 1;
          })
          .map((group) => {
            return this.getGroupName<IEditableListNode<IConformanceStatement>>(group, resource, repository);
          }),
      );
    } else {
      return of([
        {
          context: undefined,
          name: '',
          list: [],
        },
      ]);
    }
  }

  getGroupName<T>(group: ICsGroup<T>, resource: IResource, repository: AResourceRepositoryService): Observable<ICsGroup<T>> {
    return this.elementNamingService.getStringNameFromPath(group.context, resource, repository).pipe(
      take(1),
      map((name) => {
        return {
          ...group,
          name,
        };
      }),
    );
  }

  createEditableNode(list: IConformanceStatement[]): Array<IEditableListNode<IConformanceStatement>> {
    return list.map((cs) => {
      return {
        original: _.cloneDeep(cs),
        id: Guid.create().toString(),
        payload: cs,
      };
    });
  }

  resolveDependantConformanceStatement(data: IConformanceStatementsContainerMap, selector: MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement>): Array<Observable<IDependantConformanceStatements>> {
    return Object.keys(data).map((key) => {
      const elm = data[key];
      return this.store.select(selector, { id: elm.key }).pipe(
        take(1),
        map((resource) => {
          return {
            resource,
            conformanceStatements: elm.conformanceStatements,
          } as IDependantConformanceStatements;
        }),
      );
    });
  }

  generateXMLfromPredicate(predicate: IPredicate, id: string): Observable<string> {
    return this.http.post('api/igdocuments/' + id + '/predicate/assertion', predicate, { responseType: 'text' });
  }

  generateXMLfromCs(cs: IConformanceStatement, id: string): Observable<string> {
    return this.http.post('api/igdocuments/' + id + '/conformancestatement/assertion', cs, { responseType: 'text' });
  }

  getFreeConformanceStatement(): IFreeTextConformanceStatement {
    return {
      identifier: '',
      freeText: '',
      assertionScript: null,
      type: ConstraintType.FREE,
    };
  }

  getFreePredicate(): IFreeTextPredicate {
    return {
      identifier: '',
      freeText: '',
      assertionScript: null,
      trueUsage: Usage.R,
      falseUsage: Usage.X,
      type: ConstraintType.FREE,
    };
  }

  getAssertionConformanceStatement(assertion: Assertion): { cs: IAssertionConformanceStatement, statements: ISimpleAssertion[] } {
    const bag = assertion ? this.getCsDataAssertion(assertion) : { assertion: undefined, leafs: [] };
    return {
      cs: {
        identifier: '',
        type: ConstraintType.ASSERTION,
        assertion: bag.assertion,
      },
      statements: bag.leafs,
    };
  }

  getAssertionPredicate(assertion: Assertion): { cs: IAssertionPredicate, statements: ISimpleAssertion[] } {
    const bag = assertion ? this.getCsDataAssertion(assertion) : { assertion: undefined, leafs: [] };
    return {
      cs: {
        identifier: '',
        trueUsage: Usage.R,
        falseUsage: Usage.X,
        type: ConstraintType.ASSERTION,
        assertion: bag.assertion,
      },
      statements: bag.leafs,
    };
  }

  getCsPattern(assertion: IAssertion, predicate: boolean): Pattern {
    const pattern = new Pattern(this.getCsViewAssertion(assertion, { counter: 0 }));
    if (predicate) {
      pattern.leafs.filter((leaf) => {
        return leaf.data.branch !== LeafStatementType.CONTEXT;
      }).forEach((leaf) => {
        leaf.data.branch = LeafStatementType.PROPOSITION;
      });
    }
    return pattern;
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
        codesys: '',
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

  createSubContextAssertion(_a: IAssertion): ISubContextAssertion {
    return {
      mode: AssertionMode.SUBCONTEXT,
      child: _a,
      context: {
        path: undefined,
        occurenceIdPath: undefined,
        occurenceLocationStr: undefined,
        occurenceValue: undefined,
        occurenceType: undefined,
        description: '',
      },
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

  // tslint:disable-next-line: cognitive-complexity
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
      if (assertion instanceof SubContextOperator) {
        const inner = this.getCsDataAssertion(assertion.getOperand());
        const subContext = this.createSubContextAssertion(inner.assertion);
        assertion.context.payload = subContext.context;
        return {
          assertion: subContext,
          leafs: inner.leafs,
        };
      } else if (assertion.data.type === 'NOT') {
        const inner = this.getCsDataAssertion(assertion.getOperand());
        return {
          assertion: this.createNotAssertion(inner.assertion),
          leafs: inner.leafs,
        };
      } else {
        throw new Error('Unrecognized unary operator');
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
            right.assertion,
          ),
          leafs: [...left.leafs, ...right.leafs],
        };
      } else if (assertion.data.type === 'OR') {
        const left = this.getCsDataAssertion(assertion.getLeft());
        const right = this.getCsDataAssertion(assertion.getRight());
        return {
          assertion: this.createOpAssertion(
            CsOperator.OR,
            left.assertion,
            right.assertion,
          ),
          leafs: [...left.leafs, ...right.leafs],
        };
      } else if (assertion.data.type === 'XOR') {
        const left = this.getCsDataAssertion(assertion.getLeft());
        const right = this.getCsDataAssertion(assertion.getRight());
        return {
          assertion: this.createOpAssertion(
            CsOperator.XOR,
            left.assertion,
            right.assertion,
          ),
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
            ...assertions.map((a) => a.assertion),
          ),
          leafs,
        };
      } else if (assertion.data.type === 'EXISTS') {
        const assertions = assertion.getOperands().map((a) => this.getCsDataAssertion(a));
        let leafs = [];
        assertions.forEach((a) => leafs = leafs.concat(a.leafs));
        return {
          assertion: this.createOpAssertion(
            CsOperator.OR,
            ...assertions.map((a) => a.assertion),
          ),
          leafs,
        };
      }
    }
    throw new Error('Unrecognized assertion');
  }

  getCsViewAssertion(assertion: IAssertion, idsRef: { counter: number }, parent?: Operator, position?: number): Assertion {
    switch (assertion.mode) {
      case AssertionMode.SIMPLE:
        return this.getCsSimplePattern(assertion as ISimpleAssertion, idsRef.counter++, parent, position);
      case AssertionMode.IFTHEN:
        const ifThenAssertion = assertion as IIfThenAssertion;
        const ifThen = this.getCsConditionalPattern(ifThenAssertion, parent, position);
        ifThen.putOne(this.getCsViewAssertion(ifThenAssertion.ifAssertion, idsRef, ifThen, Position.LEFT), Position.LEFT);
        ifThen.putOne(this.getCsViewAssertion(ifThenAssertion.thenAssertion, idsRef, ifThen, Position.RIGHT), Position.RIGHT);
        return ifThen;
      case AssertionMode.NOT:
        const notAssertion = assertion as INotAssertion;
        const not = this.getCsNotPattern(notAssertion, parent, position);
        not.putOne(this.getCsViewAssertion(notAssertion.child, idsRef, not, Position.LEFT), Position.LEFT);
        return not;
      case AssertionMode.ANDOR:
        const opAssertion = assertion as IOperatorAssertion;
        if (opAssertion.assertions) {
          if (opAssertion.assertions.length > 2) {
            const nOp = this.getCsNaryOpPattern(opAssertion, parent, position);
            opAssertion.assertions.forEach((a, i) => {
              nOp.putOne(this.getCsViewAssertion(a, idsRef, nOp, i), i);
            });
            return nOp;
          } else {
            const biOp = this.getCsBinaryOpPattern(opAssertion, parent, position);
            opAssertion.assertions.forEach((a, i) => {
              biOp.putOne(this.getCsViewAssertion(a, idsRef, biOp, i), i);
            });
            return biOp;
          }
        }
        return this.getCsBinaryOpPattern(opAssertion, parent, position);
      case AssertionMode.SUBCONTEXT:
        const subContext = assertion as ISubContextAssertion;
        const subC = this.getCsSubContextPattern(subContext, parent, position);
        subC.setOperand(this.getCsViewAssertion(subContext.child, idsRef, not, Position.LEFT));
        subC.context = this.getCsContextPattern(subContext.context, idsRef.counter++, subC);
        return subC;
    }
  }

  getCsSimplePattern(assertion: ISimpleAssertion, id: number, parent?: Operator, position?: number): Statement {
    const statement = new Statement(LeafStatementType.DECLARATION, id, parent, position || 1);
    statement.payload = assertion;
    return statement;
  }

  getCsContextPattern(context: ISubContext, id: number, parent?: Operator): Statement {
    const statement = new Statement(LeafStatementType.CONTEXT, id, parent, 1);
    statement.payload = context;
    return statement;
  }

  getCsConditionalPattern(assertion: IIfThenAssertion, parent?: Operator, position?: number): IfThenOperator {
    return new IfThenOperator(LeafStatementType.DECLARATION, parent, position);
  }

  getCsNotPattern(assertion: INotAssertion, parent?: Operator, position?: number): UnaryOperator {
    return new UnaryOperator(LeafStatementType.DECLARATION, OperatorType.NOT, parent, position);
  }

  getCsSubContextPattern(assertion: ISubContextAssertion, parent?: Operator, position?: number): SubContextOperator {
    return new SubContextOperator(LeafStatementType.DECLARATION, parent, position);
  }

  getCsBinaryOpPattern(assertion: IOperatorAssertion, parent?: Operator, position?: number): BinaryOperator {
    return new BinaryOperator(LeafStatementType.DECLARATION, assertion.operator.toString() as OperatorType, parent, position);
  }

  getCsNaryOpPattern(assertion: IOperatorAssertion, parent?: Operator, position?: number): NaryOperator {
    const op = assertion.operator === 'AND' ? 'ALL' : assertion.operator === 'OR' ? 'EXISTS' : undefined;
    if (!op) {
      throw Error(assertion.operator + ' is not Nary Op');
    }
    return new NaryOperator(LeafStatementType.DECLARATION, op as OperatorType, parent, position);
  }
}
