import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';

export interface IConformanceProfileEditMetadata {
  name: string;
  hl7Version: string;
  organization: string;
  author: string[];
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
      author: [''],
      messageType: [''],
      event: [''],
      structID: [''],
      profileType: [''],
      role: [''],
      profileIdentifier: this.formBuilder.array([]),
    });
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

  onEditorSave(action: EditorSave): Observable<Action> {
    return of();
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
