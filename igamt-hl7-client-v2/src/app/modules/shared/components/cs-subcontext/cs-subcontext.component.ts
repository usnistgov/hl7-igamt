import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize, map, take, tap } from 'rxjs/operators';
import { OccurrenceType } from '../../models/conformance-statements.domain';
import { ISubContext, ISubject } from '../../models/cs.interface';
import { ElementNamingService } from '../../services/element-naming.service';
import { PathService } from '../../services/path.service';
import { StatementTarget } from '../../services/statement.service';
import { RestrictionCombinator, RestrictionType } from '../../services/tree-filter.service';
import { CsStatementComponent, IStatementTokenPayload } from '../cs-dialog/cs-statement.component';
import { Statement, Token } from '../pattern-dialog/cs-pattern.domain';
import { StructureTreeComponent } from '../structure-tree/structure-tree.component';

@Component({
  selector: 'app-cs-subcontext',
  templateUrl: './cs-subcontext.component.html',
  styleUrls: ['./cs-subcontext.component.scss'],
})
export class CsSubcontextComponent extends CsStatementComponent<ISubContext> {

  subject: StatementTarget;

  occurences = [
    { label: 'At least one occurrence of', value: OccurrenceType.AT_LEAST_ONE },
    { label: 'The \'INSTANCE\' occurrence of', value: OccurrenceType.INSTANCE },
    { label: 'No occurrence of', value: OccurrenceType.NONE },
    { label: 'Exactly one occurrence of', value: OccurrenceType.ONE },
    { label: '\'COUNT\' occurrences of', value: OccurrenceType.COUNT },
    { label: 'All occurrences of', value: OccurrenceType.ALL },
  ];

  @ViewChild('targetOccurenceValues', { read: NgForm }) targetOccurenceValues: NgForm;
  @ViewChild('structureTree', { read: StructureTreeComponent }) structureTree: StructureTreeComponent;

  constructor(
    elementNamingService: ElementNamingService,
    private pathService: PathService,
  ) {
    super({
      hide: false,
      restrictions: [
        {
          criterion: RestrictionType.PRIMITIVE,
          combine: RestrictionCombinator.ENFORCE,
          allow: false,
          value: true,
        },
        {
          criterion: RestrictionType.MULTI,
          combine: RestrictionCombinator.ENFORCE,
          allow: false,
          value: false,
        },
      ],
    },
      {
        path: undefined,
        occurenceIdPath: undefined,
        occurenceLocationStr: undefined,
        occurenceValue: undefined,
        occurenceType: undefined,
        description: '',
      });

    this.subject = new StatementTarget(elementNamingService, pathService, this.occurences);
  }

  initializeStatement(token: Token<Statement, IStatementTokenPayload>) {
    this.subject.setSubject(token.value.payload as ISubject, token.payload.getValue().effectiveContext, this.res, this.repository).pipe(
      finalize(() => {
        this.updateTokenStatus();
      }),
    ).subscribe();
  }

  targetElement(event) {
    this.subject.reset(this.token.payload.getValue().effectiveContext, this.pathService.trimPathRoot(event.path), this.res, this.repository, this.token.payload.getValue().effectiveTree, event.node).pipe(
      tap((s) => {
        this.change();
      }),
    ).subscribe();
  }

  change() {
    this.subject.getDescription(this.res, this.repository).pipe(
      take(1),
      map((desc) => {
        Object.assign(this.value, {
          ...this.subject.value,
          description: desc,
        });
        this.updateTokenStatus();
        this.valueChange.emit(this.value);
      }),
    ).subscribe();
  }

  clearStatementTargetElements() {
    this.subject.clear();
  }

  updateTokenStatus() {
    if (this.token) {
      this.token.valid = this.complete();
      if (this.subject.node) {
        this.token.payload.next({
          ...this.token.payload.getValue(),
          active: this.subject.node,
          activeNodeRootPath: this.pathService.straightConcatPath(
            this.token.payload.getValue().effectiveContext,
            this.pathService.trimPathRoot(this.pathService.getPathFromNode(this.subject.node)),
          ),
        });
      }
    }
  }

  complete() {
    return this.subject.isComplete(this.targetOccurenceValues);
  }

}
