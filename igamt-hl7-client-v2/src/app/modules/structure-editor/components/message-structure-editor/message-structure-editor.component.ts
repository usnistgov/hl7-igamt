import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { EditorSave } from '../../../dam-framework/store/data/dam.actions';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';

@Component({
  selector: 'app-message-structure-editor',
  templateUrl: './message-structure-editor.component.html',
  styleUrls: ['./message-structure-editor.component.scss'],
})
export class MessageStructureEditorComponent extends AbstractEditorComponent implements OnInit {

  constructor(
    actions$: Actions,
    store: Store<any>,
  ) {
    super({
      id: EditorID.CONFP_CUSTOM_STRUCTURE,
      title: 'Structure',
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
