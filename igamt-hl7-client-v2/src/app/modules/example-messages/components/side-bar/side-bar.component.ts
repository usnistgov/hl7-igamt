import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, take, mergeMap, catchError, finalize, filter } from 'rxjs/operators';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { TableOfContentComponent } from '../table-of-content/table-of-content.component';
import { selectIgExampleMessages } from 'src/app/root-store/example-messages/example-messages.reducer';
import { ExampleMessagesService } from '../../services/example-messages.service';
import { LoadPayloadData } from 'src/app/modules/dam-framework/store';
import { MessageType } from 'src/app/modules/dam-framework/models/messages/message.class';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {

  nodes: Observable<any[]>;
  id$: Observable<string>;
  activeMessageId$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  @ViewChild(TableOfContentComponent) toc: TableOfContentComponent;
  readonly SEGMENTS_REPO = 'segment-structures';
  readonly MESSAGES_REPO = 'message-structures';
  readonly STRUCTURE_EDITOR_URL = 'structure-editor';
  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private messageService: MessageService,
    private exampleMessageService: ExampleMessagesService,
  ) {
    // Extract messageId from child route on every navigation
    this.updateActiveMessageId();
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
    ).subscribe(() => {
      this.updateActiveMessageId();
    });
    this.id$ = this.store.select(selectIgExampleMessages).pipe(
      take(1),
      map((igExampleMessages) => igExampleMessages.id)
    );
    this.nodes = this.store.select(selectIgExampleMessages).pipe(
      map((igExampleMessages) => {
        const nodes: any[] = [];
        for (const profileExamples of igExampleMessages.profileExampleMessages) {
          nodes.push({
            ...profileExamples.profile,
            id: profileExamples.profile.id,
            label: this.getLabel(profileExamples.profile),
            children: [
              ...profileExamples.exampleMessages.map((message) => ({
                ...message,
                type: Type.EXAMPLEMESSAGE,
                label: message.name,
                children: [
                  ...message.snippets.map((snippet) => ({
                    ...snippet,
                    messageId: message.id,
                    type: Type.EXAMPLEMESSAGESNIPPET,
                    label: snippet.name,
                  }))
                ]
              }))
            ]
          })
        }
        return nodes;
      })
    );
  }

  getLabel(display: IDisplayElement) {
    if (display.fixedName && display.fixedName.length > 0) {
      if (display.variableName && display.variableName.length > 0) {
        return display.fixedName + '#' + display.variableName;
      } else {
        return display.fixedName;
      }
    } else {
      if (display.variableName) {
        return display.variableName;
      }
    }
  }

  filterFn(value: any) {
    this.toc.filter(value);
  }

  collapseAll() {
    this.toc.collapseAll();
  }

  expandAll() {
    this.toc.expandAll();
  }

  createExampleMessage(data: { name: string, profileId: string }) {
    this.store.dispatch(new fromDAM.TurnOnLoader({
      blockUI: true,
    }));
    this.id$.pipe(
      take(1),
      mergeMap((id) => {
        return this.exampleMessageService.createExampleMessage(id, data).pipe(
          map((message) => {
            const actions = [];
            actions.push(this.messageService.messageToAction(message));
            if (message.status === MessageType.SUCCESS && message.data) {
              actions.push(new LoadPayloadData(message.data));
            }
            actions.forEach((action) => {
              this.store.dispatch(action);
            })
          }),
          catchError((err) => {
            this.store.dispatch(this.messageService.actionFromError(err));
            return EMPTY;
          }),
        )
      }),
      finalize(() => {
        this.store.dispatch(new fromDAM.TurnOffLoader());
      })
    ).subscribe();
  }

  private updateActiveMessageId() {
    if (this.route.firstChild) {
      const messageId = this.route.firstChild.snapshot.paramMap.get('messageId');
      this.activeMessageId$.next(messageId);
    } else {
      this.activeMessageId$.next(null);
    }
  }

}
