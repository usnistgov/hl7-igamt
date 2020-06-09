import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { concatMap, map, switchMap, take } from 'rxjs/operators';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import { LoadValueSet } from '../../../../root-store/value-set-edit/value-set-edit.actions';
import { ResourceMetadataEditorComponent } from '../../../core/components/resource-metadata-editor/resource-metadata-editor.component';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { FieldType } from '../../../shared/components/metadata-form/metadata-form.component';
import { Type } from '../../../shared/constants/type.enum';
import { validateUnity } from '../../../shared/functions/unicity-factory';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
import { ValueSetService } from '../../service/value-set.service';

@Component({
  selector: 'app-metadata-edit',
  templateUrl: '../../../core/components/resource-metadata-editor/resource-metadata-editor.component.html',
  styleUrls: ['../../../core/components/resource-metadata-editor/resource-metadata-editor.component.scss'],
})
export class ValueSetMetadataEditorComponent extends ResourceMetadataEditorComponent implements OnInit {

  constructor(
    store: Store<any>,
    actions$: Actions,
    private valueSetService: ValueSetService,
    messageService: MessageService, froalaService: FroalaService) {
    super(
      {
        id: EditorID.VALUESET_METADATA,
        resourceType: Type.VALUESET,
        title: 'Metadata',
      },
      actions$,
      messageService,
      store,
      froalaService,
    );
    const authorNotes = 'Author notes';
    const usageNotes = 'Usage notes';
    const domainInfo$ = this.store.select(fromIgamtSelectedSelectors.selectSelectedResource).pipe(
      map((resource) => {
        return resource.domainInfo;
      }),
    );
    const name$ = this.store.select(fromIgamtSelectedSelectors.selectSelectedResource).pipe(
      map((resource) => {
        return resource.name;
      }),
    );

    this.metadataFormInput$ = combineLatest(domainInfo$, name$, super.getOthers()).pipe(
      map(([domainInfo, name, existing]) => {
        return {
          data: this.currentSynchronized$,
          viewOnly: this.viewOnly$,
          model: {
            bindingIdentifier: {
              label: 'Binding identifier',
              placeholder: 'Binding Identifier',
              validators: [validateUnity(existing, name, domainInfo)],
              type: FieldType.TEXT,
              id: 'bindingIdentifier',
              disabled: false,
              name: 'bindingIdentifier',
            },
            name: {
              label: 'Name',
              placeholder: 'Name',
              validators: [],
              type: FieldType.TEXT,
              id: 'name',
              disabled: false,
              name: 'name',
            },
            authorNotes: {
              label: authorNotes,
              placeholder: authorNotes,
              validators: [],
              enum: [],
              type: FieldType.RICH,
              id: 'authornotes',
              name: authorNotes,
            },
            usageNotes: {
              label: usageNotes,
              placeholder: usageNotes,
              validators: [],
              enum: [],
              type: FieldType.RICH,
              id: 'usagenotes',
              name: usageNotes,
            },
          },
        };
      }),
    );
  }

  save(changes: IChange[]): Observable<Message<any>> {
    return combineLatest(this.elementId$, this.documentRef$).pipe(
      take(1),
      concatMap(([id, documentRef]) => {
        return this.valueSetService.saveChanges(id, documentRef, changes);
      }),
    );
  }

  reloadResource(resourceId: string): Action {
    return new LoadValueSet(resourceId);
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      take(1),
      switchMap((elementId) => {
        return this.store.select(fromIgamtDisplaySelectors.selectValueSetById, { id: elementId });
      }),
    );
  }

  ngOnInit() {
  }

  getExistingList(): Observable<IDisplayElement[]> {
    return this.store.select(fromIgamtDisplaySelectors.selectAllValueSets);
  }

}
