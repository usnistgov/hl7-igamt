import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { DefinitionEditorComponent } from 'src/app/modules/core/components/definition-editor/definition-editor.component';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { LoadConformanceProfile } from '../../../../root-store/conformance-profile-edit/conformance-profile-edit.actions';
import { EditorSaveFailure } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectMessagesById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ChangeType, PropertyType } from '../../../shared/models/save-change';
import { ConformanceProfileService } from '../../services/conformance-profile.service';

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
    private conformanceProfileService: ConformanceProfileService) {
    super({
      id: EditorID.PREDEF,
      resourceType: Type.CONFORMANCEPROFILE,
      title: 'Pre-definition',
    },
      PropertyType.PREDEF,
      actions$, store, messageService);
  }

  saveChange(elementId: string, igId: string, value: any, old: any, property: PropertyType): Observable<Action> {
    return this.conformanceProfileService.saveChanges(elementId, igId, [{
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
          new LoadConformanceProfile(elementId),
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
    return selectMessagesById;
  }
}