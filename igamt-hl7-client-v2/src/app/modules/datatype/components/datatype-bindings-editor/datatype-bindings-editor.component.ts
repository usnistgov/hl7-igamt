import { Component } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BindingsEditorComponent } from 'src/app/modules/core/components/bindings-editor/bindings-editor.component';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IDocumentRef } from 'src/app/modules/shared/models/abstract-domain.interface';
import { IFlatResourceBindings } from 'src/app/modules/shared/models/binding.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { IVerificationIssue } from 'src/app/modules/shared/models/verification.interface';
import { BindingService } from 'src/app/modules/shared/services/binding.service';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { IDatatype } from '../../../shared/models/datatype.interface';
import { DatatypeService } from '../../services/datatype.service';

@Component({
  selector: 'app-datatype-bindings-editor',
  templateUrl: '../../../core/components/bindings-editor/bindings-editor.component.html',
  styleUrls: ['../../../core/components/bindings-editor/bindings-editor.component.scss'],
})
export class DatatypeBindingsEditorComponent extends BindingsEditorComponent {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    messageService: MessageService,
    private datatypeService: DatatypeService,
    private bindingsService: BindingService,
    actions$: Actions,
    store: Store<any>) {
    super(
      repository,
      messageService,
      actions$,
      store,
      bindingsService,
      {
        id: EditorID.DATATYPE_BINDINGS,
        title: 'Bindings',
        resourceType: Type.DATATYPE,
      },
    );
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<any>> {
    return this.datatypeService.saveChanges(id, documentRef, changes);
  }
  getResourceById(id: string): Observable<IDatatype> {
    return this.datatypeService.getById(id);
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectDatatypesById;
  }
  getBindingsById(id: string): Observable<IFlatResourceBindings> {
    return this.bindingsService.getResourceBindings(Type.DATATYPE, id);
  }
  verify(id: string, documentInfo: IDocumentRef): Observable<IVerificationIssue[]> {
    return this.bindingsService.getVerifyResourceBindings(Type.DATATYPE, id);
  }
}
