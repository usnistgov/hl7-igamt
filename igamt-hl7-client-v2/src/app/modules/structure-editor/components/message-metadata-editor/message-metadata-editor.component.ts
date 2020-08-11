import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';

@Component({
  selector: 'app-message-metadata-editor',
  templateUrl: './message-metadata-editor.component.html',
  styleUrls: ['./message-metadata-editor.component.scss'],
})
export class MessageMetadataEditorComponent extends AbstractEditorComponent implements OnInit {

  constructor(
    actions$: Actions,
    store: Store<any>,
  ) {
    super({
      id: EditorID.CUSTOM_MESSAGE_STRUC_METADATA,
      title: 'Metadata',
      resourceType: Type.CONFORMANCEPROFILE,
    }, actions$, store);
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return of();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
