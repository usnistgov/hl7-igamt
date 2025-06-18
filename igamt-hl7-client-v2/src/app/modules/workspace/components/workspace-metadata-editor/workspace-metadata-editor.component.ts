import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { flatMap, take, tap } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave, EditorUpdate, LoadPayloadData } from 'src/app/modules/dam-framework/store';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { AbstractWorkspaceEditorComponent } from '../../services/abstract-workspace-editor';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-metadata-editor',
  templateUrl: './workspace-metadata-editor.component.html',
  styleUrls: ['./workspace-metadata-editor.component.scss'],
})
export class WorkspaceMetadataEditorComponent extends AbstractWorkspaceEditorComponent implements OnInit, OnDestroy {

  metaDataForm: FormGroup;
  wsSubscription: Subscription;
  changeSubscription: Subscription;

  constructor(
    actions$: Actions,
    store: Store<any>,
    private workspaceService: WorkspaceService,
    protected messageService: MessageService,
  ) {
    super({
      id: EditorID.WORKSPACE_METADTATA,
      title: 'Metadata',
    }, actions$, store);
    this.metaDataForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
    });
    this.wsSubscription = this.currentSynchronized$.pipe(
      tap((value) => {
        this.metaDataForm.patchValue(value, { emitEvent: false });
      }),
    ).subscribe();
    this.changeSubscription = this.metaDataForm.valueChanges.subscribe((changed) => {
      this.editorChange(changed, this.metaDataForm.valid);
    });
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(
      this.current$,
      this.elementId$,
    ).pipe(
      take(1),
      flatMap(([current, id]) => {
        return this.workspaceService.saveMetadata(id, current.data).pipe(
          flatMap((message) => {
            return this.workspaceService.getWorkspaceInfo(id).pipe(
              flatMap((ws) => {
                return [
                  this.messageService.messageToAction(message),
                  new EditorUpdate({ value: ws.metadata, updateDate: false }),
                  new LoadPayloadData(ws),
                ];
              }),
            );
          }),
        );
      }),
    );
  }

  editorDisplayNode(): Observable<any> {
    return of();
  }

  ngOnDestroy(): void {
    this.wsSubscription.unsubscribe();
    this.changeSubscription.unsubscribe();
  }

  ngOnInit() {
  }

  onDeactivate() {
    this.ngOnDestroy();
  }

}
