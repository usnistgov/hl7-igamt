import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserMessage } from '../../models/messages/message.class';
import { MessageService, NgbAlertType } from '../../services/message.service';

@Component({
  selector: 'app-dam-alerts',
  templateUrl: './dam-alerts.component.html',
  styleUrls: ['./dam-alerts.component.scss'],
})
export class DamAlertsComponent implements OnInit {

  @Input() messages: UserMessage[];
  @Output() close: EventEmitter<number>;

  constructor(private messageService: MessageService) {
    this.close = new EventEmitter<number>();
  }

  alertType(message: UserMessage): NgbAlertType {
    return this.messageService.messageTypeToAlert(message.status);
  }

  closeEmitter(index: number) {
    this.close.emit(index);
  }

  ngOnInit() {
  }

}
