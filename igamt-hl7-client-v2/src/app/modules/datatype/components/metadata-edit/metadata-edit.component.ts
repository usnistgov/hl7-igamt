import { Component, OnInit } from '@angular/core';
import {Validators} from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import {concatMap, map, switchMap, take} from 'rxjs/operators';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import {selectLoadedDocumentInfo} from '../../../../root-store/dam-igamt/igamt.selectors';
import { LoadDatatype } from '../../../../root-store/datatype-edit/datatype-edit.actions';
import { ResourceMetadataEditorComponent } from '../../../core/components/resource-metadata-editor/resource-metadata-editor.component';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import {FieldType} from '../../../shared/components/metadata-form/metadata-form.component';
import { Type } from '../../../shared/constants/type.enum';
import {validateConvention} from '../../../shared/functions/convention-factory';
import {validateUnity} from '../../../shared/functions/unicity-factory';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
import { DatatypeService } from '../../services/datatype.service';

@Component({
  selector: 'app-metadata-edit',
  templateUrl: '../../../core/components/resource-metadata-editor/resource-metadata-editor.component.html',
  styleUrls: ['../../../core/components/resource-metadata-editor/resource-metadata-editor.component.scss'],
})
export class MetadataEditComponent extends ResourceMetadataEditorComponent implements OnInit {
  constructor(
    store: Store<any>,
    actions$: Actions,
    private datatypeService: DatatypeService,
    messageService: MessageService, froalaService: FroalaService) {
    super(
      {
        id: EditorID.DATATYPE_METADATA,
        resourceType: Type.DATATYPE,
        title: 'Metadata',
      },
      actions$,
      messageService,
      store,
      froalaService,
    );
  }
  save(changes: IChange[]): Observable<Message<any>> {
    return combineLatest(this.elementId$, this.documentRef$).pipe(
      take(1),
      concatMap(([id, documentRef]) => {
        return this.datatypeService.saveChanges(id, documentRef, changes);
      }),
    );
  }

  reloadResource(resourceId: string): Action {
    return new LoadDatatype(resourceId);
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgamtDisplaySelectors.selectDatatypesById, { id: elementId });
      }),
    );
  }

  getExistingList(): Observable<IDisplayElement[]> {
    return this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes);
  }

  ngOnInit() {
  }

}
