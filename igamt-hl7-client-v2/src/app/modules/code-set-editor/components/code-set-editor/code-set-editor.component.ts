import { Component, OnInit, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DamWidgetComponent } from 'src/app/modules/dam-framework';

export const CODE_SET_EDIT_WIDGET_ID = 'CODE_SET_EDIT_WIDGET_ID';

@Component({
  selector: 'app-code-set-editor',
  templateUrl: './code-set-editor.component.html',
  styleUrls: ['./code-set-editor.component.css'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => CodeSetEditorComponent) },
  ],
})

export class CodeSetEditorComponent extends DamWidgetComponent {

  // metadata$: Observable<IWorkspaceMetadata>;
  // workspaceInfo$: Observable<IWorkspaceMetadata>;
  dateCreated$: Observable<Date>;
  dateUpdated$: Observable<Date>;

  constructor(
    protected store: Store<any>,
    dialog: MatDialog) {
    super(CODE_SET_EDIT_WIDGET_ID, store, dialog);

    // this.metadata$ = this.store.select(selectWorkspaceMetadata);
    // this.dateCreated$ = this.store.select(selectWorkspaceInfo).pipe(
    //   map((ws) => ws.created),
    // );
    // this.dateUpdated$ = this.store.select(selectWorkspaceInfo).pipe(
    //   map((ws) => ws.updated),
    // );
  }

}
