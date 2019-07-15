import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {selectValueSetById} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import {StructureEditorComponent} from '../../../core/components/structure-editor/structure-editor.component';
import {Message} from '../../../core/models/message/message.class';
import {MessageService} from '../../../core/services/message.service';
import {Type} from '../../../shared/constants/type.enum';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {IChange} from '../../../shared/models/save-change';
import {IValueSet} from '../../../shared/models/value-set.interface';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {ValueSetService} from '../../service/value-set.service';
@Component({
  selector: 'app-value-set-structure-editor',
  templateUrl: './value-set-structure-editor.component.html',
  styleUrls: ['./value-set-structure-editor.component.css'],
})
export class ValueSetStructureEditorComponent extends StructureEditorComponent<IValueSet> implements OnDestroy, OnInit {
  constructor(
    readonly repository: StoreResourceRepositoryService,
    private valueSetService: ValueSetService,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>) {
    super(
      repository,
      messageService,
      actions$,
      store,
      {
        id: EditorID.VALUESET_STRUCTURE,
        title: 'Structure',
        resourceType: Type.VALUESET,
      },
      [
      ],
      [
      ]);
  }

  saveChanges(id: string, igId: string, changes: IChange[]): Observable<Message<any>> {
    return this.valueSetService.saveChanges(id, igId, changes);
  }
  getById(id: string): Observable<IValueSet> {
    return this.valueSetService.getById(id);
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectValueSetById;
  }

}
