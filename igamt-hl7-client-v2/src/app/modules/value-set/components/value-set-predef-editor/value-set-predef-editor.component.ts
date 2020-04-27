import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/data/dam.actions';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { LoadValueSet } from '../../../../root-store/value-set-edit/value-set-edit.actions';
import { DefinitionEditorComponent } from '../../../core/components/definition-editor/definition-editor.component';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { ChangeType, PropertyType } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
import { ValueSetService } from '../../service/value-set.service';

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
    private valueSetService: ValueSetService, froalaService: FroalaService) {
    super({
      id: EditorID.PREDEF,
      resourceType: Type.VALUESET,
      title: 'Pre-definition',
    },
      PropertyType.PREDEF,
      actions$, store, messageService, froalaService);
  }

  saveChange(elementId: string, documentRef: IDocumentRef, value: any, old: any, property: PropertyType): Observable<Action> {
    return this.valueSetService.saveChanges(elementId, documentRef, [{
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
          new fromDamActions.EditorSaveFailure(),
        );
      }),
    );
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectValueSetById;
  }
}
