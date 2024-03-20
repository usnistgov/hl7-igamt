import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'jquery';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { selectAllCodeSetVersions, selectCodeSetId } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.selectors';
import { ICodeSetInfo, ICodeSetVersionInfo } from '../../models/code-set.models';
import { CodeSetServiceService } from '../../services/CodeSetService.service';

@Component({
  selector: 'app-code-set-side-bar',
  templateUrl: './code-set-side-bar.component.html',
  styleUrls: ['./code-set-side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSetSideBarComponent implements OnInit {

  isAdmin$: Observable<boolean>;
  codeSetId$: Observable<string>;
  children$: Observable<ICodeSetVersionInfo[]>;

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private codeSetService: CodeSetServiceService,
    protected messageService: MessageService,
    private dialog: MatDialog,
  ) {
    this.codeSetId$ = this.store.select(selectCodeSetId);
    this.children$ = this.store.select(selectAllCodeSetVersions);

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

  ngOnInit() {
  }

}
