import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {  filter, map, take, withLatestFrom } from 'rxjs/operators';
import * as config from '../../../../root-store/config/config.reducer';
import { CreateIg, LoadMessageEvents } from '../../../../root-store/create-ig/create-ig.actions';
import * as fromCreateIg from '../../../../root-store/create-ig/create-ig.reducer';
import { IDocumentCreationWrapper } from '../../../document/models/document/document-creation.interface';
import { MessageEventTreeNode } from '../../../document/models/message-event/message-event.class';
import { Scope } from '../../../shared/constants/scope.enum';
import { IAddingInfo } from '../../../shared/models/adding-info';
import { ClearResource } from './../../../../root-store/resource-loader/resource-loader.actions';
import { IMessagePickerContext, IMessagePickerData, MessagePickerComponent } from './../../../shared/components/message-picker/message-picker.component';

@Component({
  selector: 'app-create-ig',
  templateUrl: './create-ig.component.html',
  styleUrls: ['./create-ig.component.scss'],
})
export class CreateIGComponent implements OnInit {

  table$: Observable<MessageEventTreeNode[]>;
  hl7Version$: Observable<string[]>;
  metaDataForm: FormGroup;
  selectedEvents: IAddingInfo[] = [];
  step = 0;

  constructor(private store: Store<any>, private dialog: MatDialog) {
    this.table$ = this.store.select(fromCreateIg.getLoadedMessageEventsState);
    this.hl7Version$ = this.store.select(config.getHl7Versions);
    this.metaDataForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
  }

  getVersion({ version, scope }) {
    this.store.dispatch(new LoadMessageEvents({ version, scope }));
  }

  setSelected($event: IAddingInfo[]) {
    console.log($event);
    this.selectedEvents = $event;
  }
  next($event: IAddingInfo[]) {
   this.step = 1;
  }

  previous($event: IAddingInfo[]) {
    this.step = 0;
  }

  submit() {
    const model: IDocumentCreationWrapper = {
      metadata: this.metaDataForm.getRawValue(), scope: Scope.USER,
      selected: this.selectedEvents,
    };
    this.store.dispatch(new CreateIg(model));
  }

  pickMessages() {
    const subscription = this.hl7Version$.pipe(
      take(1),
      map((versions) => {
        const dialogData: IMessagePickerData = {
          hl7Versions: versions,
          scope: Scope.HL7STANDARD,
          context: IMessagePickerContext.CREATE,
        };
        const dialogRef = this.dialog.open(MessagePickerComponent, {
          data: dialogData,
        });
        dialogRef.afterClosed().pipe(
          filter((x) => x !== undefined),
          map((result) => {
            this.store.dispatch(new ClearResource());
            this.selectedEvents = this.selectedEvents.concat(result);

            return result;
          }),
        ).subscribe();
      }),
    ).subscribe();
    subscription.unsubscribe();
  }

}
