import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, flatMap, switchMap, take } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import {LibraryEditResolverLoad} from 'src/app/root-store/library/library-edit/library-edit.index';
import * as fromIgEdit from 'src/app/root-store/library/library-edit/library-edit.index';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { EditorID } from '../../../shared/models/editor.enum';
import {LibraryService} from '../../services/library.service';

@Component({
  selector: 'app-library-section-editor',
  templateUrl: './library-section-editor.component.html',
  styleUrls: ['./library-section-editor.component.scss'],
})
export class LibrarySectionEditorComponent extends AbstractEditorComponent {

  current: Observable<INarrative>;
  changeTime: Date;

  constructor(
    store: Store<any>,
    actions$: Actions,
    private libraryService: LibraryService,
    private messageService: MessageService) {
    super({
      id: EditorID.SECTION_NARRATIVE,
      title: 'Section',
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
        return this.store.select(fromIgamtDisplaySelectors.selectSectionDisplayById, { id: elementId });
      }),
    );
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.store.select(fromIgEdit.selectLibrary), this.current$)
      .pipe(
        take(1),
        flatMap(([id, library, current]) => {
          return this.libraryService.saveTextSection(library.id, {
            ...current.data,
            id,
          }).pipe(
            flatMap((response) => {
              return [
                new LibraryEditResolverLoad(library.id),
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
