import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, NgbAlertType } from 'src/app/modules/core/services/message.service';
import { UserMessage } from '../../../core/models/message/message.class';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnInit {

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
