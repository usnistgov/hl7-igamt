import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {LoadConfig} from '../../../../root-store/config/config.actions';
import * as config from '../../../../root-store/config/config.reducer';
import {CreateIg, LoadMessageEvents} from '../../../../root-store/create-ig/create-ig.actions';
import * as fromCreateIg from '../../../../root-store/create-ig/create-ig.reducer';
import {Scope} from '../../../shared/constants/scope.enum';
import {IDocumentCreationWrapper} from '../../models/ig/document-creation.interface';
import {EventTreeData, MessageEventTreeNode} from '../../models/message-event/message-event.class';

@Component({
  selector: 'app-create-ig',
  templateUrl: './create-ig.component.html',
  styleUrls: ['./create-ig.component.scss'],
})
export class CreateIGComponent implements OnInit {

  table$: Observable<MessageEventTreeNode[]>;
  hl7Version$: Observable<string[]>;
  metaDataForm: FormGroup;
  selectedEvents: EventTreeData[] = [];

  constructor(private store: Store<any>) {
    this.store.dispatch(new LoadConfig());
    this.table$ = this.store.select(fromCreateIg.getLoadedMessageEventsState);
    this.hl7Version$ = this.store.select(config.getHl7Versions);
    this.metaDataForm = new FormGroup({
      title: new FormControl('', [Validators.required] ),
    });
  }

  ngOnInit() {
  }

  getVersion($event: string) {
    this.store.dispatch(new LoadMessageEvents($event));
  }

  setSelected($event: EventTreeData[]) {
    this.selectedEvents = $event;
  }

  submit() {
    const model: IDocumentCreationWrapper = {
      metadata: this.metaDataForm.getRawValue() , scope: Scope.USER,
      msgEvts: this.selectedEvents ,
    };
    this.store.dispatch(new CreateIg(model));
  }
}
