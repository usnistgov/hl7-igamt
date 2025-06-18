import { Component, forwardRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { DamWidgetComponent } from 'src/app/modules/dam-framework';
import { selectCodeSetInfo, selectCodeSetIsViewOnly, selectCodeSetMetadata } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.selectors';
import { ICodeSetInfo, ICodeSetInfoMetadata } from '../../models/code-set.models';

export const CODE_SET_EDIT_WIDGET_ID = 'CODE_SET_EDIT_WIDGET_ID';

@Component({
  selector: 'app-code-set-editor',
  templateUrl: './code-set-editor.component.html',
  styleUrls: ['./code-set-editor.component.css'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => CodeSetEditorComponent) },
  ],
})

export class CodeSetEditorComponent extends DamWidgetComponent implements OnInit {

  metadata$: Observable<ICodeSetInfoMetadata>;
  codeSetInfo$: Observable<ICodeSetInfo>;
  dateCreated$: Observable<Date>;
  dateUpdated$: Observable<Date>;
  codeSetURL: string;
  viewOnly$: Observable<boolean>;
  urlSize: number;

  constructor(
    protected store: Store<any>,
    dialog: MatDialog,
  ) {
    super(CODE_SET_EDIT_WIDGET_ID, store, dialog);
    this.codeSetInfo$ = this.store.select(selectCodeSetInfo);
    this.viewOnly$ = this.store.select(selectCodeSetIsViewOnly);
  }

  ngOnInit(): void {
    this.store.select(selectCodeSetInfo).pipe(
      take(1),
      tap((info) => {
        const host = window.location.protocol + '//' + window.location.host;
        this.codeSetURL = host + '/codesets/' + info.id;
        this.urlSize = (this.codeSetURL.length * 18) + 100;
      }),
    ).subscribe();
  }

}
