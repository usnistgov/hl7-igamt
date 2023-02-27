import { EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, flatMap, skip } from 'rxjs/operators';
import { Type } from '../../constants/type.enum';
import { OccurrenceType } from '../../models/conformance-statements.domain';
import { IPath } from '../../models/cs.interface';
import { IResource } from '../../models/resource.interface';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { AResourceRepositoryService, StoreResourceRepositoryService } from '../../services/resource-repository.service';
import { StatementTarget } from '../../services/statement.service';
import { IHL7v2TreeFilter, ITreeRestriction, RestrictionType } from '../../services/tree-filter.service';
import { IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';
import { IToken, Statement } from '../pattern-dialog/cs-pattern.domain';
import { IOption, NB_OCCURRENCES, TARGET_OCCURRENCES } from './cs-statement.constants';

export interface IStatementTokenPayload {
  effectiveTree: IHL7v2TreeNode[];
  effectiveContext: IPath;
  active?: IHL7v2TreeNode;
  activeNodeRootPath?: IPath;
}

export interface ISubjectTreeRestrictions {
  excludedPaths?: ITreeRestriction<any>;
  primitive?: ITreeRestriction<any>;
  types?: ITreeRestriction<any>;
}

export abstract class CsStatementComponent<T> implements OnInit, OnDestroy {

  @Input()
  resourceType: Type;
  @Input()
  collapsed = false;
  @Input()
  set token(token: IToken<Statement, IStatementTokenPayload>) {
    this._token = token;
    this.value = token.value.payload;
    // Listen to payload changes
    this.closeSubscription(this.payloadSubscription);
    this.payloadSubscription = this.token.payload.pipe(
      skip(1),
    ).subscribe((value) => {
      this.onOwnPayloadUpdate(value);
    });
  }

  get token() {
    return this._token;
  }

  @Input()
  rootTree: IHL7v2TreeNode[];
  @Input()
  set resource(r: IResource) {
    this.res = r;
  }
  @Input()
  set excludePaths(paths: string[]) {
    this.updateSubjectTreeFilter({
      excludedPaths: {
        criterion: RestrictionType.PATH,
        allow: false,
        value: paths.map((path) => {
          return {
            path,
            excludeChildren: true,
          };
        }),
      },
    });
  }

  @Output()
  valueChange: EventEmitter<T>;
  @Input()
  repository: AResourceRepositoryService;

  res: IResource;
  _occurrenceType = OccurrenceType;
  _token: IToken<Statement, IStatementTokenPayload>;
  value: T;
  payloadSubscription: Subscription;
  subjectTreeRestrictions: ISubjectTreeRestrictions;
  treeFilter: IHL7v2TreeFilter;

  constructor(
    private treeService: Hl7V2TreeService,
    public baseTreeFilter: IHL7v2TreeFilter,
    private blank: T) {
    this.valueChange = new EventEmitter<T>();
    this.value = Object.assign({}, this.blank);
    this.updateSubjectTreeFilter({});
  }

  updateSubjectTreeFilter(restrictions: ISubjectTreeRestrictions) {
    this.subjectTreeRestrictions = {
      ...this.subjectTreeRestrictions,
      ...restrictions,
    };

    this.treeFilter = {
      ...this.baseTreeFilter,
      restrictions: [
        ...(this.baseTreeFilter.restrictions || []),
        ...(this.subjectTreeRestrictions.excludedPaths ? [this.subjectTreeRestrictions.excludedPaths] : []),
        ...(this.subjectTreeRestrictions.primitive ? [this.subjectTreeRestrictions.primitive] : []),
        ...(this.subjectTreeRestrictions.types ? [this.subjectTreeRestrictions.types] : []),
      ],
    };
  }

  public min(a: number, b: number) {
    return Math.min(a === undefined ? Number.MAX_VALUE : a, b === undefined ? Number.MAX_VALUE : b);
  }

  public abstract complete(): boolean;
  public abstract clearStatementTargetElements(): void;
  public abstract initializeStatement(token: IToken<Statement, IStatementTokenPayload>);
  public abstract change(): void;

  onOwnPayloadUpdate(payload: IStatementTokenPayload) {
    // When payload change clear the Target Data Elements of the statement if no active node is selected
    // This allows to skip clearing data elements, when the change comes from selecting a different data element
    if (!payload.active) {
      this.clearStatementTargetElements();
      this.change();
    }
  }

  getAllowedOccurrenceList(subject: StatementTarget): IOption[] {
    if (subject && subject.repeatMax > 0) {
      if (subject.hierarchicalRepeat) {
        return [...NB_OCCURRENCES];
      } else {
        return [...NB_OCCURRENCES, ...TARGET_OCCURRENCES];
      }
    } else {
      return [];
    }
  }

  closeSubscription(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }

  findNode(path: IPath, tree: IHL7v2TreeNode[]): Observable<IHL7v2TreeNode> {
    return path ? this.treeService.loadNodeChildren(tree[0], this.repository).pipe(
      flatMap((children) => {
        return this.treeService.getNodeByPath(children, path, this.repository).pipe(
          catchError(() => {
            return of(undefined);
          }),
        )
      }),
      catchError(() => {
        return of(undefined);
      }),
    ) : of(undefined);
  }


  ngOnInit() {
    // Initialize Statement
    this.initializeStatement(this.token);
  }

  ngOnDestroy(): void {
    this.closeSubscription(this.payloadSubscription);
  }

}
