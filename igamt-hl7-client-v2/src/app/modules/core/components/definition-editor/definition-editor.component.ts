import { OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { concatMap, flatMap, take } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../../shared/models/editor.enum';
import { PropertyType } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
import { MessageService } from '../../services/message.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export abstract class DefinitionEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  definition: FormGroup;
  changeSubscription: Subscription;
  syncSubscription: Subscription;
  protected froalaConfig$: Observable<any>;

  constructor(
    editorMetadata: IHL7EditorMetadata,
    private propertyType: PropertyType,
    actions$: Actions,
    store: Store<any>,
    protected messageService: MessageService, protected froalaService: FroalaService) {
    super(editorMetadata, actions$, store);
    this.froalaConfig$ = this.froalaService.getConfig();

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

  abstract saveChange(elementId: string, documentRef: IDocumentRef, value: any, old: any, property: PropertyType): Observable<Action>;

  dataChange(formGroup: FormGroup) {
    this.editorChange(formGroup.getRawValue(), formGroup.valid);
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$, this.current$, this.initial$).pipe(
      take(1),
      flatMap(([id, documentRef, definition, initial]) => {
        return this.saveChange(id, documentRef, definition.data.value, initial.value, this.propertyType);
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

  onDeactivate() {
    this.ngOnDestroy();
  }

}
