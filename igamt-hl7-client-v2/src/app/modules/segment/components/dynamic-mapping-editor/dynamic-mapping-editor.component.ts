import {Component, OnInit} from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {combineLatest, ReplaySubject, Subscription, throwError} from 'rxjs';
import { Observable, of } from 'rxjs';
import {catchError, concatMap, flatMap, map, mergeMap, take, tap} from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/data/dam.actions';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import {getHl7ConfigState, selectBindingConfig} from '../../../../root-store/config/config.reducer';
import * as fromIgamtSelectedSelectors from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import {IgEditTocAddResource} from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import {selectDerived, selectValueSetsNodes} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {Message} from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import * as fromDam from '../../../dam-framework/store';
import * as fromAuth from '../../../dam-framework/store/authentication';
import { Type } from '../../../shared/constants/type.enum';
import {IDocumentRef} from '../../../shared/models/abstract-domain.interface';
import { IStructureElementBinding } from '../../../shared/models/binding.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import {ChangeType, IChange} from '../../../shared/models/save-change';
import {IDynamicMappingInfo, ISegment} from '../../../shared/models/segment.interface';
import { IValueSet } from '../../../shared/models/value-set.interface';
import { ValueSetService } from '../../../value-set/service/value-set.service';
import {SegmentService} from '../../services/segment.service';
import {IStructureChanges} from '../segment-structure-editor/segment-structure-editor.component';

@Component({
  selector: 'app-dynamic-mapping-editor',
  templateUrl: './dynamic-mapping-editor.component.html',
  styleUrls: ['./dynamic-mapping-editor.component.css'],
})
export class DynamicMappingEditorComponent extends AbstractEditorComponent implements OnInit {
  mappingInfo$: Observable<{ display: IDisplayElement, values: string[] }>;
  datatypes$: Observable<IDisplayElement[]>;
  resourceSubject: ReplaySubject<any>;

  changes: ReplaySubject<IStructureChanges>;
  username: Observable<string>;
  resource$: Observable<any>;
  workspace_s: Subscription;
  hasOrigin$: Observable<boolean>;
  resourceType: Type;
  derived$: Observable<boolean>;

  constructor(
    store: Store<any>,
    actions$: Actions,
    private segmentService: SegmentService,
    private valueSetService: ValueSetService,
    private messageService: MessageService) {
    super(
      {
        id: EditorID.DYNAMIC_MAPPING,
        resourceType: Type.SEGMENT,
        title: 'Dynamic mapping',
      },
      actions$,
      store,
    );
    this.hasOrigin$ = this.store.select(fromIgamtSelectedSelectors.selectedResourceHasOrigin);
    this.username = this.store.select(fromAuth.selectUsername);
    this.resourceSubject = new ReplaySubject<any>(1);
    this.changes = new ReplaySubject<IStructureChanges>(1);
    this.derived$ = combineLatest(this.store.select(selectDerived), this.hasOrigin$).pipe(
      map(([derivedIg, elmHadOrigin]) => {
        return derivedIg && elmHadOrigin;
      }),
    );
    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next({...current.resource});
        this.changes.next({...current.changes});
      }),
    ).subscribe();

    this.resource$ = this.resourceSubject.asObservable();
    this.datatypes$ = this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes);
  }

  ngOnInit() {
    this.mappingInfo$ = combineLatest(this.resource$, this.documentRef$).pipe(
      mergeMap(([segment, documentRef]) => {
        return this.segmentService.getObx2DynamicMappingInfo(segment, documentRef);
      }));
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return undefined;
  }

  onDeactivate(): void {
  }

  onChange(data: IChange) {
    combineLatest(this.changes.asObservable(), this.resource$).pipe(
      take(1),
      map(([changes, resource]) => {
        changes[data.location] = {DYNAMICMAPPINGITEM: data};
        this.changes.next(changes);
        this.editorChange({changes, resource}, true);
      }),
    ).subscribe();
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$, this.changes.asObservable()).pipe(
      take(1),
      concatMap(([id, documentRef, changes]) => {
        return this.saveChanges(id, documentRef, this.convert(changes)).pipe(
          mergeMap((message) => {
            return this.getById(id).pipe(
              flatMap((resource) => {
                this.changes.next({});
                this.resourceSubject.next(resource);
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({
                  value: {
                    changes: {},
                    resource
                  }, updateDate: false
                }), new fromDam.SetValue({selected: resource})];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  getById(id: string): Observable<ISegment> {
    return this.segmentService.getById(id);
  }

  convert(changes: IStructureChanges): IChange[] {
    let c = [];
    Object.keys(changes).forEach((id) => {
      c = c.concat(Object.keys(changes[id]).map((prop) => {
        return changes[id][prop];
      }));
    });
    return c;
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<any>> {
    return this.segmentService.saveChanges(id, documentRef, changes);
  }

  addMissing($event: IDisplayElement) {
    this.documentRef$.pipe(
      take(1),
      map((documentRef) => {
        this.store.dispatch(new IgEditTocAddResource({
          documentId: documentRef.documentId,
          selected: [{
            originalId: $event.id,
            flavor: false,
            name: $event.fixedName,
            id: $event.id,
            type: Type.DATATYPE,
          }],
          type: Type.DATATYPE,
        }));
      })).subscribe();
  }
}
