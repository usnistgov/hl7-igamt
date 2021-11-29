import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as config from '../../../../root-store/config/config.reducer';
import { CreateIg, LoadMessageEvents } from '../../../../root-store/create-ig/create-ig.actions';
import * as fromCreateIg from '../../../../root-store/create-ig/create-ig.reducer';
import { IDocumentCreationWrapper } from '../../../document/models/document/document-creation.interface';
import { MessageEventTreeNode } from '../../../document/models/message-event/message-event.class';
import { Scope } from '../../../shared/constants/scope.enum';
import { IAddingInfo } from '../../../shared/models/adding-info';

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

  constructor(private store: Store<any>) {
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
    this.selectedEvents = $event;
  }

  submit() {
    const model: IDocumentCreationWrapper = {
      metadata: this.metaDataForm.getRawValue(), scope: Scope.USER,
      selected: this.selectedEvents,
    };
    this.store.dispatch(new CreateIg(model));
  }
}
