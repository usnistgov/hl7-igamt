import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { finalize, flatMap, map, take, tap } from 'rxjs/operators';
import { ComparativeType, DeclarativeType, OccurrenceType, PropositionType, StatementType } from '../../models/conformance-statements.domain';
import { AssertionMode, IComplement, IPath, ISimpleAssertion, ISubject } from '../../models/cs.interface';
import { ElementNamingService } from '../../services/element-naming.service';
import { PathService } from '../../services/path.service';
import { StatementTarget } from '../../services/statement.service';
import { IHL7v2TreeFilter, ITreeRestriction, RestrictionCombinator, RestrictionType } from '../../services/tree-filter.service';
import { CsStatementComponent, IStatementTokenPayload } from '../cs-dialog/cs-statement.component';
import { ALL_OCCURRENCES, COMPARATIVES, DECLARATIVES, IOption, PROPOSITIONS, VERBS_SHOULD } from '../cs-dialog/cs-statement.constants';
import { IToken, LeafStatementType, Statement } from '../pattern-dialog/cs-pattern.domain';
import { ConformanceStatementStrength } from './../../models/conformance-statements.domain';
import { Hl7V2TreeService } from './../../services/hl7-v2-tree.service';
import { VERBS_SHALL } from './../cs-dialog/cs-statement.constants';

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
  _strength: ConformanceStatementStrength;

  subject: StatementTarget;
  compare: StatementTarget;

  csType: LeafStatementType;
  statementType: StatementType = StatementType.DECLARATIVE;
  assertion: ISimpleAssertion;
  clearCompareNode: EventEmitter<boolean> = new EventEmitter<boolean>();
  clearSubjectNode: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  set referenceChangeMap(referenceChangeMap: Record<string, string>) {
    this.subject.setReferenceChangeMap(referenceChangeMap);
    this.compare.setReferenceChangeMap(referenceChangeMap);
  }

  @Input()
  predicateMode: boolean;
  @Input()
  set strength(str: ConformanceStatementStrength) {
    this._strength = str;
    switch (str) {
      case ConformanceStatementStrength.SHALL:
        this.verbs = [...VERBS_SHALL];
        break;
      case ConformanceStatementStrength.SHOULD:
        this.verbs = [...VERBS_SHOULD];
        break;
      default:
        this.verbs = [];
    }

    if (this.assertion && this.assertion.verbKey) {
      this.updateVerb(str, this.assertion);
    }
  }

  id: string;
  compareTreeFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [],
  };
  statementsList: IOption[];
  subjectOccurrenceList: IOption[];
  compareOccurrenceList: IOption[];
  verbs: IOption[];

  private numberDatatypes: string[] = ['NM', 'SI'];
  private timeDatatypes: string[] = ['DT', 'DTM', 'TM'];

  @ViewChild('statementValues', { read: NgForm }) statementValues: NgForm;

  @Input()
  set type(type: LeafStatementType) {
    this.csType = type;
    if (this.csType === LeafStatementType.DECLARATION) {
      this.updateSubjectTreeFilter({
        primitive: {
          criterion: RestrictionType.PRIMITIVE,
          combine: RestrictionCombinator.ENFORCE,
          allow: true,
          value: true,
        },
      });
    }
  }

  declarative_statements = DECLARATIVES;
  comparative_statements = COMPARATIVES;
  proposition_statements = PROPOSITIONS;

  complex_statements_allowed: string[] = [
    PropositionType.VALUED,
    PropositionType.NOT_VALUED,
  ];

  compare_not_temporal: string[] = [
    ComparativeType.IDENTICAL,
    ComparativeType.EQUIVALENT,
    ComparativeType.TRUNCATED_EQUIVALENT,
  ];

  labelsMap = {};

  valueListContainsInvalidValues: boolean;
  invalidValueErrorMessage = 'Invalid value provided, the only allowed characters are:  numbers, letters, - (dash), _ (underscore), . (period), \\ (backslash) and spaces. The value shall not start or end with a space.';
  valueListStatementTypes: string[] = [
    DeclarativeType.CONTAINS_VALUES,
    DeclarativeType.CONTAINS_VALUES_DESC,
    DeclarativeType.CONTAINS_CODES,
    DeclarativeType.CONTAINS_CODES_DESC,
    PropositionType.NOT_CONTAINS_VALUES,
    PropositionType.NOT_CONTAINS_VALUES_DESC,
  ].map((v) => v as string);

  constructor(
    elementNamingService: ElementNamingService,
    private pathService: PathService,
    treeService: Hl7V2TreeService,
  ) {
    super(
      treeService,
      {
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
    const allOccurrenceOptions = [...ALL_OCCURRENCES];
    const allVerbs = [...VERBS_SHALL, ...VERBS_SHOULD];
    this.subject = new StatementTarget(elementNamingService, pathService, allOccurrenceOptions);
    this.compare = new StatementTarget(elementNamingService, pathService, allOccurrenceOptions);
    this.map(allVerbs);
    this.map(allOccurrenceOptions);
    this.map(this.declarative_statements);
    this.map(this.comparative_statements);
    this.map(this.proposition_statements);
  }

  validateValueList() {
    if (this.valueListStatementTypes.includes(this.assertion.complement.complementKey) && this.assertion.complement.values) {
      for (const value of this.assertion.complement.values) {
        if (value && !/^[0-9a-zA-Z\-_.\\]+( +[0-9a-zA-Z\-_.\\]+)*$/.test(value)) {
          this.valueListContainsInvalidValues = true;
          return;
        }
      }
      this.valueListContainsInvalidValues = false;
    }
  }

  updateVerb(strength: ConformanceStatementStrength, assertion: ISimpleAssertion) {
    if (assertion && assertion.verbKey) {
      switch (strength) {
        case ConformanceStatementStrength.SHALL:
          const idxShould = VERBS_SHOULD.map((v) => v.value).findIndex((v) => assertion.verbKey === v);
          if (idxShould !== -1) {
            this.assertion.verbKey = VERBS_SHALL[idxShould].value;
            this.changeVerbType();
          }
          break;
        case ConformanceStatementStrength.SHOULD:
          const idxShall = VERBS_SHALL.map((v) => v.value).findIndex((v) => assertion.verbKey === v);
          if (idxShall !== -1) {
            this.assertion.verbKey = VERBS_SHOULD[idxShall].value;
            this.changeVerbType();
          }
          break;
      }
    }
  }

  getPrimitiveType(name: string): 'NUMBER' | 'TEMPORAL' | 'ANY' {
    if (this.numberDatatypes.includes(name)) {
      return 'NUMBER';
    } else if (this.timeDatatypes.includes(name)) {
      return 'TEMPORAL';
    } else {
      return 'ANY';
    }
  }

  initializeStatement(token: IToken<Statement, IStatementTokenPayload>) {
    this.assertion = token.value.payload;
    if (Object.values(ComparativeType).includes(this.assertion.complement.complementKey as ComparativeType)) {
      this.statementType = StatementType.COMPARATIVE;
    } else {
      this.statementType = StatementType.DECLARATIVE;
    }
    this.setSubjectTreeFilter(token.value.data.branch, this.statementType);
    this.valueChange.emit(this.assertion);
    this.validateValueList();
    combineLatest(
      this.subject.setSubject(token.value.payload.subject as ISubject, token.payload.getValue().effectiveContext, this.res, this.repository),
      this.compare.setSubject(token.value.payload.complement as ISubject, token.payload.getValue().effectiveContext, this.res, this.repository),
    ).pipe(
      flatMap(() => {
        return combineLatest(
          this.findNode(
            this.subject.getValue().path,
            token.payload.getValue().effectiveTree,
            {
              transformer: this.transformer,
              useProfileComponentRef: true,
            },
          ).pipe(
            tap((node) => {
              if (node) {
                this.subject.setNode(node, token.payload.getValue().effectiveTree);
              }
              this.statementsList = this.getAllowedStatements(this.subject, token.value.data.branch, this.statementType);
              this.subjectOccurrenceList = this.getAllowedOccurrenceList(this.subject, this.assertion);
            }),
          ),
          this.findNode(
            this.compare.getValue().path,
            token.payload.getValue().effectiveTree,
            {
              transformer: this.transformer,
              useProfileComponentRef: true,
            },
          ).pipe(
            tap((node) => {
              if (node) {
                this.compare.setNode(node, token.payload.getValue().effectiveTree);
              }
              this.compareOccurrenceList = this.getAllowedOccurrenceList(this.compare, this.assertion);
            }),
          ),
        );
      }),
      finalize(() => this.updateTokenStatus()),
    ).subscribe();
  }

  changeCase(complement: IComplement, caseValue) {
    complement.ignoreCase = !caseValue.checked;
    this.change();
  }

  map(list: Array<{ label: string, value: string }>) {
    for (const item of list) {
      this.labelsMap[item.value] = item.label;
    }
  }

  getAllowedStatements(subject: StatementTarget, statementType: LeafStatementType, mode: StatementType) {
    if (statementType === LeafStatementType.PROPOSITION) {
      return this.getAllowedPropositionStatements(subject);
    } else {
      if (mode === StatementType.DECLARATIVE) {
        return this.declarative_statements;
      } else {
        return this.getAllowedComparativeStatements(subject);
      }
    }
  }

  getAllowedPropositionStatements(subject: StatementTarget) {
    return this.proposition_statements.filter((st) => {
      if (subject.valid && subject.complex) {
        return this.complex_statements_allowed.indexOf(st.value) !== -1;
      } else {
        return true;
      }
    });
  }

  getAllowedComparativeStatements(subject: StatementTarget) {
    return this.comparative_statements.filter((st) => {
      if (!subject.valid) {
        return true;
      } else if (subject.isPrimitive()) {
        const type = this.getPrimitiveType(subject.resourceName);
        if (type !== 'TEMPORAL') {
          return this.compare_not_temporal.includes(st.value);
        } else {
          return true;
        }
      }
      return this.compare_not_temporal.includes(st.value);
    });
  }

  change() {
    this.validateValueList();
    combineLatest(
      this.subject.getDescription(this.res, this.repository, !!this.token.dependency),
      this.compare.getDescription(this.res, this.repository, !!this.token.dependency),
    ).pipe(
      take(1),
      map(([node, compNode]) => {
        const verb = this.labelsMap[this.assertion.verbKey];
        const statement = this.getStatementLiteral(this.assertion.complement);
        this.assertion.description = `${node} ${this.csType === LeafStatementType.DECLARATION ? this.valueOrBlank(verb).toLowerCase() : ''} ${this.valueOrBlank(statement)} ${this.statementType === StatementType.COMPARATIVE ? compNode : ''}`;
        Object.assign(this.assertion.subject, {
          ...this.subject.value,
        });
        Object.assign(this.assertion.complement, {
          ...this.compare.value,
        });
        setTimeout(() => {
          this.updateTokenStatus();
          this.valueChange.emit(this.assertion);
        });
      }),
    ).subscribe();
  }

  valueOrBlank(val): string {
    return val ? val : '_';
  }

  trackByFn(index, item) {
    return index;
  }

  getCaseStr(complement: IComplement): string {
    return `(${complement.ignoreCase ? 'Case Insensitive' : 'Case Sensitive'})`;
  }

  getStatementLiteral(complement: IComplement): string {
    const add_s = this.csType === LeafStatementType.PROPOSITION ? 's' : '';
    const add_es = this.csType === LeafStatementType.PROPOSITION ? 'es' : '';
    if (complement) {
      switch (complement.complementKey) {
        case DeclarativeType.CONTAINS_VALUE:
          return `contain${add_s} the value \'${this.valueOrBlank(complement.value)}\' ${this.getCaseStr(complement)}.`;
        case PropositionType.NOT_CONTAINS_VALUE:
          return `does not contain the value \'${this.valueOrBlank(complement.value)}\' ${this.getCaseStr(complement)}.`;
        case DeclarativeType.CONTAINS_VALUE_DESC:
          return `contain${add_s} the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}) ${this.getCaseStr(complement)}.`;
        case PropositionType.NOT_CONTAINS_VALUE_DESC:
          return `does not contain the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}) ${this.getCaseStr(complement)}.`;
        case DeclarativeType.CONTAINS_CODE:
          return `contain${add_s} the value \'${this.valueOrBlank(complement.value)}\' drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_CODE_DESC:
          return `contain${add_s} the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}) drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_VALUES:
          return `contain${add_s} one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}] ${this.getCaseStr(complement)}.`;
        case DeclarativeType.CONTAINS_VALUES_DESC:
          const values = complement.values.map((v) => '\'' + v + '\'').map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `contain${add_s} one of the values in the list: [${this.valueOrBlank(values.join(','))}] ${this.getCaseStr(complement)}.`;
        case PropositionType.NOT_CONTAINS_VALUES:
          return `does not contain one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}] ${this.getCaseStr(complement)}.`;
        case DeclarativeType.CONTAINS_CODES:
          return `contain${add_s} one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}] drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_CODES_DESC:
          const _values = complement.values.map((v) => `\'${v}\'`).map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `contain${add_s} one of the values in the list: [${this.valueOrBlank(_values.join(','))}] drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_REGEX:
          return `match${add_es} the regular expression \'${this.valueOrBlank(complement.value)}\'.`;
        case PropositionType.NOT_CONTAINS_VALUES_DESC:
          const __values = complement.values.map((v) => `\'${v}\'`).map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `does not contain one of the values in the list: [${this.valueOrBlank(__values.join(','))}] ${this.getCaseStr(complement)}.`;
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
      this.subjectOccurrenceList = this.getAllowedOccurrenceList(this.subject, this.assertion);
      this.statementsList = this.getAllowedStatements(this.subject, this.csType, this.statementType);
      if (
        this.assertion.complement.complementKey &&
        this.statementsList.findIndex((x) => this.assertion.complement.complementKey === x.value) === -1
      ) {
        this.assertion.complement.complementKey = undefined;
        this.changeStatement();
      }
      this.changeElement(this.subject, this.assertion.subject);
      this.setCompareTreeFilter(this.subject);
      this.compare.clear(this.clearCompareNode);
    })).subscribe();
  }

  comparativeElement(event) {
    this.compare.reset(this.token.payload.getValue().effectiveContext, this.pathService.trimPathRoot(event.path), this.res, this.repository, this.token.payload.getValue().effectiveTree, event.node, !!this.token.dependency).pipe(tap((s) => {
      this.compareOccurrenceList = this.getAllowedOccurrenceList(this.compare, this.assertion);
      this.changeElement(this.compare, this.assertion.complement);
    })).subscribe();
  }

  changeElement(obj: StatementTarget, elm: ISubject | IComplement) {
    Object.assign(elm, obj.value);
    this.change();
  }

  changeOccurrenceType(subject: StatementTarget) {
    subject.clearOccurrenceValue();
    this.change();
  }

  removeOccurrence(subject: StatementTarget) {
    subject.clearOccurrenceValue(true);
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

  changeVerbType() {
    this.subjectOccurrenceList = this.getAllowedOccurrenceList(this.subject, this.assertion);
    this.compareOccurrenceList = this.getAllowedOccurrenceList(this.compare, this.assertion);
    const subjectIsValid = !this.assertion.subject.occurenceType || !!this.subjectOccurrenceList.find((option) => option.value === this.assertion.subject.occurenceType);
    const complementIsValid = !this.assertion.complement || !this.assertion.complement.occurenceType || this.compareOccurrenceList.find((option) => option.value === this.assertion.complement.occurenceType);

    if (!subjectIsValid) {
      this.subject.clearOccurrenceValue(true);
    }

    if (!complementIsValid) {
      this.compare.clearOccurrenceValue(true);
    }

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
    this.compare.clear(this.clearCompareNode);
    this.subject.clear(this.clearSubjectNode);
    this.statementsList = this.getAllowedStatements(this.subject, this.csType, this.statementType);
    this.setSubjectTreeFilter(this.csType, this.statementType);
    this.change();
  }

  setSubjectTreeFilter(statementType: LeafStatementType, mode: StatementType) {
    if (mode === StatementType.COMPARATIVE) {
      this.updateSubjectTreeFilter({
        primitive: {
          criterion: RestrictionType.PRIMITIVE,
          combine: RestrictionCombinator.ENFORCE,
          allow: true,
          value: true,
        },
        types: null,
      });
    } else {
      if (statementType === LeafStatementType.DECLARATION) {
        this.updateSubjectTreeFilter({
          primitive: {
            criterion: RestrictionType.PRIMITIVE,
            combine: RestrictionCombinator.ENFORCE,
            allow: true,
            value: true,
          },
          types: null,
        });
      } else {
        this.updateSubjectTreeFilter({
          primitive: null,
          types: null,
        });
      }
    }
  }

  setCompareTreeFilter(subject: StatementTarget) {
    if (subject && subject.node) {
      const restriction: ITreeRestriction<any> = {
        criterion: RestrictionType.DATATYPES,
        combine: RestrictionCombinator.ENFORCE,
        allow: true,
        value: [],
      };

      const name = this.subject.resourceName;
      const type = this.getPrimitiveType(name);
      switch (type) {
        case 'NUMBER':
          restriction.value = [...this.numberDatatypes];
          restriction.allow = true;
          break;
        case 'TEMPORAL':
          restriction.value = [name];
          restriction.allow = true;
          break;
        default:
          restriction.value = [...this.numberDatatypes, ...this.timeDatatypes];
          restriction.allow = false;
      }

      this.compareTreeFilter = {
        hide: false,
        restrictions: [
          {
            criterion: RestrictionType.PRIMITIVE,
            combine: RestrictionCombinator.ENFORCE,
            allow: true,
            value: true,
          },
          restriction,
        ],
      };
    }
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
