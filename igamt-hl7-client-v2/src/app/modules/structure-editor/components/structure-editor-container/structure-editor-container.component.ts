import { Component, forwardRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { Status } from 'src/app/modules/shared/models/abstract-domain.interface';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { DamWidgetComponent } from '../../../dam-framework/components/data-widget/dam-widget/dam-widget.component';
import { ConfirmDialogComponent } from '../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { IMessage } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { InsertResourcesInRepostory } from '../../../dam-framework/store/data/dam.actions';
import { Type } from '../../../shared/constants/type.enum';
import { IHL7WorkspaceActive } from '../../../shared/models/editor.class';
import { StructureEditorService } from '../../services/structure-editor.service';

export const STRUCT_EDIT_WIDGET_ID = 'STRUCT-EDIT-WIDGET-ID';

@Component({
  selector: 'app-structure-editor-container',
  templateUrl: './structure-editor-container.component.html',
  styleUrls: ['./structure-editor-container.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => StructureEditorContainerComponent) },
  ],
})
export class StructureEditorContainerComponent extends DamWidgetComponent implements OnInit {

  activeWorkspace: Observable<IHL7WorkspaceActive>;
  lockEnabled$: Observable<boolean>;

  constructor(
    store: Store<any>,
    dialog: MatDialog,
    private messageService: MessageService,
    private structureEditorService: StructureEditorService) {
    super(STRUCT_EDIT_WIDGET_ID, store, dialog);
    this.activeWorkspace = store.select(fromIgamtSelectors.selectWorkspaceActive);
    this.lockEnabled$ = combineLatest(this.activeWorkspace, this.containsUnsavedChanges$()).pipe(
      map(([workspace, changed]) => {
        return workspace && workspace.display.status !== Status.PUBLISHED && !changed;
      }),
    );
  }

  publish() {
    this.activeWorkspace.pipe(
      take(1),
      flatMap((workspace) => {
        return this.dialog.open(ConfirmDialogComponent, {
          data: {
            action: 'Lock structure ' + workspace.display.fixedName + (workspace.display.variableName ? ('_' + workspace.display.variableName) : ''),
            question: 'Locking this structure is irreversible, structure will be final and can be used in your implementation guides, do you want to continue ?',
          },
        }).afterClosed().pipe(
          flatMap((answer) => {
            if (answer) {
              const { id, type } = workspace.display;
              const { repository, publish } = type === Type.SEGMENT ?
                {
                  repository: 'segment-structures',
                  publish: this.structureEditorService.publishSegment(id) as Observable<IMessage<any>>,
                } :
                {
                  repository: 'message-structures',
                  publish: this.structureEditorService.publishMessageStructure(id) as Observable<IMessage<any>>,
                };
              return publish.pipe(
                map((response) => {
                  this.store.dispatch(this.messageService.messageToAction(response));
                  this.store.dispatch(new InsertResourcesInRepostory({
                    collections: [{
                      key: repository,
                      values: [response.data.displayElement],
                    }],
                  }));
                }),
              );
            }
            return EMPTY;
          }),
        );
      }),
    ).subscribe();
  }

  ngOnInit() {
  }

}
