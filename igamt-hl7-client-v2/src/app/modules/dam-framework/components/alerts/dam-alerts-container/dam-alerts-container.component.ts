import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserMessage } from '../../../models/messages/message.class';
import { IMessagesState } from '../../../models/messages/state';
import * as fromPageMessages from '../../../store/messages/index';
import { DeleteMessage } from '../../../store/messages/messages.actions';

@Component({
  selector: 'app-dam-alerts-container',
  templateUrl: './dam-alerts-container.component.html',
  styleUrls: ['./dam-alerts-container.component.scss'],
})
export class DamAlertsContainerComponent implements OnInit {

  messages: Observable<UserMessage[]>;

  constructor(private store: Store<IMessagesState>, private router: Router) {
    this.messages = store.select(fromPageMessages.selectMessages);
  }

  deleteMessage(messageId: string): void {
    this.store.dispatch(new DeleteMessage(messageId));
  }

  ngOnInit() {
  }

}
