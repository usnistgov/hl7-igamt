import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { finalize, map, take, tap } from 'rxjs/operators';
import { ComparativeType, DeclarativeType, OccurrenceType, PropositionType, StatementType, VerbType } from '../../models/conformance-statements.domain';
import { AssertionMode, IComplement, IPath, ISimpleAssertion, ISubject } from '../../models/cs.interface';
import { ElementNamingService } from '../../services/element-naming.service';
import { PathService } from '../../services/path.service';
import { StatementTarget } from '../../services/statement.service';
import { RestrictionCombinator, RestrictionType } from '../../services/tree-filter.service';
import { CsStatementComponent, IStatementTokenPayload } from '../cs-dialog/cs-statement.component';
import { COMPARATIVES, DECLARATIVES, OCCURRENCES, PROPOSITIONS, VERBS } from '../cs-dialog/cs-statement.constants';
import { IToken, LeafStatementType, Statement } from '../pattern-dialog/cs-pattern.domain';

@Component({
  selector: 'app-cs-proposition',
  templateUrl: './cs-proposition.component.html',
  styleUrls: ['./cs-proposition.component.scss'],
})
export class CsPropositionComponent extends CsStatementComponent<ISimpleAssertion> {

  _statementType = StatementType;
  _declarativeType = DeclarativeType;
  _comparativeType = ComparativeType;
  _propositionType = PropositionType;
  _occurrenceType = OccurrenceType;
  _csType = LeafStatementType;

  subject: StatementTarget;
  compare: StatementTarget;

  csType: LeafStatementType;
  statementType: StatementType = StatementType.DECLARATIVE;
  assertion: ISimpleAssertion;

  @Input()
  predicateMode: boolean;
  id: string;

  @ViewChild('statementValues', { read: NgForm }) statementValues: NgForm;

  @Input()
  set type(type: LeafStatementType) {
    this.csType = type;
    if (this.csType === LeafStatementType.DECLARATION) {
      this.treeFilter.restrictions.push(
        {
          criterion: RestrictionType.PRIMITIVE,
          combine: RestrictionCombinator.ENFORCE,
          allow: true,
          value: true,
        },
      );
    }
  }

  occurences = OCCURRENCES;
  verbs = VERBS;
  declarative_statements = DECLARATIVES;
  comparative_statements = COMPARATIVES;
  proposition_statements = PROPOSITIONS;

  complex_statements_allowed: string[] = [
    PropositionType.VALUED,
    PropositionType.NOT_VALUED,
  ];

  labelsMap = {};

  constructor(
    elementNamingService: ElementNamingService,
    private pathService: PathService,
  ) {
    super({
      hide: false,
      restrictions: [],
    }, {
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
          descs: [],
          desc: '',
          codesys: '',
          codesyses: [],
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
      });
    this.id = new Date().getTime() + '';
    this.csType = LeafStatementType.DECLARATION;
    this.subject = new StatementTarget(elementNamingService, pathService, this.occurences);
    this.compare = new StatementTarget(elementNamingService, pathService, this.occurences);
    this.map(this.verbs);
    this.map(this.occurences);
    this.map(this.declarative_statements);
    this.map(this.comparative_statements);
    this.map(this.proposition_statements);
  }

  initializeStatement(token: IToken<Statement, IStatementTokenPayload>) {
    this.assertion = token.value.payload;
    if (Object.values(ComparativeType).includes(this.assertion.complement.complementKey as ComparativeType)) {
      this.statementType = StatementType.COMPARATIVE;
    } else {
      this.statementType = StatementType.DECLARATIVE;
    }
    this.valueChange.emit(this.assertion);
    combineLatest(
      this.subject.setSubject(token.value.payload.subject as ISubject, token.payload.getValue().effectiveContext, this.res, this.repository),
      this.compare.setSubject(token.value.payload.complement as ISubject, token.payload.getValue().effectiveContext, this.res, this.repository),
    ).pipe(
      finalize(() => this.updateTokenStatus()),
    ).subscribe();
  }

  map(list: Array<{ label: string, value: string }>) {
    for (const item of list) {
      this.labelsMap[item.value] = item.label;
    }
  }

  statementList() {
    if (this.csType === LeafStatementType.PROPOSITION) {
      return this.proposition_statements.filter((st) => {
        if (this.subject.complex) {
          return this.complex_statements_allowed.indexOf(st.value) !== -1;
        } else {
          return true;
        }
      });
    } else {
      if (this.statementType === StatementType.DECLARATIVE) {
        return this.declarative_statements;
      } else {
        return this.comparative_statements;
      }
    }
  }

  change() {
    combineLatest(
      this.subject.getDescription(this.res, this.repository, !!this.token.dependency),
      this.compare.getDescription(this.res, this.repository, !!this.token.dependency),
    ).pipe(
      take(1),
      map(([node, compNode]) => {
        const verb = this.labelsMap[this.assertion.verbKey];
        const statement = this.getStatementLiteral(this.assertion.complement);
        this.assertion.description = `${node} ${this.csType === LeafStatementType.DECLARATION ? this.valueOrBlank(verb).toLowerCase() : ''} ${this.valueOrBlank(statement)} ${this.statementType === StatementType.COMPARATIVE ? compNode.toLowerCase() : ''}`;
        Object.assign(this.assertion.subject, {
          ...this.subject.value,
        });
        Object.assign(this.assertion.complement, {
          ...this.compare.value,
        });
        this.updateTokenStatus();
        this.valueChange.emit(this.assertion);
      }),
    ).subscribe();
  }

  valueOrBlank(val): string {
    return val ? val : '_';
  }

  trackByFn(index, item) {
    return index;
  }

  getStatementLiteral(complement: IComplement): string {
    if (complement) {
      switch (complement.complementKey) {
        case DeclarativeType.CONTAINS_VALUE:
          return `contain the value \'${this.valueOrBlank(complement.value)}\'.`;
        case PropositionType.NOT_CONTAINS_VALUE:
          return `does not contain the value \'${this.valueOrBlank(complement.value)}\'.`;
        case DeclarativeType.CONTAINS_VALUE_DESC:
          return `contain the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}).`;
        case PropositionType.NOT_CONTAINS_VALUE_DESC:
          return `does not contain the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}).`;
        case DeclarativeType.CONTAINS_CODE:
          return `contain the value \'${this.valueOrBlank(complement.value)}\' drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_CODE_DESC:
          return `contain the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}) drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_VALUES:
          return `contain one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}].`;
        case DeclarativeType.CONTAINS_VALUES_DESC:
          const values = complement.values.map((v) => '\'' + v + '\'').map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `contain one of the values in the list: [${this.valueOrBlank(values.join(','))}].`;
        case PropositionType.NOT_CONTAINS_VALUES:
          return `does not contain one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}].`;
        case DeclarativeType.CONTAINS_CODES:
          return `contain one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}] drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_CODES_DESC:
          const _values = complement.values.map((v) => `\'${v}\'`).map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `contain one of the values in the list: [${this.valueOrBlank(_values.join(','))}] drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_REGEX:
          return `match the regular expression \'${this.valueOrBlank(complement.value)}\'.`;
        case PropositionType.NOT_CONTAINS_VALUES_DESC:
          const __values = complement.values.map((v) => `\'${v}\'`).map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `does not contain one of the values in the list: [${this.valueOrBlank(__values.join(','))}].`;
        default:
          return this.labelsMap[complement.complementKey];
      }
    }
    return '';
  }

  complete() {
    return this.subject.isComplete() && this.verbValid() && this.statementValid() && this.comparisonValid();
  }

  pathValid(context: IPath, path: IPath) {
    const ctx = this.pathService.pathToString(context);
    const elm = this.pathService.pathToString(path);
    return elm.startsWith(ctx);
  }

  verbValid() {
    if (this.csType === this._csType.DECLARATION) {
      return this.assertion.verbKey;
    } else {
      return true;
    }
  }

  statementValid() {
    return !!this.assertion.complement.complementKey && (!this.statementValues || !!this.statementValues.valid);
  }

  comparisonValid() {
    if (this.statementType === StatementType.COMPARATIVE) {
      return this.compare.isComplete();
    } else {
      return true;
    }
  }

  switchStatementType() {
    this.compare.clear();
    this.assertion.complement = {
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
      codesyses: [],
    };
  }

  targetElement(event) {
    this.subject.reset(this.token.payload.getValue().effectiveContext, this.pathService.trimPathRoot(event.path), this.res, this.repository, this.token.payload.getValue().effectiveTree, event.node, !!this.token.dependency).pipe(tap((s) => {
      this.changeElement(this.subject, this.assertion.subject);
    })).subscribe();
  }

  comparativeElement(event) {
    this.compare.reset(this.token.payload.getValue().effectiveContext, this.pathService.trimPathRoot(event.path), this.res, this.repository, this.token.payload.getValue().effectiveTree, event.node, !!this.token.dependency).pipe(tap((s) => {
      this.changeElement(this.compare, this.assertion.complement);
    })).subscribe();
  }

  changeElement(obj: StatementTarget, elm: ISubject | IComplement) {
    Object.assign(elm, obj.value);
    if (!obj.node.leaf && this.assertion.complement.complementKey && this.complex_statements_allowed.indexOf(this.assertion.complement.complementKey) === -1) {
      this.assertion.complement.complementKey = undefined;
      this.changeStatement();
    }
    this.change();
  }

  changeOccurrenceType(subject: StatementTarget) {
    subject.clearOccurrenceValue();
    this.change();
  }

  changeStatement() {
    Object.assign(this.assertion.complement, {
      ...this.assertion.complement,
      value: '',
      values: [],
      codesys: '',
      codesyses: [],
      desc: '',
      descs: [],
    });
    this.change();
  }

  changeStatementType() {
    this.assertion.complement = {
      ...this.assertion.complement,
      path: undefined,
      occurenceIdPath: undefined,
      occurenceLocationStr: undefined,
      occurenceValue: undefined,
      occurenceType: undefined,
      complementKey: undefined,
      value: '',
      values: [],
      codesys: '',
      codesyses: [],
      desc: '',
      descs: [],
    };
    this.compare.setSubject(this.assertion.complement as ISubject, this.token.payload.getValue().effectiveContext, this.res, this.repository);
    this.change();
  }

  updateTokenStatus() {
    if (this.token) {
      this.token.valid = this.complete();
    }
  }

  clearStatementTargetElements() {
    this.subject.clear();
    this.compare.clear();
  }

  removeStr(list: any[], i: number) {
    list.splice(i, 1);
    this.change();
  }

  addStr(list: any[]) {
    list.push('');
    this.change();
  }

  removeStrDesc(list: any[], descs: any[], i: number) {
    list.splice(i, 1);
    descs.splice(i, 1);
    this.change();
  }

  addStrDesc(list: any[], descs: any[]) {
    list.push('');
    descs.push('');
    this.change();
  }

}
