import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Action, MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {Observable, of, Subscription} from 'rxjs';
import {catchError, flatMap} from 'rxjs/operators';
import {
  LoadCompositeProfile,
} from '../../../../root-store/composite-profile/composite-profile.actions';
import * as fromIgamtDisplaySelectors from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {DefinitionEditorComponent} from '../../../core/components/definition-editor/definition-editor.component';
import {MessageService} from '../../../dam-framework/services/message.service';
import * as fromDam from '../../../dam-framework/store';
import {Type} from '../../../shared/constants/type.enum';
import {IDocumentRef} from '../../../shared/models/abstract-domain.interface';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {ChangeType, PropertyType} from '../../../shared/models/save-change';
import {FroalaService} from '../../../shared/services/froala.service';
import {CompositeProfileService} from '../../services/composite-profile.service';
@Component({
  selector: 'app-predef-editor',
  templateUrl: '../../../core/components/definition-editor/definition-editor.component.html',
  styleUrls: ['../../../core/components/definition-editor/definition-editor.component.scss'],
})

export class CompositeProfilePostDefComponent extends DefinitionEditorComponent implements OnInit, OnDestroy {

  changeSubscription: Subscription;
  syncSubscription: Subscription;
  constructor(
    actions$: Actions,
    store: Store<any>,
    messageService: MessageService,
    private compositeProfileService: CompositeProfileService, froalaService: FroalaService) {
    super({
        id: EditorID.PREDEF,
        resourceType: Type.COMPOSITEPROFILE,
        title: 'Pre-definition',
      },
      PropertyType.POSTDEF,
      actions$, store, messageService, froalaService);
  }

  saveChange(elementId: string, documentRef: IDocumentRef, value: any, old: any, property: PropertyType): Observable<Action> {
    return this.compositeProfileService.saveChanges(elementId, documentRef, [{
      propertyType: PropertyType.POSTDEF,
      propertyValue: value,
      position: -1,
      changeType: ChangeType.UPDATE,
      location: elementId,
      oldPropertyValue: old,
    }]).pipe(
      flatMap((response) => {
        return [
          this.messageService.messageToAction(response),
          new LoadCompositeProfile(elementId),
        ];
      }),
      catchError((error) => {
        return of(
          this.messageService.actionFromError(error),
          new fromDam.EditorSaveFailure(),
        );
      }),
    );
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectCompositeProfileById;
  }
}
