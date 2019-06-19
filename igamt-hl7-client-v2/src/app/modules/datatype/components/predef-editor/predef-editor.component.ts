import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { DefinitionEditorComponent } from 'src/app/modules/core/components/definition-editor/definition-editor.component';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { LoadDatatype } from 'src/app/root-store/datatype-edit/datatype-edit.actions';
import { EditorSaveFailure } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectDatatypesById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ChangeType, PropertyType } from '../../../shared/models/save-change';
import { DatatypeService } from '../../services/datatype.service';

@Component({
  selector: 'app-predef-editor',
  templateUrl: '../../../core/components/definition-editor/definition-editor.component.html',
  styleUrls: ['../../../core/components/definition-editor/definition-editor.component.scss'],
})
export class PredefEditorComponent extends DefinitionEditorComponent implements OnInit, OnDestroy {

  predefForm: FormGroup;
  changeSubscription: Subscription;
  syncSubscription: Subscription;
  constructor(
    actions$: Actions,
    store: Store<any>,
    messageService: MessageService,
    private datatypeService: DatatypeService) {
    super({
      id: EditorID.PREDEF,
      resourceType: Type.DATATYPE,
      title: 'Pre-definition',
    },
      PropertyType.PREDEF,
      actions$, store, messageService);
  }

  saveChange(elementId: string, igId: string, value: any, old: any, property: PropertyType): Observable<Action> {
    return this.datatypeService.saveChanges(elementId, igId, [{
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
          new LoadDatatype(elementId),
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
    return selectDatatypesById;
  }
}
