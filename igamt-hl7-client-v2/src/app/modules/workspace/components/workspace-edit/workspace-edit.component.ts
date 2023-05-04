import { Component, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DamWidgetComponent } from 'src/app/modules/dam-framework';
import { selectWorkspaceInfo, selectWorkspaceMetadata } from '../../../../root-store/workspace/workspace-edit/workspace-edit.selectors';
import { IWorkspaceActive } from '../../../dam-framework/models/data/workspace';
import { selectPayloadData } from '../../../dam-framework/store/data/dam.selectors';
import { IWorkspaceMetadata } from '../../models/models';

export const WORKSPACE_EDIT_WIDGET_ID = 'WORKSPACE_EDIT_WIDGET_ID';

@Component({
  selector: 'app-workspace-edit',
  templateUrl: './workspace-edit.component.html',
  styleUrls: ['./workspace-edit.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => WorkspaceEditComponent) },
  ],
})
export class WorkspaceEditComponent extends DamWidgetComponent {

  metadata$: Observable<IWorkspaceMetadata>;
  workspaceInfo$: Observable<IWorkspaceMetadata>;
  dateCreated$: Observable<Date>;
  dateUpdated$: Observable<Date>;

  constructor(
    protected store: Store<any>,
    dialog: MatDialog) {
    super(WORKSPACE_EDIT_WIDGET_ID, store, dialog);

    this.metadata$ = this.store.select(selectWorkspaceMetadata);
    this.dateCreated$ = this.store.select(selectWorkspaceInfo).pipe(
      map((ws) => ws.created),
    );
    this.dateUpdated$ = this.store.select(selectWorkspaceInfo).pipe(
      map((ws) => ws.updated),
    );
  }

}
