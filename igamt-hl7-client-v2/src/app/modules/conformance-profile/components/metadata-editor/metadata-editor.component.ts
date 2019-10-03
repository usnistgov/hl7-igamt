import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import {Action, MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {catchError, concatMap, flatMap, switchMap, take, tap} from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import {FroalaService} from '../../../shared/services/froala.service';
import {ChangeType, IChange, PropertyType} from '../../../shared/models/save-change';
import {selectIgId} from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import {IgEditResolverLoad} from "src/app/root-store/ig/ig-edit/ig-edit.index";
import {EditorSaveFailure} from "src/app/root-store/ig/ig-edit/ig-edit.index";
import {IResourceMetadata} from "../../../core/components/resource-metadata-editor/resource-metadata-editor.component";
import {Message} from "../../../core/models/message/message.class";
import {IConformanceProfile} from "../../../shared/models/conformance-profile.interface";
import {selectMessagesById} from "src/app/root-store/ig/ig-edit/ig-edit.index";
import {ConformanceProfileService} from "../../services/conformance-profile.service";
import {MessageService} from '../../../core/services/message.service';

export interface IConformanceProfileEditMetadata {
  name: string;
  hl7Version: string;
  organization: string;
  authors: string[];
  messageType: string;
  event: string;
  structID: string;
  profileType: string;
  role: string;
  profileIdentifier: Array<{
    entityIdentifier: string,
    namespaceId: string,
    universalId: string,
    universalIdType: string,
  }>;
}

@Component({
  selector: 'app-metadata-editor',
  templateUrl: './metadata-editor.component.html',
  styleUrls: ['./metadata-editor.component.scss'],
})
export class MetadataEditorComponent extends AbstractEditorComponent implements OnInit {

  conformanceProfileMetadata: Observable<IConformanceProfileEditMetadata>;
  formGroup: FormGroup;
  froalaConfig: Observable<any>;
  typeOptions = [
    {
      label: 'HL7',
      value: 'HL7',
    },
    {
      label: 'Constrainable',
      value: 'Constrainable',
    },
    {
      label: 'Implementation',
      value: 'Implementation',
    },
  ];
  roleOptions = [
    {
      label: 'Sender',
      value: 'Sender',
    },
    {
      label: 'Receiver',
      value: 'Receiver',
    },
    {
      label: 'Sender and Receiver',
      value: 'SenderAndReceiver',
    },
  ];
  s_workspace: Subscription;

  constructor(
    protected actions$: Actions,
    protected formBuilder: FormBuilder,
    protected store: Store<any>,
    protected conformanceProfileService: ConformanceProfileService,
    private froalaService: FroalaService,
    private messageService: MessageService,
  ) {
    super({
      id: EditorID.MESSAGE_METADATA,
      title: 'Metadata',
      resourceType: Type.CONFORMANCEPROFILE,
    },
      actions$,
      store,
    );
    this.conformanceProfileMetadata = this.currentSynchronized$;
    this.froalaConfig = this.froalaService.getConfig();

    this.s_workspace = this.currentSynchronized$.pipe(
      tap((metadata: IConformanceProfileEditMetadata) => {

        this.initFormGroup();
        const profileIdentifierFormArray = this.formGroup.get('profileIdentifier') as FormArray;
        if (metadata.profileIdentifier) {
          for (const profile of metadata.profileIdentifier) {
            profileIdentifierFormArray.push(this.formBuilder.group({
              entityIdentifier: [profile.entityIdentifier],
              namespaceId: [profile.namespaceId],
              universalId: [profile.universalId],
              universalIdType: [profile.universalIdType],
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

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      name: [''],
      hl7Version: [''],
      organization: [''],
      authors: [''],
      messageType: [''],
      event: [''],
      structID: [''],
      profileType: [''],
      role: [''],
      profileIdentifier: this.formBuilder.array([]),
    });
  }

  getArray(): FormArray {
    return this.formGroup.get('profileIdentifier') as FormArray;
  }

  addIdentifier(profileIdentifier: FormArray) {
    profileIdentifier.push(this.formBuilder.group({
      entityIdentifier: [''],
      namespaceId: [''],
      universalId: [''],
      universalIdType: [''],
    }));
  }

  removeIdentifier(profileIdentifier: FormArray, i: number) {
    profileIdentifier.removeAt(i);
  }
  getChanges(elementId: string, current: IConformanceProfileEditMetadata, old: IConformanceProfileEditMetadata): IChange[] {
    const changes: IChange[] = [];

    if (current.authors !== old.authors) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.authors,
        propertyValue: current.authors,
        propertyType: PropertyType.AUTHORS,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }
    if (current.name !== old.name) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.name,
        propertyValue: current.name,
        propertyType: PropertyType.NAME,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    if (current.organization !== old.organization) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.organization,
        propertyValue: current.organization,
        propertyType: PropertyType.ORGANISATION,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    if (current.profileType !== old.profileType) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.profileType,
        propertyValue: current.profileType,
        propertyType: PropertyType.PROFILETYPE,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    if (current.role !== old.role) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.role,
        propertyValue: current.role,
        propertyType: PropertyType.ROLE,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    if (current.profileIdentifier !== old.profileIdentifier) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.profileIdentifier,
        propertyValue: current.profileIdentifier,
        propertyType: PropertyType.PROFILEIDENTIFIER,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    return changes;
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.initial$, this.current$, this.store.select(selectIgId)).pipe(
      take(1),
      concatMap(([id, old, current, igId]) => {
        return this.conformanceProfileService.saveChanges(id, igId, this.getChanges(id, current.data, old)).pipe(
          flatMap((message) => {
            console.log(message);
            return [this.messageService.messageToAction(message), new IgEditResolverLoad(igId)];
          }),
          catchError((error) => of(this.messageService.actionFromError(error), new EditorSaveFailure())),
        );
      }),
    );
  }

  saveChanges(id: string, igId: string, changes: IChange[]): Observable<Message<any>> {
    return this.conformanceProfileService.saveChanges(id, igId, changes);
  }

  // getById(id: string): Observable<IConformanceProfile> {
  //   return this.conformanceProfileService.getById(id);
  // }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectMessagesById;
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgEdit.selectMessagesById, { id: elementId });
      }),
    );
  }

  onDeactivate(): void {
    this.s_workspace.unsubscribe();
  }

  ngOnInit() {

  }

}
