import { Hl7V2TreeService } from './../../services/hl7-v2-tree.service';
import { Component } from '@angular/core';
import { finalize, map, take, tap, flatMap, catchError } from 'rxjs/operators';
import { ISubContext, ISubject } from '../../models/cs.interface';
import { ElementNamingService } from '../../services/element-naming.service';
import { PathService } from '../../services/path.service';
import { StatementTarget } from '../../services/statement.service';
import { RestrictionCombinator, RestrictionType } from '../../services/tree-filter.service';
import { CsStatementComponent, IStatementTokenPayload } from '../cs-dialog/cs-statement.component';
import { IToken, Statement } from '../pattern-dialog/cs-pattern.domain';
import { IOption, NB_OCCURRENCES, TARGET_OCCURRENCES } from './../cs-dialog/cs-statement.constants';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-cs-subcontext',
  templateUrl: './cs-subcontext.component.html',
  styleUrls: ['./cs-subcontext.component.scss'],
})
export class CsSubcontextComponent extends CsStatementComponent<ISubContext> {

  subject: StatementTarget;

  occurences: IOption[] = [];

  constructor(
    elementNamingService: ElementNamingService,
    private pathService: PathService,
    treeService: Hl7V2TreeService,
  ) {
    super(
      treeService,
      {
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

    this.subject = new StatementTarget(elementNamingService, pathService, [...NB_OCCURRENCES, ...TARGET_OCCURRENCES]);
  }

  initializeStatement(token: IToken<Statement, IStatementTokenPayload>) {
    this.subject.setSubject(token.value.payload as ISubject, token.payload.getValue().effectiveContext, this.res, this.repository).pipe(
      flatMap(() => {
        this.updateTokenStatus();
        return this.findNode(this.subject.getValue().path, token.payload.getValue().effectiveTree).pipe(
          tap((node) => {
            if (node) {
              this.subject.setNode(node, token.payload.getValue().effectiveTree);
              this.occurences = this.getAllowedOccurrenceList(this.subject);
            }
          }),
        );
      }),
      catchError((e) => {
        return throwError(e);
      })
    ).subscribe();
  }

  targetElement(event) {
    this.subject.reset(this.token.payload.getValue().effectiveContext, this.pathService.trimPathRoot(event.path), this.res, this.repository, this.token.payload.getValue().effectiveTree, event.node, !!this.token.dependency).pipe(
      tap(() => {
        this.occurences = this.getAllowedOccurrenceList(this.subject);
        this.change();
      }),
    ).subscribe();
  }

  changeOccurrenceType() {
    this.subject.clearOccurrenceValue();
    this.change();
  }

  change() {
    this.subject.getDescription(this.res, this.repository, !!this.token.dependency).pipe(
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
    return this.subject.isComplete();
  }

}
