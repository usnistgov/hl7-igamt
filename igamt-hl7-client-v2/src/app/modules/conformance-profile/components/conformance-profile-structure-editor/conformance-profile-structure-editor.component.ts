import {Component, OnDestroy, OnInit} from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {combineLatest, Observable, ReplaySubject, Subscription, throwError} from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take } from 'rxjs/operators';
import * as fromAuth from 'src/app/root-store/authentication/authentication.reducer';
import { EditorSave, EditorUpdate } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectAllDatatypes, selectAllSegments, selectMessagesById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../core/services/message.service';
import { IStructureChanges } from '../../../segment/components/segment-structure-editor/segment-structure-editor.component';
import { SegmentService } from '../../../segment/services/segment.service';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { ConformanceProfileService } from '../../services/conformance-profile.service';

@Component({
  selector: 'app-conformance-profile-structure-editor',
  templateUrl: './conformance-profile-structure-editor.component.html',
  styleUrls: ['./conformance-profile-structure-editor.component.scss'],
})
export class ConformanceProfileStructureEditorComponent extends AbstractEditorComponent implements OnDestroy, OnInit {

  type = Type;
  conformanceProfile: ReplaySubject<IConformanceProfile>;
  datatypes: Observable<IDisplayElement[]>;
  segments: Observable<IDisplayElement[]>;
  changes: ReplaySubject<IStructureChanges>;
  columns: HL7v2TreeColumnType[];
  username: Observable<string>;
  workspace_s: Subscription;
  conformanceProfile$: Observable<IConformanceProfile>;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private conformanceProfileService: ConformanceProfileService,
    private messageService: MessageService,
    actions$: Actions,
    store: Store<any>) {
    super({
      id: EditorID.CONFP_STRUCTURE,
      title: 'Structure',
      resourceType: Type.CONFORMANCEPROFILE,
    }, actions$, store);
    this.columns = [
      HL7v2TreeColumnType.NAME,
      HL7v2TreeColumnType.SEGMENT,
      HL7v2TreeColumnType.DATATYPE,
      HL7v2TreeColumnType.USAGE,
      HL7v2TreeColumnType.VALUESET,
      HL7v2TreeColumnType.CONSTANTVALUE,
      HL7v2TreeColumnType.CARDINALITY,
      HL7v2TreeColumnType.LENGTH,
      HL7v2TreeColumnType.CONFLENGTH,
      HL7v2TreeColumnType.TEXT,
      HL7v2TreeColumnType.COMMENT,
    ];
    this.datatypes = this.store.select(selectAllDatatypes);
    this.segments = this.store.select(selectAllSegments);
    this.username = store.select(fromAuth.selectUsername);
    this.conformanceProfile = new ReplaySubject<IConformanceProfile>(1);
    this.changes = new ReplaySubject<IStructureChanges>(1);
    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.conformanceProfile.next({ ...current.conformanceProfile });
        this.changes.next({ ...current.changes });
      }),
    ).subscribe();
    this.conformanceProfile$ = this.conformanceProfile.asObservable();
  }

  ngOnDestroy(): void {
    this.workspace_s.unsubscribe();
  }

  change(change: IChange) {
    combineLatest(this.changes.asObservable(), this.conformanceProfile.asObservable()).pipe(
      take(1),
      map(([changes, conformanceProfile]) => {
        changes[change.location] = {
          ...changes[change.location],
          [change.propertyType]: change,
        };
        this.changes.next(changes);
        console.log(changes);
        this.editorChange({ changes, conformanceProfile }, true);
      }),
    ).subscribe();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.ig$.pipe(map((ig) => ig.id)), this.changes).pipe(
      take(1),
      concatMap(([id, igId, changes]) => {
        return this.conformanceProfileService.saveChanges(id, igId, this.convert(changes)).pipe(
          mergeMap((message) => {
            return this.conformanceProfileService.getById(id).pipe(
              flatMap((conformanceProfile) => [this.messageService.messageToAction(message), new EditorUpdate({ value: { changes: {}, conformanceProfile }, updateDate: false })]),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
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

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectMessagesById, { id });
      }),
    );
  }

  ngOnInit() {
  }

}