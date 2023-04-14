import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Role } from '../../models/conformance-profile.interface';
import { IAddingInfo } from './../../models/adding-info';
import { ProfileType } from './../../models/conformance-profile.interface';

@Component({
  selector: 'app-selected-messages',
  templateUrl: './selected-messages.component.html',
  styleUrls: ['./selected-messages.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedMessagesComponent implements OnInit {

  @Output()
  messages = new EventEmitter<IAddingInfo[]>();
  @ViewChild(NgForm) form;

  roles =  [{label: 'RECEIVER', value: Role.Receiver}, {label: 'SENDER', value: Role.Sender}, {label: 'SENDER And Receiver', value: Role.SenderAndReceiver}];
  profileTypes = [{label: 'Constrainable', value: ProfileType.Constrainable}, {label: 'Implementation', value: ProfileType.Implementation}];

  constructor() { }
  @Input()
  selectedData: IAddingInfo[] = [];
  ngOnInit() {
  }

  unselect(selected: any) {
    const index = this.selectedData.indexOf(selected);
    if (index > -1) {
      this.selectedData.splice(index, 1);
    }
    this.emitData();
  }
  emitData() {
    this.messages.emit(this.selectedData);
  }

  isValid() {
    if (this.form) {
      return this.form.valid && this.selectedData.length > 0;
    } else {
      return this.selectedData.length > 0;
    }
  }

}
