import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Actions} from '@ngrx/effects';
import {Action, MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {catchError, concatMap, flatMap, map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {LoadCompositeProfile} from '../../../../root-store/composite-profile/composite-profile.actions';
import * as fromIgamtDisplaySelectors from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {selectSelectedResource} from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import {IgEditResolverLoad} from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import {LoadProfileComponent} from '../../../../root-store/profile-component/profile-component.actions';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {Message} from '../../../dam-framework/models/messages/message.class';
import {MessageService} from '../../../dam-framework/services/message.service';
import * as fromDam from '../../../dam-framework/store';
import {Scope} from '../../../shared/constants/scope.enum';
import {Type} from '../../../shared/constants/type.enum';
import {validateConvention} from '../../../shared/functions/convention-factory';
import {validateGeneratedFlavorsUnicity} from '../../../shared/functions/unicity-factory';
import {IDocumentRef} from '../../../shared/models/abstract-domain.interface';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {ChangeType, IChange, PropertyType} from '../../../shared/models/save-change';
import {FroalaService} from '../../../shared/services/froala.service';
import {CompositeProfileService} from '../../services/composite-profile.service';

@Component({
  selector: 'app-composite-profile-metadata-editor',
  templateUrl: './composite-profile-metadata-editor.component.html',
  styleUrls: ['./composite-profile-metadata-editor.component.css'],
})
export class CompositeProfileMetadataEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  compositeProfileMetadata: Observable<ICompositeProfileMetadata>;
  formGroup: FormGroup;
  froalaConfig: Observable<any>;
  s_workspace: Subscription;
  s_children: Subscription;
  contexts: IDisplayElement[];

  constructor(
    protected actions$: Actions,
    protected formBuilder: FormBuilder,
    protected store: Store<any>,
    protected compositeProfileService: CompositeProfileService,
    private froalaService: FroalaService,
    private messageService: MessageService,
  ) {
    super({
        id: EditorID.COMPOSITE_PROFILE_METADATA,
        title: 'Metadata',
        resourceType: Type.COMPOSITEPROFILE,
      },
      actions$,
      store,
    );
    this.compositeProfileMetadata = this.currentSynchronized$;
    this.froalaConfig = this.froalaService.getConfig();
    this.s_workspace = this.currentSynchronized$.pipe(
      withLatestFrom(this.getOthers()),
      tap(([metadata, others]) => {
        this.initFormGroup(others);
        this.formGroup.patchValue(metadata);
        this.formGroup.valueChanges.subscribe((changed) => {
          this.editorChange(changed, this.formGroup.valid);
        });
      }),
    ).subscribe();

    this.s_children = this.editorDisplayNode().subscribe((x) => this.contexts = x.children);
  }

  initFormGroup(others: IDisplayElement[]) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: [''],
      flavorsExtension: ['', [validateConvention(Scope.USER, Type.SEGMENT, Type.IGDOCUMENT, false), validateGeneratedFlavorsUnicity(others), Validators.required]],
      profileIdentifier: this.formBuilder.group({
        entityIdentifier: [''],
        namespaceId: [''],
        universalId: [''],
        universalIdType: [''],
      }),
    });
  }

  getChanges(elementId: string, current: ICompositeProfileMetadata, old: ICompositeProfileMetadata): IChange[] {
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

    if (current.flavorsExtension !== old.flavorsExtension) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.flavorsExtension,
        propertyValue: current.flavorsExtension,
        propertyType: PropertyType.FLAVORSEXTENSION,
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
        return this.compositeProfileService.saveChanges(id, documentRef, this.getChanges(id, current.data, old)).pipe(
          flatMap((message) => {
            /// TODO handle libary case
            return [this.messageService.messageToAction(message), new LoadCompositeProfile(id), new IgEditResolverLoad(documentRef.documentId)];
          }),
          catchError((error) => of(this.messageService.actionFromError(error), new fromDam.EditorSaveFailure())),
        );
      }),
    );
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<any>> {
    return this.compositeProfileService.saveChanges(id, documentRef, changes);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectCompositeProfileById;
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgamtDisplaySelectors.selectCompositeProfileById, { id: elementId });
      }),
    );
  }

  onDeactivate(): void {
  }

  ngOnDestroy() {
    this.s_workspace.unsubscribe();
    this.s_children.unsubscribe();
  }

  getOthers(): Observable<IDisplayElement[]> {
    return this.store.select(fromIgamtDisplaySelectors.selectAllCompositeProfiles).pipe(
      take(1),
      withLatestFrom(this.store.select(selectSelectedResource)),
      map(([exiting, selected]) => {
        return exiting.filter((x) => x.id !== selected.id);
      }),
    );
  }
  ngOnInit() {

  }

}
export interface ICompositeProfileMetadata {
  name: string;
  description: string;
  displayName?: string;
  flavorsExtension: string;
  profileIdentifier: {
    entityIdentifier?: string,
    namespaceId?: string,
    universalId?: string,
    universalIdType?: string,
  };
}
