import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as config from '../../../../root-store/config/config.reducer';
import { MessageEventTreeData, MessageEventTreeNode } from '../../../document/models/message-event/message-event.class';
import { IgService } from '../../../ig/services/ig.service';
import { Scope } from '../../../shared/constants/scope.enum';
import { Type } from '../../../shared/constants/type.enum';
import { IEvent } from '../../../shared/models/conformance-profile.interface';
import { ICreateMessageStructure } from '../../domain/structure-editor.model';

@Component({
  selector: 'app-create-message-dialog',
  templateUrl: './create-message-dialog.component.html',
  styleUrls: ['./create-message-dialog.component.scss'],
})
export class CreateMessageDialogComponent implements OnInit {

  messages$: Observable<MessageEventTreeNode[]>;
  hl7Version$: Observable<string[]>;
  selectedVersion: string;
  messageStructure: MessageEventTreeData;
  messageEvents: IEvent[] = [];
  eventStub: IEvent = {
    id: undefined,
    name: '',
    parentStructId: undefined,
    description: '',
    type: Type.EVENT,
    hl7Version: undefined,
  };
  selectedScope = Scope.HL7STANDARD;

  constructor(
    private igService: IgService,
    private store: Store<any>,
    private dialogRef: MatDialogRef<CreateMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.hl7Version$ = this.store.select(config.getHl7Versions);
  }

  startFrom(metn: MessageEventTreeNode) {
    this.messageStructure = {
      ...metn.data,
    };

    this.eventStub.parentStructId = metn.data.name;
    this.eventStub.hl7Version = metn.data.hl7Version;

    this.messageEvents = metn.children.map((value) => {
      return {
        id: value.data.id,
        name: value.data.name,
        parentStructId: value.data.parentStructId,
        description: value.data.description,
        type: Type.EVENT,
        hl7Version: value.data.hl7Version,
      };
    });
  }

  deleteEvent(i: number) {
    this.messageEvents.splice(i, 1);
  }

  addEvent(event: IEvent) {
    this.messageEvents.push({ ...event });
    this.eventStub.name = '';
    this.eventStub.description = '';
  }

  clearSelection() {
    this.messageStructure = undefined;
    this.messageEvents = [];
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    const query: ICreateMessageStructure = {
      name: this.messageStructure.name,
      description: this.messageStructure.description,
      from: this.messageStructure.id,
      events: this.messageEvents,
      version: this.messageStructure.hl7Version,
    };

    this.dialogRef.close(query);
  }

  getMessages($event) {
    this.messages$ = this.igService.getMessagesByVersionAndScope($event.version, $event.scope).pipe(
      map((messages) => {
        return messages.data;
      }),
    );
  }

  ngOnInit() {
  }

}
