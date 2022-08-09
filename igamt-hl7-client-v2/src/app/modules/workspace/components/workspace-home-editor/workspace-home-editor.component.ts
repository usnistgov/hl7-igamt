import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { flatMap, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave, EditorUpdate } from 'src/app/modules/dam-framework/store';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { FroalaService } from 'src/app/modules/shared/services/froala.service';
import { LoadPayloadData } from '../../../dam-framework/store/data/dam.actions';
import { AbstractWorkspaceEditorComponent } from '../../services/abstract-workspace-editor';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-home-editor',
  templateUrl: './workspace-home-editor.component.html',
  styleUrls: ['./workspace-home-editor.component.scss'],
})
export class WorkspaceHomeEditorComponent extends AbstractWorkspaceEditorComponent implements OnInit, OnDestroy {

  text: FormGroup;
  changeSubscription: Subscription;
  syncSubscription: Subscription;
  viewMode = true;
  protected froalaConfig$: Observable<any>;

  constructor(
    actions$: Actions,
    store: Store<any>,
    private workspaceService: WorkspaceService,
    protected messageService: MessageService,
    protected froalaService: FroalaService,
  ) {
    super({
      id: EditorID.WORKSPACE_HOME,
      title: 'Home',
    }, actions$, store);
    this.froalaConfig$ = this.froalaService.getConfig();

    this.text = new FormGroup({
      value: new FormControl(''),
    });

    this.changeSubscription = this.text.valueChanges.subscribe((changes) => {
      this.dataChange(this.text);
    });

    this.syncSubscription = this.currentSynchronized$.subscribe((current) => {
      this.text.patchValue(current, { emitEvent: false });
    });
  }

  toggleEdit() {
    this.viewMode = false;
  }

  dataChange(formGroup: FormGroup) {
    this.editorChange(formGroup.getRawValue(), formGroup.valid);
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(
      this.current$,
      this.elementId$,
    ).pipe(
      take(1),
      flatMap(([current, id]) => {
        return this.workspaceService.saveHomePageContent(id, current.data).pipe(
          flatMap((message) => {
            return this.workspaceService.getWorkspaceInfo(id).pipe(
              flatMap((ws) => {
                this.viewMode = true;
                return [
                  this.messageService.messageToAction(message),
                  new EditorUpdate({ value: { value: ws.homePageContent }, updateDate: false }),
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
    if (this.syncSubscription) {
      this.syncSubscription.unsubscribe();
    }
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  ngOnInit() {
  }

  onDeactivate() {
    this.ngOnDestroy();
  }

}
