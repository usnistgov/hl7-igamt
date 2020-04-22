import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { DefinitionEditorComponent } from 'src/app/modules/core/components/definition-editor/definition-editor.component';
import * as fromDamActions from 'src/app/modules/dam-framework/store/dam.actions';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { LoadSegment } from 'src/app/root-store/segment-edit/segment-edit.actions';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ChangeType, PropertyType } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
import { SegmentService } from '../../services/segment.service';

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
    private segmentService: SegmentService, froalaService: FroalaService) {
    super({
      id: EditorID.PREDEF,
      resourceType: Type.SEGMENT,
      title: 'Pre-definition',
    },
      PropertyType.PREDEF,
      actions$, store, messageService, froalaService);
  }

  saveChange(elementId: string, documentRef: IDocumentRef, value: any, old: any, property: PropertyType): Observable<Action> {
    return this.segmentService.saveChanges(elementId, documentRef, [{
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
          new LoadSegment(elementId),
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
    return fromIgamtDisplaySelectors.selectSegmentsById;
  }
}
