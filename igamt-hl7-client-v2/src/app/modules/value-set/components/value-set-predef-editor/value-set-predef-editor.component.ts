import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Actions} from '@ngrx/effects';
import {Action, MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {Observable, of, Subscription} from 'rxjs';
import {catchError, flatMap} from 'rxjs/operators';
import {LoadDatatype} from '../../../../root-store/datatype-edit/datatype-edit.actions';
import {EditorSaveFailure} from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import {selectDatatypesById, selectValueSetById} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import {LoadValueSet} from '../../../../root-store/value-set-edit/value-set-edit.actions';
import {DefinitionEditorComponent} from '../../../core/components/definition-editor/definition-editor.component';
import {MessageService} from '../../../core/services/message.service';
import {DatatypeService} from '../../../datatype/services/datatype.service';
import {Type} from '../../../shared/constants/type.enum';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {ChangeType, PropertyType} from '../../../shared/models/save-change';
import {ValueSetService} from '../../service/value-set.service';

@Component({
  selector: 'app-value-set-predef-editor',
  templateUrl: '../../../core/components/definition-editor/definition-editor.component.html',
  styleUrls: ['../../../core/components/definition-editor/definition-editor.component.scss'],
})
export class ValueSetPredefEditorComponent extends DefinitionEditorComponent implements OnInit, OnDestroy {

  predefForm: FormGroup;
  changeSubscription: Subscription;
  syncSubscription: Subscription;
  constructor(
    actions$: Actions,
    store: Store<any>,
    messageService: MessageService,
    private valueSetService: ValueSetService) {
    super({
        id: EditorID.PREDEF,
        resourceType: Type.VALUESET,
        title: 'Pre-definition',
      },
      PropertyType.PREDEF,
      actions$, store, messageService);
  }

  saveChange(elementId: string, igId: string, value: any, old: any, property: PropertyType): Observable<Action> {
    return this.valueSetService.saveChanges(elementId, igId, [{
      propertyType: PropertyType.PREDEF,
      propertyValue: value,
      position: -1,
      changeType: ChangeType.UPDATE,
      location: elementId,
      oldPropertyValue: old,
    }]).pipe(
      flatMap((response) => {
        return [
          this.messageService.messageToAction(response),
          new LoadValueSet(elementId),
        ];
      }),
      catchError((error) => {
        return of(
          this.messageService.actionFromError(error),
          new EditorSaveFailure(),
        );
      }),
    );
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectValueSetById;
  }
}
