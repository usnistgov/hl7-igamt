import { Component, forwardRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { DamWidgetComponent } from 'src/app/modules/dam-framework';
import { selectCodeSetInfo, selectCodeSetMetadata } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.selectors';
import { ICodeSetInfoMetadata } from '../../models/code-set.models';

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
  dateCreated$: Observable<Date>;
  dateUpdated$: Observable<Date>;
  codeSetURL: string;
  urlSize: number;

  constructor(
    protected store: Store<any>,
    dialog: MatDialog) {
    super(CODE_SET_EDIT_WIDGET_ID, store, dialog);
    this.metadata$ = this.store.select(selectCodeSetMetadata);
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
