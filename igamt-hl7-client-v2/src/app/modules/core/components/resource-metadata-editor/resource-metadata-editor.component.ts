import { OnInit } from '@angular/core';
import {FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import {catchError, concatMap, flatMap, map, mergeMap, take, withLatestFrom} from 'rxjs/operators';
import { EditorSave, EditorSaveFailure, IgEditResolverLoad } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import {selectIgId, selectSelectedResource} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { FieldType, IMetadataFormInput } from '../../../shared/components/metadata-form/metadata-form.component';
import {validateConvention} from '../../../shared/functions/convention-factory';
import {validateUnity} from '../../../shared/functions/unicity-factory';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IEditorMetadata } from '../../../shared/models/editor.enum';
import { ChangeType, IChange, PropertyType } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
import { Message } from '../../models/message/message.class';
import { MessageService } from '../../services/message.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export abstract class ResourceMetadataEditorComponent extends AbstractEditorComponent implements OnInit {

  metadataFormInput$: Observable<IMetadataFormInput<IResourceMetadata>>;
  froalaConfig$: Observable<any>;
  constructor(
    readonly editor: IEditorMetadata,
    protected actions$: Actions,
    private messageService: MessageService,
    protected store: Store<any>, protected froalaService: FroalaService) {
    super(editor, actions$, store);
    this.froalaConfig$ = froalaService.getConfig();
    const authorNotes = 'Author Notes';
    const usageNotes = 'Usage Notes';
    const selectedResource$ = this.store.select(selectSelectedResource);
    const name$ = this.store.select(selectSelectedResource).pipe(
      map((resource) => {
        return resource.name;
      }),
    );

    this.metadataFormInput$ = combineLatest(selectedResource$, name$, this.getOthers()).pipe(
      take(1),
      map(([ selectedResource, name, existing]) => {
       return {
          viewOnly: this.viewOnly$,
          data: this.currentSynchronized$,
          model: {
            name: {
              label: 'Name',
              placeholder: 'Name',
              validators: [],
              type: FieldType.TEXT,
              id: 'name',
              disabled: true,
              name: 'name',
            },
            ext: {
              label: 'Extension',
              placeholder: 'Extension',
              validators: [validateUnity(existing, name, selectedResource.domainInfo), validateConvention(selectedResource.domainInfo.scope, selectedResource.type)],
              type: FieldType.TEXT,
              id: 'extension',
              name: 'extension',
            },
            description: {
              label: 'Description',
              placeholder: 'Description',
              validators: [],
              type: FieldType.TEXT,
              id: 'description',
              disabled: true,
              name: 'Description',
            },
            authorNotes: {
              label: authorNotes,
              placeholder: authorNotes,
              validators: [],
              enum: [],
              type: FieldType.RICH,
              id: 'authornotes',
              name: authorNotes,
            },
            usageNotes: {
              label: usageNotes,
              placeholder: usageNotes,
              validators: [],
              enum: [],
              type: FieldType.RICH,
              id: 'usagenotes',
              name: usageNotes,
            },
          },
        };
    }),
    );
  }

  abstract getExistingList(): Observable<IDisplayElement[]>;
  getOthers(): Observable<IDisplayElement[]> {
    return this.getExistingList().pipe(
      take(1),
      withLatestFrom(this.store.select(selectSelectedResource)),
      map(([exiting, selected ]) => {
        return exiting.filter((x) => x.id !== selected.id) ;
      } ),
    );
  }

  dataChange(form: FormGroup) {
    this.editorChange(form.getRawValue(), form.valid);
  }

  getChanges(elementId: string, current: IResourceMetadata, old: IResourceMetadata): IChange[] {
    const changes: IChange[] = [];
    if (current.ext !== old.ext) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.ext,
        propertyValue: current.ext,
        propertyType: PropertyType.EXT,
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

    if (current.bindingIdentifier !== old.bindingIdentifier) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.bindingIdentifier,
        propertyValue: current.bindingIdentifier,
        propertyType: PropertyType.BINDINGIDENTIFIER,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    if (current.authorNotes !== old.authorNotes) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.authorNotes,
        propertyValue: current.authorNotes,
        propertyType: PropertyType.AUTHORNOTES,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    if (current.usageNotes !== old.usageNotes) {
      changes.push({
        location: elementId,
        oldPropertyValue: old.usageNotes,
        propertyValue: current.usageNotes,
        propertyType: PropertyType.USAGENOTES,
        position: -1,
        changeType: ChangeType.UPDATE,
      });
    }

    return changes;
  }

  abstract reloadResource(resourceId: string): Action;

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.initial$, this.current$, this.store.select(selectIgId)).pipe(
      take(1),
      concatMap(([id, old, current, igId]) => {
        return this.save(this.getChanges(id, current.data, old)).pipe(
          flatMap((message) => [this.messageService.messageToAction(message), this.reloadResource(id), new IgEditResolverLoad(igId)]),
          catchError((error) => of(this.messageService.actionFromError(error), new EditorSaveFailure())),
        );
      }),
    );
  }

  abstract save(changes: IChange[]): Observable<Message>;
  abstract editorDisplayNode(): Observable<IDisplayElement>;

  ngOnInit() {
  }

  onDeactivate() {

  }

}

export interface IResourceMetadata {
  name: string;
  ext?: string;
  bindingIdentifier?: string;
  description?: string;
  authorNotes?: string;
  usageNotes?: string;
}
