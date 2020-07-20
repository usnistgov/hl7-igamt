import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { LoadSegment } from '../../../../root-store/segment-edit/segment-edit.actions';
import { ResourceMetadataEditorComponent } from '../../../core/components/resource-metadata-editor/resource-metadata-editor.component';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
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
    protected segmentService: SegmentService, froalaService: FroalaService) {
    super({
      id: EditorID.SEGMENT_METADATA,
      title: 'Metadata',
      resourceType: Type.SEGMENT,
    }, actions$, messageService, store, froalaService);
  }

  save(changes: IChange[]): Observable<Message<any>> {
    return combineLatest(this.elementId$, this.documentRef$).pipe(
      take(1),
      concatMap(([id, documentRef]) => {
        return this.segmentService.saveChanges(id, documentRef, changes);
      }),
    );
  }

  reloadResource(resourceId: string): Action {
    return new LoadSegment(resourceId);
  }

  getExistingList(): Observable<IDisplayElement[]> {
    return this.store.select(fromIgamtDisplaySelectors.selectAllSegments);
  }
  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      take(1),
      concatMap((id) => {
        return this.store.select(fromIgamtDisplaySelectors.selectSegmentsById, { id });
      }),
    );
  }

  ngOnInit() {
  }

}
