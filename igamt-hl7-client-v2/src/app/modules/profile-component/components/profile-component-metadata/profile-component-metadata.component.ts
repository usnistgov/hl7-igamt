import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { catchError, concatMap, flatMap, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import * as fromIgamtDisplaySelectors from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import { IgEditResolverLoad } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { LoadProfileComponent } from '../../../../root-store/profile-component/profile-component.actions';
import { IConformanceProfileEditMetadata } from '../../../conformance-profile/components/metadata-editor/metadata-editor.component';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import * as fromDam from '../../../dam-framework/store';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { ChangeType, IChange, PropertyType } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
import { ProfileComponentService } from '../../services/profile-component.service';

@Component({
  selector: 'app-profile-component-metadata',
  templateUrl: './profile-component-metadata.component.html',
  styleUrls: ['./profile-component-metadata.component.css'],
})
export class ProfileComponentMetadataComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  profileComponentMetadata: Observable<IProfileComponentMetadata>;
  formGroup: FormGroup;
  froalaConfig$: Observable<any>;
  s_workspace: Subscription;
  s_children: Subscription;
  contexts: IDisplayElement[];

  constructor(
    protected actions$: Actions,
    protected formBuilder: FormBuilder,
    protected store: Store<any>,
    protected profileComponentService: ProfileComponentService,
    private froalaService: FroalaService,
    private messageService: MessageService,
  ) {
    super({
      id: EditorID.PC_METADATA,
      title: 'Metadata',
      resourceType: Type.PROFILECOMPONENT,
    },
      actions$,
      store,
    );
    this.profileComponentMetadata = this.currentSynchronized$;
    this.froalaConfig$ = this.froalaService.getConfig();
    this.s_workspace = this.currentSynchronized$.pipe(
      tap((metadata: IProfileComponentMetadata) => {
        this.initFormGroup();
        this.formGroup.patchValue(metadata);
        this.formGroup.valueChanges.subscribe((changed) => {
          this.editorChange(changed, this.formGroup.valid);
        });

      }),
    ).subscribe();

    this.s_children = this.editorDisplayNode().subscribe((x) => this.contexts = x.children);

  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl('', []),
      preDef: new FormControl('', []),
      postDef: new FormControl('', []),
      profileIdentifier: this.formBuilder.group({
        entityIdentifier: [''],
        namespaceId: [''],
        universalId: [''],
        universalIdType: [''],
      }),
    });
  }
  getValue(value: string) {
    return this.formGroup.getRawValue()[value];
  }
  getChanges(elementId: string, current: IProfileComponentMetadata, old: IProfileComponentMetadata): IChange[] {
    const changes: IChange[] = [];

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
    if (current.description !== old.description) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.description,
        propertyValue: current.description,
        propertyType: PropertyType.DESCRIPTION,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    if (current.preDef !== old.preDef) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.preDef,
        propertyValue: current.preDef,
        propertyType: PropertyType.PREDEF,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    if (current.postDef !== old.postDef) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.postDef,
        propertyValue: current.postDef,
        propertyType: PropertyType.POSTDEF,
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

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.initial$, this.current$, this.documentRef$).pipe(
      take(1),
      concatMap(([id, old, current, documentRef]) => {
        return this.profileComponentService.saveChanges(id, documentRef, this.getChanges(id, current.data, old)).pipe(
          flatMap((message) => {
            /// TODO handle libary case
            return [this.messageService.messageToAction(message), new LoadProfileComponent(id), new IgEditResolverLoad(documentRef.documentId)];
          }),
          catchError((error) => of(this.messageService.actionFromError(error), new fromDam.EditorSaveFailure())),
        );
      }),
    );
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<any>> {
    return this.profileComponentService.saveChanges(id, documentRef, changes);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectProfileComponentById;
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgamtDisplaySelectors.selectProfileComponentById, { id: elementId });
      }),
    );
  }

  onDeactivate(): void {
  }

  ngOnDestroy() {
    this.s_workspace.unsubscribe();
    this.s_children.unsubscribe();
  }

  ngOnInit() {

  }

}
export interface IProfileComponentMetadata {
  name: string;
  description: string;
  displayName?: string;
  preDef?: string;
  postDef?: string;
  profileIdentifier: {
    entityIdentifier?: string,
    namespaceId?: string,
    universalId?: string,
    universalIdType?: string,
  };
}
