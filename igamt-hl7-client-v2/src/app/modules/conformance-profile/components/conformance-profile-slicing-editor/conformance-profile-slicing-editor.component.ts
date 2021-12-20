import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {
  selectAllSegments,
  selectMessagesById,
} from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {SlicingEditorComponent} from '../../../core/components/slicing-editor/slicing-editor.component';
import {Message} from '../../../dam-framework/models/messages/message.class';
import {MessageService} from '../../../dam-framework/services/message.service';
import {Type} from '../../../shared/constants/type.enum';
import {IDocumentRef} from '../../../shared/models/abstract-domain.interface';
import {IConformanceProfile} from '../../../shared/models/conformance-profile.interface';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID, IHL7EditorMetadata} from '../../../shared/models/editor.enum';
import {IChange} from '../../../shared/models/save-change';
import {Hl7V2TreeService} from '../../../shared/services/hl7-v2-tree.service';
import {PathService} from '../../../shared/services/path.service';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {SlicingService} from '../../../shared/services/slicing.service';
import {ConformanceProfileService} from '../../services/conformance-profile.service';

@Component({
  selector: 'app-conformance-profile-slicing-editor',
  templateUrl: '../../../core/components/slicing-editor/slicing-editor.component.html',
  styleUrls: ['../../../core/components/slicing-editor/slicing-editor.component.css'],
})
export class ConformanceProfileSlicingEditorComponent extends SlicingEditorComponent implements OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    messageService: MessageService,
    slicingService: SlicingService,
    hl7V2TreeService: Hl7V2TreeService,
    pathService: PathService,
    dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
    private conformanceProfileService: ConformanceProfileService,
  ) {
    super(repository, messageService, slicingService, hl7V2TreeService, pathService, dialog, actions$, store, {
      id: EditorID.CP_SLICING,
      title: 'Slicing',
      resourceType: Type.CONFORMANCEPROFILE,
    });
  }
  getAllResources(): Observable<IDisplayElement[]> {
    return this.store.select(selectAllSegments);
  }

  getReferenceType(): Type {
    return Type.SEGMENTREF;
  }
  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<any>> {
    return this.conformanceProfileService.saveChanges(id, documentRef, changes);
  }

  getById(id: string): Observable<IConformanceProfile> {
    return this.conformanceProfileService.getById(id);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectMessagesById;
  }

  ngOnInit() {
  }
}
