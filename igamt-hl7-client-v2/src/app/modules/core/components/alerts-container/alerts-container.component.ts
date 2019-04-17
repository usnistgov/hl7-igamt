import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserMessage } from 'src/app/modules/core/models/message/message.class';
import * as fromPageMessages from '../../../../root-store/page-messages/page-messages.reducer';
import { DeleteMessage } from './../../../../root-store/page-messages/page-messages.actions';

@Component({
  selector: 'app-alerts-container',
  templateUrl: './alerts-container.component.html',
  styleUrls: ['./alerts-container.component.scss'],
})
export class AlertsContainerComponent implements OnInit {

  messages: Observable<UserMessage[]>;

  constructor(private store: Store<fromPageMessages.IState>, private router: Router) {
    this.messages = store.select(fromPageMessages.selectMessages);
  }

  deleteMessage(messageId: string): void {
    this.store.dispatch(new DeleteMessage(messageId));
  }

  ngOnInit() {
  }

}
