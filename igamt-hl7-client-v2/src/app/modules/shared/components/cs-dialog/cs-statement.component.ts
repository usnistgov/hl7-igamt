import { EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { Type } from '../../constants/type.enum';
import { OccurrenceType } from '../../models/conformance-statements.domain';
import { IPath } from '../../models/cs.interface';
import { IResource } from '../../models/resource.interface';
import { AResourceRepositoryService } from '../../services/resource-repository.service';
import { IHL7v2TreeFilter, RestrictionType } from '../../services/tree-filter.service';
import { IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';
import { Statement, Token } from '../pattern-dialog/cs-pattern.domain';

export interface IStatementTokenPayload {
  effectiveTree: IHL7v2TreeNode[];
  effectiveContext: IPath;
  active?: IHL7v2TreeNode;
  activeNodeRootPath?: IPath;
}

export abstract class CsStatementComponent<T> implements OnInit, OnDestroy {

  @Input()
  resourceType: Type;
  @Input()
  collapsed = false;
  @Input()
  set token(token: Token<Statement, IStatementTokenPayload>) {
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
    this.treeFilter.restrictions.push(
      {
        criterion: RestrictionType.PATH,
        allow: false,
        value: paths.map((path) => {
          return {
            path,
            excludeChildren: true,
          };
        }),
      },
    );
  }

  @Output()
  valueChange: EventEmitter<T>;
  @Input()
  repository: AResourceRepositoryService;

  res: IResource;
  _occurrenceType = OccurrenceType;
  _token: Token<Statement, IStatementTokenPayload>;
  value: T;
  payloadSubscription: Subscription;

  constructor(public treeFilter: IHL7v2TreeFilter, private blank: T) {
    this.valueChange = new EventEmitter<T>();
    this.value = Object.assign({}, this.blank);
  }

  public min(a: number, b: number) {
    return Math.min(a === undefined ? Number.MAX_VALUE : a, b === undefined ? Number.MAX_VALUE : b);
  }

  public abstract complete(): boolean;
  public abstract clearStatementTargetElements(): void;
  public abstract initializeStatement(token: Token<Statement, IStatementTokenPayload>);
  public abstract change(): void;

  onOwnPayloadUpdate(payload: IStatementTokenPayload) {
    // When payload change clear the Target Data Elements of the statement if no active node is selected
    // This allows to skip clearing data elements, when the change comes from selecting a different data element
    if (!payload.active) {
      this.clearStatementTargetElements();
      this.change();
    }
  }

  closeSubscription(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }

  ngOnInit() {
    // Initialize Statement
    this.initializeStatement(this.token);
  }

  ngOnDestroy(): void {
    this.closeSubscription(this.payloadSubscription);
  }

}
