import { Component, Inject, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { TreeNode } from 'primeng/primeng';
import { Observable, of, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Type } from '../../constants/type.enum';
import { AssertionMode, ConstraintType, IAssertionConformanceStatement, IFreeTextConformanceStatement, INotAssertion, IOperatorAssertion, IPath } from '../../models/cs.interface';
import { IResource } from '../../models/resource.interface';
import { ConformanceStatementService } from '../../services/conformance-statement.service';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { StoreResourceRepositoryService } from '../../services/resource-repository.service';
import { CsPropositionComponent } from '../cs-proposition/cs-proposition.component';
import { BinaryOperator, Pattern, Statement } from '../pattern-dialog/cs-pattern.domain';
import { PatternDialogComponent } from '../pattern-dialog/pattern-dialog.component';
import { IAssertion, IIfThenAssertion } from './../../models/cs.interface';

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

  pattern: Pattern;
  activeTab: CsTab;
  csType = ConstraintType;
  tabType = CsTab;
  cs: IAssertionConformanceStatement | IFreeTextConformanceStatement;
  resource: IResource;
  statementsValidity: boolean[];
  backUp: IAssertionConformanceStatement | IFreeTextConformanceStatement;
  resourceType: Type;
  title: string;
  hideAdvanced: boolean;
  ifThenPattern: BinaryOperator;
  structure: TreeNode[];
  context: TreeNode[];
  s_resource: Subscription;
  showContext: boolean;
  contextName: string;

  @ViewChildren(CsPropositionComponent) propositions: QueryList<CsPropositionComponent>;
  @ViewChild('csForm', { read: NgForm }) form;

  constructor(
    private csService: ConformanceStatementService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private treeService: Hl7V2TreeService,
    public dialogRef: MatDialogRef<CsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public repository: StoreResourceRepositoryService) {
    this.ifThenPattern = new BinaryOperator('D', 'IF-THEN', null, 0);
    this.ifThenPattern.putOne(new Statement('D', 0, null, 0), 0);
    this.ifThenPattern.putOne(new Statement('D', 0, null, 0), 1);
    this.s_resource = data.resource.subscribe(
      (resource: IResource) => {
        this.resourceType = resource.type;
        this.resource = resource;
        this.treeService.getTree(resource, this.repository, true, true, (value) => {
          this.structure = [
            {
              data: {
                id: resource.id,
                pathId: resource.id,
                name: resource.name,
                type: resource.type,
              },
              children: [...value],
              parent: undefined,
            },
          ];
          this.context = this.structure;
        });
      },
    );
    this.title = data.title;
    this.conformanceStatement = data.cs;
  }

  getName(path: IPath): Observable<string> {
    if (!path) {
      return of('');
    }

    return this.treeService.getPathName(this.resource, this.repository, path.child).pipe(
      take(1),
      map((pathInfo) => {
        return this.treeService.getNameFromPath(pathInfo);
      }),
    );
  }

  selectContext(node) {
    if (node.node.data.type !== Type.CONFORMANCEPROFILE) {
      this.cs.context = node.path;
      this.structure = [
        node.node,
      ];
      this.getName(node.path).pipe(
        take(1),
        map((value) => {
          this.contextName = value;
        }),
      ).subscribe();
    }
    this.showContext = false;
  }

  valid() {
    if (!this.form) {
      return false;
    } else if (this.activeTab === CsTab.FREE && this.form) {
      return this.form.valid;
    } else if (this.activeTab !== CsTab.FREE && this.form && this.propositions && this.propositions.length > 0) {
      let statementsValidity = true;
      this.propositions.forEach((p) => {
        statementsValidity = statementsValidity && p.complete();
      });

      return statementsValidity && this.form.valid;
    } else {
      return false;
    }
  }

  set conformanceStatement(cs: IAssertionConformanceStatement | IFreeTextConformanceStatement) {
    if (cs.type === ConstraintType.ASSERTION) {
      this.pattern = this.csService.getCsPattern((cs as IAssertionConformanceStatement).assertion);
      this.activeTab = this.getTabForPattern(this.pattern);
    } else {
      this.activeTab = CsTab.FREE;
    }
    this.cs = cs;
    this.backUp = _.cloneDeep(cs);
  }

  updateAssertionDescription(assertion: IAssertion) {
    switch (assertion.mode) {
      case AssertionMode.ANDOR:
        this.updateOperatorDescription(assertion as IOperatorAssertion);
        break;
      case AssertionMode.IFTHEN:
        this.updateIfThenDescription(assertion as IIfThenAssertion);
        break;
      case AssertionMode.NOT:
        this.updateNotDescription(assertion as INotAssertion);
        break;
      case AssertionMode.SIMPLE:
        assertion.description = assertion.description ? assertion.description : '_';
        break;
    }
  }

  updateOperatorDescription(assertion: IOperatorAssertion) {
    const descriptions = assertion.assertions.map((a) => {
      this.updateAssertionDescription(a);
      return a.description;
    });
    assertion.description = '( ' + descriptions.join(' ' + assertion.operator + ' ') + ' )';
  }

  updateIfThenDescription(assertion: IIfThenAssertion) {
    this.updateAssertionDescription(assertion.ifAssertion);
    this.updateAssertionDescription(assertion.thenAssertion);
    assertion.description = `If ${assertion.ifAssertion.description ? assertion.ifAssertion.description : '_'} then ${assertion.thenAssertion.description ? assertion.thenAssertion.description : '_'}`;
  }

  updateNotDescription(assertion: INotAssertion) {
    this.updateAssertionDescription(assertion.child);
    assertion.description = `NOT ${assertion.child.description}`;
  }

  change() {
    if (this.cs.type === ConstraintType.ASSERTION) {
      this.updateAssertionDescription((this.cs as IAssertionConformanceStatement).assertion);
    }
  }

  changeTab(item: CsTab) {
    this.statementsValidity = [];
    switch (item) {
      case CsTab.FREE:
        this.cs = this.csService.getFreeConformanceStatement();
        break;
      case CsTab.SIMPLE:
        this.cs = this.csService.getAssertionConformanceStatement(new Statement('D', 0, null, 0)).cs;
        break;
      case CsTab.CONDITIONAL:
        this.cs = this.csService.getAssertionConformanceStatement(this.ifThenPattern).cs;
        break;
      case CsTab.COMPLEX:
        if (this.cs.type === ConstraintType.ASSERTION) {
          (this.cs as IAssertionConformanceStatement).assertion.description = '';
        }

        if (this.pattern && this.pattern.assertion) {
          this.cs = this.csService.getAssertionConformanceStatement(this.pattern.assertion).cs;
        }
        break;
    }
    this.activeTab = item;
  }

  openPatternDialog() {
    const dialogRef = this.dialog.open(PatternDialogComponent, {});
    dialogRef.afterClosed().subscribe(
      (answer) => {
        this.pattern = answer;
        if (this.pattern) {
          this.changeTab(this.activeTab);
        }
      },
    );
  }

  public html(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }

  done() {
    this.dialogRef.close(this.cs);
  }

  cancel() {
    this.dialogRef.close();
  }

  reset() {
    this.conformanceStatement = this.backUp;
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
  }

}
