import { Component, OnInit } from '@angular/core';
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
import { BindingService } from 'src/app/modules/shared/services/binding.service';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { ConformanceProfileService } from '../../services/conformance-profile.service';

@Component({
  selector: 'app-conformance-profile-bindings-editor',
  templateUrl: '../../../core/components/bindings-editor/bindings-editor.component.html',
  styleUrls: ['../../../core/components/bindings-editor/bindings-editor.component.scss'],
})
export class ConformanceProfileBindingsEditorComponent extends BindingsEditorComponent {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    messageService: MessageService,
    private conformanceProfileService: ConformanceProfileService,
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
        id: EditorID.CP_BINDINGS,
        title: 'Bindings',
        resourceType: Type.CONFORMANCEPROFILE,
      },
    );
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<any>> {
    return this.conformanceProfileService.saveChanges(id, documentRef, changes);
  }
  getResourceById(id: string): Observable<IConformanceProfile> {
    return this.conformanceProfileService.getById(id);
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectMessagesById;
  }
  getBindingsById(id: string): Observable<IFlatResourceBindings> {
    return this.bindingsService.getResourceBindings(Type.CONFORMANCEPROFILE, id);
  }
}
