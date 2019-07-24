import { OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import {concatMap, flatMap, take, tap} from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IEditorMetadata } from '../../../shared/models/editor.enum';
import { PropertyType } from '../../../shared/models/save-change';
import { MessageService } from '../../services/message.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export abstract class DefinitionEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  definition: FormGroup;
  changeSubscription: Subscription;
  syncSubscription: Subscription;

  constructor(
    editorMetadata: IEditorMetadata,
    private propertyType: PropertyType,
    actions$: Actions,
    store: Store<any>,
    protected messageService: MessageService) {
    super(editorMetadata, actions$, store);

    this.definition = new FormGroup({
      value: new FormControl(''),
    });

    this.changeSubscription = this.definition.valueChanges.subscribe((changes) => {
      this.dataChange(this.definition);
    });

    this.syncSubscription = this.currentSynchronized$.subscribe((current) => {
      this.definition.patchValue(current, { emitEvent: false });
    });

  }

  abstract saveChange(elementId: string, igId: string, value: any, old: any, property: PropertyType): Observable<Action>;

  dataChange(formGroup: FormGroup) {
    this.editorChange(formGroup.getRawValue(), formGroup.valid);
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.store.select(fromIgEdit.selectIgId), this.current$, this.initial$).pipe(
      take(1),
      flatMap(([id, igId, definition, initial]) => {
        return this.saveChange(id, igId, definition.data.value, initial.value, this.propertyType);
      }),
    );
  }

  abstract elementSelector(): MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>;

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id });
      }),
    );
  }

  ngOnDestroy(): void {
    if (this.syncSubscription) {
      this.syncSubscription.unsubscribe();
    }
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  ngOnInit() {
  }

}
