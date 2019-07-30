import { Component, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Type } from '../../constants/type.enum';
import { AssertionMode, ConstraintType, IAssertionConformanceStatement, IFreeTextConformanceStatement, INotAssertion, IOperatorAssertion } from '../../models/cs.interface';
import { IResource } from '../../models/resource.interface';
import { ConformanceStatementService } from '../../services/conformance-statement.service';
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
export class CsDialogComponent implements OnInit {

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
  @ViewChildren(CsPropositionComponent) propositions: QueryList<CsPropositionComponent>;
  @ViewChild('csForm', { read: NgForm }) form;

  constructor(
    private csService: ConformanceStatementService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<CsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public repository: StoreResourceRepositoryService) {
    this.ifThenPattern = new BinaryOperator('D', 'IF-THEN', null, 0);
    this.ifThenPattern.putOne(new Statement('D', 0, null, 0), 0);
    this.ifThenPattern.putOne(new Statement('D', 0, null, 0), 1);
    data.resource.subscribe(
      (resource: IResource) => {
        this.resource = resource;
      },
    );
    this.title = data.title;
    this.conformanceStatement = data.cs;
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

  @Input()
  set conformanceStatement(cs: IAssertionConformanceStatement | IFreeTextConformanceStatement) {
    if (cs.type === ConstraintType.ASSERTION) {
      this.pattern = this.csService.getCsPattern((cs as IAssertionConformanceStatement).assertion);
      this.activeTab = this.getTabForPattern(this.pattern);
    } else {
      this.activeTab = CsTab.FREE;
    }
    console.log(this.pattern);
    this.cs = cs;
    this.backUp = _.cloneDeep(cs);
  }

  @Input()
  set structure(r: IResource) {
    this.resource = r;
    this.resourceType = this.resource.type;
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

  statementValid() {
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

  ngOnInit() {

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

}
