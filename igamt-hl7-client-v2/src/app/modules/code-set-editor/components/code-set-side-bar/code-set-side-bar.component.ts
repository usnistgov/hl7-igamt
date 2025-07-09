import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/modules/dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { selectAllCodeSetVersions, selectCodeSetId, selectCodeSetIsViewOnly } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.selectors';
import { ICodeSetInfo, ICodeSetVersionInfo } from '../../models/code-set.models';
import { CodeSetServiceService } from '../../services/CodeSetService.service';

export enum ListDisplay {
  SINGLE_COMMITTED = 'SINGLE_COMMITTED',
  TOP_COMMITTED = 'TOP_COMMITTED',
  MIDDLE_COMMITTED = 'MIDDLE_COMMITTED',
  BOTTOM_COMMITTED = 'BOTTOM_COMMITTED',
  INPROGRESS = 'INPROGRESS',
}

@Component({
  selector: 'app-code-set-side-bar',
  templateUrl: './code-set-side-bar.component.html',
  styleUrls: ['./code-set-side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSetSideBarComponent implements OnInit {

  isAdmin$: Observable<boolean>;
  codeSetId$: Observable<string>;
  children$: Observable<Array<ICodeSetVersionInfo & { listDisplay: ListDisplay }>>;
  viewOnly$: Observable<boolean>;
  ListDisplay = ListDisplay;

  constructor(
    private store: Store<any>,
    private codeSetService: CodeSetServiceService,
    protected messageService: MessageService,
    private dialog: MatDialog,
  ) {
    this.codeSetId$ = this.store.select(selectCodeSetId);
    this.children$ = this.store.select(selectAllCodeSetVersions).pipe(
      map((children) => {
        const list: Array<ICodeSetVersionInfo & { listDisplay: ListDisplay }> = [];
        const inprogress = children.find((child) => !child.dateCommitted);
        const hasInProgress = !!inprogress;
        if (hasInProgress) {
          list.push({
            ...inprogress,
            listDisplay: ListDisplay.INPROGRESS,
          });
        }
        const i = 0;
        const topIndex = hasInProgress ? 1 : 0;
        const bottomIndex = children.length - 1;
        children
          .forEach((child, i) => {
            if (child.dateCommitted) {
              if (i === topIndex && i === bottomIndex) {
                list.push({
                  ...child,
                  listDisplay: ListDisplay.SINGLE_COMMITTED,
                });
              } else if (i === topIndex && i < bottomIndex) {
                list.push({
                  ...child,
                  listDisplay: ListDisplay.TOP_COMMITTED,
                });
              } else if (i > topIndex && i < bottomIndex) {
                list.push({
                  ...child,
                  listDisplay: ListDisplay.MIDDLE_COMMITTED,
                });
              } else {
                list.push({
                  ...child,
                  listDisplay: ListDisplay.BOTTOM_COMMITTED,
                });
              }
            }
          });
        return list;
      }),
    );
    this.viewOnly$ = this.store.select(selectCodeSetIsViewOnly);
  }

  updateCodeSetState(id: string): Observable<ICodeSetInfo> {
    return this.codeSetService.getCodeSetInfo(id).pipe(
      tap((codeSet) => {
        this.codeSetService.getUpdateAction(codeSet).forEach((action) => {
          this.store.dispatch(action);
        });
      }),
    );
  }

  deleteCodeSetVersion(codeSetVersion: ICodeSetVersionInfo) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Delete Code Set Version',
        question: 'Are you sure you want to Delete this Code Set Version  ' + codeSetVersion.version + '?',
      },
    }).afterClosed().pipe(
      flatMap((answer) => {
        if (answer) {
          return this.codeSetService.deleteCodeSetVersion(codeSetVersion).pipe(
            flatMap((message) => {
              this.store.dispatch(this.messageService.messageToAction(message));
              return this.updateCodeSetState(codeSetVersion.parentId);
            }),
            catchError((error) => {
              this.store.dispatch(this.messageService.actionFromError(error));
              return throwError(error);
            }),
          );
        }
        return of();
      }),
    ).subscribe();
  }

  ngOnInit() {
  }

}
