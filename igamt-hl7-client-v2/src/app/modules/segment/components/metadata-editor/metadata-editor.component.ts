import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { selectIgId, selectSegmentsById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { ResourceMetadataEditorComponent } from '../../../core/components/resource-metadata-editor/resource-metadata-editor.component';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { SegmentService } from '../../services/segment.service';

@Component({
  selector: 'app-metadata-editor',
  templateUrl: '../../../core/components/resource-metadata-editor/resource-metadata-editor.component.html',
  styleUrls: ['../../../core/components/resource-metadata-editor/resource-metadata-editor.component.scss'],
})
export class MetadataEditorComponent extends ResourceMetadataEditorComponent implements OnInit {

  constructor(
    protected actions$: Actions,
    messageService: MessageService,
    protected store: Store<any>,
    protected segmentService: SegmentService) {
    super({
      id: EditorID.SEGMENT_METADATA,
      title: 'Metadata',
      resourceType: Type.SEGMENT,
    }, actions$, messageService, store);
  }

  save(changes: IChange[]): Observable<Message<any>> {
    return combineLatest(this.elementId$, this.store.select(selectIgId)).pipe(
      take(1),
      concatMap(([id, documentId]) => {
        return this.segmentService.saveChanges(id, documentId, changes);
      }),
    );
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectSegmentsById, { id });
      }),
    );
  }

  ngOnInit() {
  }

}
