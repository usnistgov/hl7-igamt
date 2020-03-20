import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import * as config from '../../../../root-store/config/config.reducer';
import {CreateDocument, LoadMessageEvents} from '../../../../root-store/create-ig/create-document.actions';
import * as fromCreateIg from '../../../../root-store/create-ig/create-document.reducer';
import {selectDocumentType} from '../../../../root-store/document/document.reducer';
import {LoadResource} from '../../../../root-store/resource-loader/resource-loader.actions';
import {getData} from '../../../../root-store/resource-loader/resource-loader.reducer';
import {IDocumentationWrapper} from '../../../documentation/models/documentation.interface';
import {Scope} from '../../../shared/constants/scope.enum';
import {Type} from '../../../shared/constants/type.enum';
import {IAddingInfo} from '../../../shared/models/adding-info';
import {IDocumentType} from '../../document.type';
import {IDocumentCreationWrapper} from '../../models/ig/document-creation.interface';
import { MessageEventTreeNode} from '../../models/message-event/message-event.class';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.scss'],
})
export class CreateDocumentComponent implements OnInit {

  table$: Observable<MessageEventTreeNode[]>;
  hl7Version$: Observable<string[]>;
  metaDataForm: FormGroup;
  selected: IAddingInfo[] = [];
  documentType$: Observable<IDocumentType>;

  constructor(private store: Store<any>) {
    this.documentType$ = this.store.select(selectDocumentType);
    this.table$ = this.store.select(getData);
    this.hl7Version$ = this.store.select(config.getHl7Versions);
    this.metaDataForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
  }

  getVersion($event: string) {
    this.documentType$.pipe(
      map((x: IDocumentType) => {
        console.log(x);
        if (x.type === Type.IGDOCUMENT) {
          this.store.dispatch(new LoadResource({type: Type.EVENTS, scope: Scope.HL7STANDARD, version: $event}));
        } else if (x.type === Type.DATATYPELIBRARY) {
          this.store.dispatch(new LoadResource({type: Type.DATATYPE, scope: Scope.HL7STANDARD, version: $event}));
        }
      })).subscribe();
  }

  updateAdded($event: IAddingInfo[]) {
    this.selected = $event;
  }

  submit() {
   const subscription = this.documentType$.pipe(
      take(1),
      map((x: IDocumentType) => {
        this.store.dispatch(new CreateDocument({
          metadata: this.metaDataForm.getRawValue(), scope: x.scope,
          added: this.selected,
          type: x.type,
        }));
      })).subscribe();
  }
}
