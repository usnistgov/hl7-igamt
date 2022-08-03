import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, take, tap, switchMap } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { selectMessageStructureById } from '../../../../root-store/structure-editor/structure-editor.reducer';
import { MessageService } from '../../../dam-framework/services/message.service';
import { IEvent } from '../../../shared/models/conformance-profile.interface';
import { StructureEditorComponent } from '../../services/structure-editor-component.abstract';
import { StructureEditorService } from '../../services/structure-editor.service';

export interface IMessageStructureMetadata {
  structId: string;
  messageType: string;
  description: string;
  hl7Version: string;
  events: IEvent[];
}

@Component({
  selector: 'app-message-metadata-editor',
  templateUrl: './message-metadata-editor.component.html',
  styleUrls: ['./message-metadata-editor.component.scss'],
})
export class MessageMetadataEditorComponent extends StructureEditorComponent implements OnInit, OnDestroy {

  s_workspace: Subscription;
  formGroup: FormGroup;
  eventStub: IEvent = {
    id: undefined,
    name: '',
    parentStructId: undefined,
    description: '',
    type: Type.EVENT,
    hl7Version: undefined,
  };

  constructor(
    actions$: Actions,
    protected formBuilder: FormBuilder,
    private structureEditorService: StructureEditorService,
    private messageService: MessageService,
    store: Store<any>,
  ) {
    super({
      id: EditorID.CUSTOM_MESSAGE_STRUC_METADATA,
      title: 'Metadata',
      resourceType: Type.CONFORMANCEPROFILE,
    }, actions$, store);

    this.s_workspace = this.currentSynchronized$.pipe(
      tap((metadata: IMessageStructureMetadata) => {

        this.initFormGroup();
        this.eventStub.parentStructId = metadata.structId;
        this.eventStub.hl7Version = metadata.hl7Version;

        const eventsFormArray = this.getArray();
        if (metadata.events) {
          for (const event of metadata.events) {
            eventsFormArray.push(this.formBuilder.group({
              id: [event.id],
              name: [event.name],
              parentStructId: [event.parentStructId],
              description: [event.description],
              type: [event.type],
              hl7Version: [event.hl7Version],
            }));
          }
        }
        this.formGroup.patchValue(metadata);
        this.formGroup.valueChanges.subscribe((changed) => {
          this.editorChange(changed, this.formGroup.valid);
        });

      }),
    ).subscribe();
  }

  deleteEvent(i: number) {
    const eventsFormArray = this.getArray();
    eventsFormArray.removeAt(i);
  }

  addEvent(value: IEvent) {
    const eventsFormArray = this.getArray();
    eventsFormArray.push(this.formBuilder.group({
      id: [value.id],
      name: [value.name],
      parentStructId: [value.parentStructId],
      description: [value.description],
      type: [value.type],
      hl7Version: [value.hl7Version],
    }));
    this.eventStub.name = '';
    this.eventStub.description = '';
  }

  getArray(): FormArray {
    return this.formGroup.get('events') as FormArray;
  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      structId: [''],
      messageType: [''],
      description: [''],
      hl7Version: [''],
      events: this.formBuilder.array([]),
    });
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((id) => {
        return this.store.select(selectMessageStructureById, { id });
      }),
    );
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.current$).pipe(
      take(1),
      concatMap(([id, current]) => {
        return this.structureEditorService.saveMessageStructureMetadata(id, current.data).pipe(
          flatMap((message) => {
            return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: current.data, updateDate: false }), new fromDam.SetValue({ selected: current.data })];
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  ngOnDestroy() {
    this.s_workspace.unsubscribe();
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
