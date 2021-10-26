import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {selectAllSegments} from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {SlicingEditorComponent} from '../../../core/components/slicing-editor/slicing-editor.component';
import {MessageService} from '../../../dam-framework/services/message.service';
import {Type} from '../../../shared/constants/type.enum';
import {IConformanceProfile} from '../../../shared/models/conformance-profile.interface';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID, IHL7EditorMetadata} from '../../../shared/models/editor.enum';
import {Hl7V2TreeService} from '../../../shared/services/hl7-v2-tree.service';
import {PathService} from '../../../shared/services/path.service';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {SlicingService} from '../../../shared/services/slicing.service';

@Component({
  selector: 'app-conformance-profile-slicing-editor',
  templateUrl: '../../../core/components/slicing-editor/slicing-editor.component.html',
  styleUrls: ['../../../core/components/slicing-editor/slicing-editor.component.css'],
})
export class ConformanceProfileSlicingEditorComponent extends SlicingEditorComponent<IConformanceProfile> implements OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    messageService: MessageService,
    slicingService: SlicingService,
    hl7V2TreeService: Hl7V2TreeService,
    pathService: PathService,
    dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
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

  ngOnInit() {
  }
}
