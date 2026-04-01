import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, flatMap, map, switchMap, take } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { IgEditResolverLoad } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { EditorID } from '../../../shared/models/editor.enum';
import { IgService } from '../../services/ig.service';
import { ExampleMessagesService } from '../../../example-messages/services/example-messages.service';
import { IExampleMessageDTO } from '../../../example-messages/domain/example-messages.model';

export interface IAvailableMessage {
  id: string;
  name: string;
  profileName: string;
}

@Component({
  selector: 'app-ig-message-section-editor',
  templateUrl: './ig-message-section-editor.component.html',
  styleUrls: ['./ig-message-section-editor.component.scss'],
})
export class IgMessageSectionEditorComponent extends AbstractEditorComponent implements OnInit {

  current: Observable<any>;
  exampleMessage$: Observable<IExampleMessageDTO>;
  exampleMessagesUrl: string;
  loading = false;
  loadingMessages = false;
  availableMessages: IAvailableMessage[] = [];
  selectedMessageId: string = null;

  constructor(
    store: Store<any>,
    actions$: Actions,
    private igService: IgService,
    private messageService: MessageService,
    private exampleMessagesService: ExampleMessagesService,
  ) {
    super({
      id: EditorID.MESSAGE_SECTION,
      title: 'Message Example',
      resourceType: Type.MESSAGESECTION,
    },
      actions$,
      store,
    );
  }

  ngOnInit() {
    this.currentSynchronized$.pipe(
      map((data) => {
        if (data && data.igId) {
          this.exampleMessagesUrl = `/example-messages/${data.igId}`;
          this.loadAvailableMessages(data.igId);

          if (data.messageId) {
            this.selectedMessageId = data.messageId;
            this.loading = true;
            this.exampleMessage$ = this.exampleMessagesService.getExampleMessage(data.igId, data.messageId).pipe(
              map((msg) => {
                this.loading = false;
                return msg;
              }),
              catchError(() => {
                this.loading = false;
                return of(null);
              }),
            );
          } else {
            this.selectedMessageId = null;
            this.exampleMessage$ = of(null);
          }
        } else {
          this.exampleMessagesUrl = null;
          this.exampleMessage$ = of(null);
        }
      }),
    ).subscribe();
  }

  loadAvailableMessages(igId: string) {
    this.loadingMessages = true;
    this.exampleMessagesService.getIgExampleMessages(igId).pipe(
      map((igExampleMessages) => {
        this.availableMessages = [];
        if (igExampleMessages && igExampleMessages.profileExampleMessages) {
          for (const profileMessages of igExampleMessages.profileExampleMessages) {
            const profileLabel = profileMessages.profile
              ? (profileMessages.profile.fixedName || '') +
                (profileMessages.profile.variableName ? '#' + profileMessages.profile.variableName : '')
              : 'Unknown Profile';
            for (const msg of profileMessages.exampleMessages) {
              this.availableMessages.push({
                id: msg.id,
                name: msg.name,
                profileName: profileLabel,
              });
            }
          }
        }
        this.loadingMessages = false;
      }),
      catchError(() => {
        this.loadingMessages = false;
        return of(null);
      }),
    ).subscribe();
  }

  dataChange(form: FormGroup) {
    // Merge narrative form values with existing messageId/snippetId
    this.current$.pipe(
      take(1),
      map((current) => {
        const formValue = form.getRawValue();
        this.editorChange({
          ...current.data,
          ...formValue,
        }, form.valid);
      }),
    ).subscribe();
  }

  onMessageSelected(messageId: string, snippetId: string) {
    this.selectedMessageId = messageId;
    this.current$.pipe(
      take(1),
      map((current) => {
        this.editorChange(
          {
            ...current.data,
            messageId,
            snippetId,
          },
          true,
        );
      }),
    ).subscribe();

    // Load the selected message preview
    if (messageId) {
      this.currentSynchronized$.pipe(
        take(1),
        map((data) => {
          if (data && data.igId) {
            this.loading = true;
            this.exampleMessage$ = this.exampleMessagesService.getExampleMessage(data.igId, messageId).pipe(
              map((msg) => {
                this.loading = false;
                return msg;
              }),
              catchError(() => {
                this.loading = false;
                return of(null);
              }),
            );
          }
        }),
      ).subscribe();
    } else {
      this.exampleMessage$ = of(null);
    }
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgamtDisplaySelectors.selectSectionDisplayById, { id: elementId });
      }),
    );
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.store.select(fromIgEdit.selectIgDocument), this.current$)
      .pipe(
        take(1),
        flatMap(([_id, ig, current]) => {
          return this.igService.saveTextSection(ig.id, {
            ...current.data,
          }).pipe(
            flatMap((response) => {
              return [
                this.messageService.messageToAction(response),
                new fromDam.EditorUpdate({ value: current.data, updateDate: false }),
                new fromDam.SetValue({ selected: current.data }),
                new IgEditResolverLoad(ig.id),
              ];
            }),
            catchError((error) => {
              return of(this.messageService.actionFromError(error));
            }),
          );
        }),
      );
  }

  onDeactivate(): void {
  }
}

