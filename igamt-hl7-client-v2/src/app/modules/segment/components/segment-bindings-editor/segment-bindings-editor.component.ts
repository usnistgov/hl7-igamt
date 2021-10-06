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
import { EditorID, IHL7EditorMetadata } from 'src/app/modules/shared/models/editor.enum';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { BindingService } from 'src/app/modules/shared/services/binding.service';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { SegmentService } from '../../services/segment.service';

@Component({
  selector: 'app-segment-bindings-editor',
  templateUrl: '../../../core/components/bindings-editor/bindings-editor.component.html',
  styleUrls: ['../../../core/components/bindings-editor/bindings-editor.component.scss'],
})
export class SegmentBindingsEditorComponent extends BindingsEditorComponent {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    messageService: MessageService,
    private segmentService: SegmentService,
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
        id: EditorID.SEGMENT_BINDINGS,
        title: 'Bindings',
        resourceType: Type.SEGMENT,
      },
    );
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<any>> {
    return this.segmentService.saveChanges(id, documentRef, changes);
  }
  getResourceById(id: string): Observable<ISegment> {
    return this.segmentService.getById(id);
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectSegmentsById;
  }
  getBindingsById(id: string): Observable<IFlatResourceBindings> {
    return this.bindingsService.getResourceBindings(Type.SEGMENT, id);
  }
}
