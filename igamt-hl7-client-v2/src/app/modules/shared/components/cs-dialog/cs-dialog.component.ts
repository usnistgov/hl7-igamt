import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { BehaviorSubject, from, Observable, of, Subject, Subscription } from 'rxjs';
import { concatMap, finalize, flatMap, map, skip, take, takeWhile, tap } from 'rxjs/operators';
import { ProfileComponentService } from 'src/app/modules/profile-component/services/profile-component.service';
import * as vk from 'vkbeautify';
import { xml as xmlFormat } from 'vkbeautify';
import { Type } from '../../constants/type.enum';
import { ConditionalUsageOptions } from '../../constants/usage.enum';
import { AssertionMode, ConstraintType, IAssertionConformanceStatement, IFreeTextConformanceStatement, IPath } from '../../models/cs.interface';
import { IPredicate } from '../../models/predicate.interface';
import { IResource } from '../../models/resource.interface';
import { ConformanceStatementService } from '../../services/conformance-statement.service';
import { CsDescriptionService } from '../../services/cs-description.service';
import { ElementNamingService } from '../../services/element-naming.service';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { PathService } from '../../services/path.service';
import { StoreResourceRepositoryService } from '../../services/resource-repository.service';
import { IHL7v2TreeFilter, RestrictionCombinator, RestrictionType } from '../../services/tree-filter.service';
import { IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';
import { BinaryOperator, IfThenOperator, IToken, LeafStatementType, Pattern, Statement, StatementIdIndex, TokenType } from '../pattern-dialog/cs-pattern.domain';
import { PatternDialogComponent } from '../pattern-dialog/pattern-dialog.component';
import { ConformanceStatementStrength } from './../../models/conformance-statements.domain';
import { IAssertion } from './../../models/cs.interface';
import { IStatementTokenPayload } from './cs-statement.component';

export type AssertionContainer = IAssertionConformanceStatement | IFreeTextConformanceStatement | IPredicate;

export enum CsTab {
  SIMPLE = 'Simple',
  CONDITIONAL = 'Conditional',
  FREE = 'Free Text',
  COMPLEX = 'Complex',
}

@Component({
  selector: 'app-cs-dialog',
  templateUrl: './cs-dialog.component.html',
  styleUrls: ['./cs-dialog.component.scss'],
})
export class CsDialogComponent implements OnDestroy {

  get pattern() {
    return this._pattern;
  }

  set pattern(p: Pattern) {
    // Set the payload of each token upon initialization
    this.setPatternTokenPayload(p).pipe(
      finalize(() => {
        this._pattern = p;
      }),
    ).subscribe();
  }

  xmlEditorOptions = {
    theme: 'monokai',
    mode: 'xml',
    lineNumbers: true,
    foldGutter: true,
    styleActiveLine: true,
    autoCloseTags: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    matchBrackets: true,
    extraKeys: { 'Alt-F': 'findPersistent' },
    lineWrapping: true,
    placeholder:
      `<Assertion>
<!-- your assertion -->
</Assertion>`,
  };

  constructor(
    private csService: ConformanceStatementService,
    private dialog: MatDialog,
    private treeService: Hl7V2TreeService,
    private elementNamingService: ElementNamingService,
    private pathService: PathService,
    private profileComponentService: ProfileComponentService,
    public dialogRef: MatDialogRef<CsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public repository: StoreResourceRepositoryService,
    private descriptionService: CsDescriptionService) {
    this.ifThenPattern = new IfThenOperator(LeafStatementType.DECLARATION, null, 0);
    this.ifThenPattern.complete(new StatementIdIndex());

    this.xmlExpression = new BehaviorSubject({
      isSet: false,
      value: undefined,
    });

    this.predicateMode = data.predicateMode || data.assertionMode;
    this.assertionMode = data.assertionMode;
    this.title = data.title;
    this.excludePaths = data.excludePaths || [];
    this.hideFreeText = data.hideFreeText;
    this.transformer = data.transformer;

    this.referenceChangeMap = data.referenceChangeMap;

    this.predicateElementId = data.predicateElementId;
    if (this.predicateMode && this.predicateElementId) {
      this.excludePaths = [
        ...this.excludePaths,
        this.predicateElementId,
      ];
      this.contextFilter.restrictions = [{
        criterion: RestrictionType.PARENTS,
        combine: RestrictionCombinator.ENFORCE,
        allow: true,
        value: this.excludePaths[0],
      }, {
        criterion: RestrictionType.TYPE,
        combine: RestrictionCombinator.ENFORCE,
        allow: true,
        value: [Type.CONFORMANCEPROFILE, Type.GROUP],
      }];
    }

    this.s_resource = data.resource.subscribe(
      (resource: IResource) => {
        this.resourceType = resource.type;
        this.resource = resource;
        this.treeService.getTree(resource, this.repository, true, true, (value) => {
          this.profileComponentService.applyTransformer(value, this.transformer).pipe(
            take(1),
            tap((nodes: IHL7v2TreeNode[]) => {
              this.structure = [
                {
                  data: {
                    id: resource.id,
                    pathId: resource.id,
                    name: resource.name,
                    type: resource.type,
                    rootPath: { elementId: resource.id },
                    position: 0,
                  },
                  children: [...nodes],
                  parent: undefined,
                },
              ];
              this.context = this.structure;
              this.contextName = resource.name;
              this.contextType = resource.type;
              if (!this.assertionMode) {
                this.conformanceStatement = data.payload;
              } else {
                this.setAssertion(data.assertion, data.context);
              }
            }),
          ).subscribe();
        });
      },
    );
  }

  set conformanceStatement(cs: AssertionContainer) {
    if (cs) {
      this.cs = cs;
      this.backUp = _.cloneDeep(cs);
      this.setContext(cs.context);
      if (cs.type === ConstraintType.ASSERTION) {
        this.pattern = this.csService.getCsPattern((cs as IAssertionConformanceStatement).assertion, this.predicateMode);
        this.activeTab = this.getTabForPattern(this.pattern);
      } else {
        this.activeTab = CsTab.FREE;
      }
    } else {
      this.activeTab = undefined;
    }
  }

  _pattern: Pattern;
  activeTab: CsTab;
  csType = ConstraintType;
  tabType = CsTab;
  cs: AssertionContainer;
  resource: IResource;
  statementsValidity: boolean[];
  backUp: AssertionContainer;
  resourceType: Type;
  title: string;
  hideAdvanced: boolean;
  ifThenPattern: BinaryOperator;
  structure: IHL7v2TreeNode[];
  context: IHL7v2TreeNode[];
  s_resource: Subscription;
  showContext: boolean;
  contextName: string;
  contextType: string;
  predicateMode: boolean;
  assertionMode: boolean;
  predicateElementId: string;
  excludePaths: string[];
  options = ConditionalUsageOptions;
  strengthOptions = [{
    label: 'SHALL',
    value: ConformanceStatementStrength.SHALL,
  }, {
    label: 'SHOULD',
    value: ConformanceStatementStrength.SHOULD,
  }];

  contextFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
      {
        criterion: RestrictionType.TYPE,
        allow: true,
        value: [Type.CONFORMANCEPROFILE, Type.GROUP],
      },
    ],
  };
  xmlExpression: Subject<{
    isSet: boolean;
    value: string;
  }>;
  xmlVisible = true;
  activeStatement = 0;
  alive = true;
  hideFreeText = false;
  transformer?: (nodes: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]>;
  referenceChangeMap: Record<string, string> = {};

  @ViewChild('csForm', { read: NgForm }) form: NgForm;

  setPatternTokenPayload(p: Pattern): Observable<any> {
    // For each statement token of the pattern initialize the payload
    return from(p.statements).pipe(
      concatMap((t) => {
        return this.initializePayload(t);
      }),
    );
  }

  initializePayload(token: IToken<Statement, IStatementTokenPayload>): Observable<IToken<Statement, IStatementTokenPayload>> {
    // First resolve the token's dependency
    const pre = token.dependency ? this.initializePayload(token.dependency) : of(undefined);

    // If the token's payload is already set, then it's not initilized
    return !token.payload ? pre.pipe(
      flatMap((dependencyNode: IToken<Statement, IStatementTokenPayload>) => {
        // Once dependency is resolved
        const dependency: IStatementTokenPayload = dependencyNode ? dependencyNode.payload.getValue() : undefined;

        // Compute the token's payload based on the dependency payload and token path and type
        return this.getTokenPayload(dependency, token.value.data.branch, token.value.payload.path).pipe(
          map((payload) => {

            // Once token payload computed, initialize it as a behavior subject
            token.payload = new BehaviorSubject<IStatementTokenPayload>(payload);
            this.registerOnDependencyPayloadChange(token);
            return token;
          }),
        );
      }),
    ) : of(token);
  }

  registerOnDependencyPayloadChange(token: IToken<Statement, IStatementTokenPayload>) {
    if (token.dependency && token.dependency.payload) {
      token.dependency.payload.pipe(
        skip(1),
        takeWhile(() => this.alive),
      ).subscribe((dependencyPayload) => {
        token.payload.next({
          effectiveTree: dependencyPayload.active ? [dependencyPayload.active] : this.structure,
          effectiveContext: dependencyPayload.activeNodeRootPath,
          active: undefined,
          activeNodeRootPath: undefined,
        });
      });
    }
  }

  getTokenPayload(dependency: IStatementTokenPayload, type: LeafStatementType, pathValue?: any): Observable<IStatementTokenPayload> {
    // the token's effective context is either it's dependency's active path from root or the root context
    const effectiveContext = dependency ? dependency.activeNodeRootPath : this.cs.context;

    // the token's active path from root if applicable (only on context statements) is it's effective context path + it's path value
    const activeNodeRootPath = type === LeafStatementType.CONTEXT && pathValue ?
      this.pathService.straightConcatPath(effectiveContext, pathValue) : undefined;

    // Get the effective Tree for the token
    const tree$ = (!effectiveContext ? of(this.structure) : this.treeService.getNodeByPath(
      this.context[0].children,
      effectiveContext,
      this.repository,
      {
        transformer: this.transformer,
        useProfileComponentRef: true,
      },
    ).pipe(
      map((node) => [node]),
    ));

    return tree$.pipe(
      map((tree) => ({
        effectiveTree: tree,
        effectiveContext,
        activeNodeRootPath,
      })),
    );
  }

  toggleStatement(id: number) {
    if (this.activeTab !== CsTab.SIMPLE) {
      if (id === this.activeStatement) {
        this.activeStatement = -1;
      } else {
        this.activeStatement = id;
      }
    }
  }

  selectContext(node: IHL7v2TreeNode, path: IPath) {
    if (node.data.type === Type.GROUP) {
      // If selected context is a group, update CS context and get name
      this.cs.context = path;
      this.cs.level = Type.GROUP;
      this.structure = [
        node,
      ];
      this.elementNamingService.getStringNameFromPath(this.cs.context, this.resource, this.repository, {
        referenceChange: this.referenceChangeMap,
      }).pipe(
        take(1),
        map((value) => {
          this.contextName = value;
          this.contextType = Type.GROUP;
        }),
      ).subscribe();
    } else {
      // If it's the root, then clear the cs context
      this.cs.context = undefined;
      this.cs.level = node.data.type;
      this.contextType = node.data.type;
      this.contextName = node.data.name;
      this.structure = [
        node,
      ];
    }
    this.showContext = false;
  }

  resetPatternTokenPayload() {
    // To reset the payload of the token pattern
    this.pattern.statements
      .filter((statement) => !statement.dependency)
      .forEach((statement) => {
        this.getTokenPayload(undefined, statement.value.data.branch).subscribe((value) => statement.payload.next(value));
      });
  }

  selectContextNode(node) {
    this.selectContext(node.node, this.pathService.trimPathRoot(node.path));
    this.showContext = false;
    this.resetPatternTokenPayload();
    this.setActiveWithoutDependencies();
  }

  setContext(path: IPath) {
    if (path) {
      const node = this.getNode(this.context[0].children, path);
      this.selectContext(node, path);
    } else {
      this.selectContext(this.context[0], path);
    }
  }

  getNode(tree: IHL7v2TreeNode[], path: IPath): IHL7v2TreeNode {
    if (path) {
      const elm = tree.filter((e: IHL7v2TreeNode) => e.data.id === path.elementId);
      if (!elm || elm.length !== 1) {
        return undefined;
      } else {
        if (path.child) {
          return this.getNode(elm[0].children, path.child);
        } else {
          return elm[0];
        }
      }
    }
    return undefined;
  }

  valid() {
    if (!this.form) {
      return false;
    } else if (this.activeTab === CsTab.FREE && this.form) {
      return this.form.valid;
    } else if (this.activeTab !== CsTab.FREE && this.form) {
      return this.statementsValid() && this.form.valid;
    } else {
      return false;
    }
  }

  generateXMLExpression() {
    const processValue = (value: string) => {
      this.xmlVisible = true;
      this.xmlExpression.next({
        isSet: true,
        value: vk.xml(value),
      });
    };

    if (this.statementsValid()) {
      if (this.predicateMode) {
        return this.csService.generateXMLfromPredicate(this.cs as IPredicate, this.resource.id, this.resourceType).pipe(
          tap(processValue),
        ).subscribe();
      } else {
        return this.csService.generateXMLfromCs(this.cs, this.resource.id, this.resourceType).pipe(
          tap(processValue),
        ).subscribe();
      }
    }
  }

  formatXML() {
    if (this.cs.type === ConstraintType.FREE) {
      const freeText = this.cs as IFreeTextConformanceStatement;
      if (freeText.assertionScript) {
        freeText.assertionScript = xmlFormat(freeText.assertionScript, 4);
      }
    }
  }

  statementsValid() {
    if (this.pattern && this.pattern.statements) {
      let statementsValidity = true;
      this.pattern.statements.forEach((p) => {
        statementsValidity = statementsValidity && p.valid;
      });

      return statementsValidity;
    }
    return false;
  }

  setAssertion(assertion: IAssertion, context: IPath) {
    this.cs = {
      identifier: undefined,
      level: this.resourceType,
      type: undefined,
      assertion: undefined,
      context,
    };
    this.setContext(context);
    if (assertion) {
      this.pattern = this.csService.getCsPattern(assertion, this.predicateMode);
      this.activeTab = this.getTabForPattern(this.pattern);
      this.cs.assertion = assertion;
      this.cs.type = ConstraintType.ASSERTION;
      this.backUp = _.cloneDeep(this.cs);
    }
  }

  change() {
    this.xmlExpression.next({
      isSet: false,
      value: undefined,
    });

    if (this.cs.type === ConstraintType.ASSERTION) {
      const cs = (this.cs as IAssertionConformanceStatement);
      this.descriptionService.updateAssertionDescription(cs.assertion);
      cs.assertion.description = `${this.capitalize(cs.assertion.description.trim())}`;
      if (cs.assertion.description && cs.assertion.description !== '_' && !cs.assertion.description.startsWith('(')) {
        cs.assertion.description = `${cs.assertion.description}.`;
      }
      if (this.predicateMode) {
        const desc = (this.cs as IAssertionConformanceStatement).assertion.description;
        const noIf = desc && desc.startsWith('If');
        (this.cs as IAssertionConformanceStatement).assertion.description = !noIf ? 'If ' + (this.cs as IAssertionConformanceStatement).assertion.description : desc;
      }
    }
  }

  capitalize(value: string): string {
    if (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

  updatePattern(pattern: Pattern) {
    const payload = this.predicateMode ? this.csService.getAssertionPredicate(pattern.assertion) : this.csService.getAssertionConformanceStatement(pattern.assertion);
    this.cs = this.mergeAssertionIntoCs(this.cs, payload.cs, this.predicateMode, this.resourceType);
    this.pattern = pattern;
  }

  changeTab(item: CsTab) {
    this.statementsValidity = [];
    switch (item) {
      case CsTab.FREE:
        const payload = this.predicateMode ? this.csService.getFreePredicate() : this.csService.getFreeConformanceStatement();
        this.cs = this.mergeAssertionIntoCs(this.cs, payload, this.predicateMode, this.resourceType);
        (this.cs as any).assertion = undefined;
        break;
      case CsTab.SIMPLE:
      case CsTab.COMPLEX:
        const assertion = new Statement(this.predicateMode ? LeafStatementType.PROPOSITION : LeafStatementType.DECLARATION, 0, null, 0);
        this.updatePattern(new Pattern(assertion));
        break;
      case CsTab.CONDITIONAL:
        this.updatePattern(new Pattern(this.ifThenPattern.clone(undefined)));
        break;
    }
    this.activeTab = item;
    this.setActiveWithoutDependencies();
    this.change();
  }

  mergeAssertionIntoCs(cs: AssertionContainer, payload: AssertionContainer, predicateMode: boolean, resourceType: Type): AssertionContainer {
    const usages = {
      trueUsage: undefined,
      falseUsage: undefined,
    };

    if (predicateMode) {
      usages.trueUsage = cs && (cs as IPredicate).trueUsage ? (cs as IPredicate).trueUsage : (payload as IPredicate).trueUsage;
      usages.falseUsage = cs && (cs as IPredicate).falseUsage ? (cs as IPredicate).falseUsage : (payload as IPredicate).falseUsage;
    }

    return {
      ...cs,
      ...payload,
      level: cs && cs.level ? cs.level : resourceType,
      ...usages,
      identifier: cs ? cs.identifier : undefined,
      context: cs ? cs.context : undefined,
      freeText: undefined,
      assertionScript: undefined,
    };
  }

  openPatternDialog() {
    const dialogRef = this.dialog.open(PatternDialogComponent, {
      data: {
        condition: this.predicateMode,
        pattern: this.pattern ? this.pattern.clone() : undefined,
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.updatePattern(answer);
          this.setActiveWithoutDependencies();
          this.change();
        }
      },
    );
  }

  setActiveWithoutDependencies() {
    if (this.pattern) {
      this.activeStatement = this.pattern.tokens
        .find((t) => !t.dependency && t.type === TokenType.STATEMENT).value.data.id;
    }
  }

  done() {
    this.dialogRef.close(this.cs);
  }

  cancel() {
    this.dialogRef.close();
  }

  reset() {
    this.conformanceStatement = _.cloneDeep(this.backUp);
  }

  getTabForPattern(pattern: Pattern): CsTab {
    if (!pattern || !pattern.assertion) {
      return CsTab.FREE;
    } else if (pattern.assertion instanceof Statement) {
      return CsTab.SIMPLE;
    } else if (pattern.assertion instanceof BinaryOperator && pattern.assertion.data.type === 'IF-THEN' && pattern.assertion.getLeft() instanceof Statement && pattern.assertion.getRight() instanceof Statement) {
      return CsTab.CONDITIONAL;
    } else {
      return CsTab.COMPLEX;
    }
  }

  ngOnDestroy(): void {
    if (this.s_resource) {
      this.s_resource.unsubscribe();
    }
    this.alive = false;
  }

}
