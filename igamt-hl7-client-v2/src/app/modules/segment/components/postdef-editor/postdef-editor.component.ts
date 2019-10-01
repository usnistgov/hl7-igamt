import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { EditorSaveFailure } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectSegmentsById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { LoadSegment } from '../../../../root-store/segment-edit/segment-edit.actions';
import { DefinitionEditorComponent } from '../../../core/components/definition-editor/definition-editor.component';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { ChangeType, PropertyType } from '../../../shared/models/save-change';
import { SegmentService } from '../../services/segment.service';
import {FroalaService} from "../../../shared/services/froala.service";

@Component({
  selector: 'app-predef-editor',
  templateUrl: '../../../core/components/definition-editor/definition-editor.component.html',
  styleUrls: ['../../../core/components/definition-editor/definition-editor.component.scss'],
})
export class PostdefEditorComponent extends DefinitionEditorComponent implements OnInit, OnDestroy {

  predefForm: FormGroup;
  changeSubscription: Subscription;
  syncSubscription: Subscription;
  constructor(
    actions$: Actions,
    store: Store<any>,
    messageService: MessageService,
    private segmentService: SegmentService, froalaService: FroalaService) {
    super({
      id: EditorID.POSTDEF,
      resourceType: Type.SEGMENT,
      title: 'Post-definition',
    },
      PropertyType.PREDEF,
      actions$, store, messageService, froalaService);
  }

  saveChange(elementId: string, igId: string, value: any, old: any, property: PropertyType): Observable<Action> {
    return this.segmentService.saveChanges(elementId, igId, [{
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
          new LoadSegment(elementId),
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
    return selectSegmentsById;
  }
}
