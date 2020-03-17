import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, flatMap, switchMap, take } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import * as fromIgEdit from 'src/app/root-store/document/document-edit/ig-edit.index';
import { IgEditResolverLoad } from '../../../../root-store/document/document-edit/ig-edit.actions';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { EditorID } from '../../../shared/models/editor.enum';
import { IgService } from '../../services/ig.service';

@Component({
  selector: 'app-document-section-editor',
  templateUrl: './document-section-editor.component.html',
  styleUrls: ['./document-section-editor.component.scss'],
})
export class DocumentSectionEditorComponent extends AbstractEditorComponent {

  current: Observable<INarrative>;
  changeTime: Date;

  constructor(
    store: Store<fromIgEdit.IState>,
    actions$: Actions,
    private igService: IgService,
    private messageService: MessageService) {
    super({
        id: EditorID.SECTION_NARRATIVE,
        resourceType: Type.TEXT,
      },
      actions$,
      store,
    );
  }

  dataChange(form: FormGroup) {
    this.editorChange(form.getRawValue(), form.valid);
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgEdit.selectSectionDisplayById, { id: elementId });
      }),
    );
  }

  onEditorSave(action: fromIgEdit.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.store.select(fromIgEdit.selectIgDocument), this.current$)
      .pipe(
        take(1),
        flatMap(([id, ig, current]) => {
          return this.igService.saveTextSection(ig.id, {
            ...current.data,
            id,
          }).pipe(
            flatMap((response) => {
              return [
                new IgEditResolverLoad(ig.id),
                this.messageService.messageToAction(response),
              ];
            }),
            catchError((error) => {
              return of(this.messageService.actionFromError(error));
            }),
          );
        }),
      );
  }

  onDeactivate() {

  }
}

export interface INarrative {
  id: string;
  label: string;
  description: string;
}
