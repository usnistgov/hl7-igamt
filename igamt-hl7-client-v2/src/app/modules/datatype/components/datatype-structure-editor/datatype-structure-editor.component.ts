import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, take, tap } from 'rxjs/operators';
import * as fromAuth from 'src/app/root-store/authentication/authentication.reducer';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectAllDatatypes, selectAllSegments, selectDatatypesById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../core/services/message.service';
import { IStructureChanges } from '../../../segment/components/segment-structure-editor/segment-structure-editor.component';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDatatype } from '../../../shared/models/datatype.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { DatatypeService } from '../../services/datatype.service';

@Component({
  selector: 'app-datatype-structure-editor',
  templateUrl: './datatype-structure-editor.component.html',
  styleUrls: ['./datatype-structure-editor.component.scss'],
})
export class DatatypeStructureEditorComponent extends AbstractEditorComponent implements OnInit {

  type = Type;
  datatype: ReplaySubject<IDatatype>;
  datatypes: Observable<IDisplayElement[]>;
  segments: Observable<IDisplayElement[]>;
  changes: ReplaySubject<IStructureChanges>;
  columns: HL7v2TreeColumnType[];
  username: Observable<string>;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    private datatypeService: DatatypeService,
    actions$: Actions,
    store: Store<any>) {
    super({
      id: EditorID.DATATYPE_STRUCTURE,
      title: 'Structure',
      resourceType: Type.DATATYPE,
    }, actions$, store);
    this.columns = [
      HL7v2TreeColumnType.NAME,
      HL7v2TreeColumnType.DATATYPE,
      HL7v2TreeColumnType.USAGE,
      HL7v2TreeColumnType.VALUESET,
      HL7v2TreeColumnType.CONSTANTVALUE,
      HL7v2TreeColumnType.LENGTH,
      HL7v2TreeColumnType.CONFLENGTH,
      HL7v2TreeColumnType.TEXT,
      HL7v2TreeColumnType.COMMENT,
    ];
    this.datatypes = this.store.select(selectAllDatatypes);
    this.segments = this.store.select(selectAllSegments);
    this.username = store.select(fromAuth.selectUsername);
    this.datatype = new ReplaySubject<IDatatype>();
    this.changes = new ReplaySubject<IStructureChanges>();
    this.currentSynchronized$.pipe(
      map((current) => {
        this.datatype.next({ ...current.datatype });
        this.changes.next({ ...current.changes });
      }),
    ).subscribe();
  }

  change(change: IChange) {
    combineLatest(this.changes.asObservable(), this.datatype.asObservable()).pipe(
      take(1),
      map(([changes, segment]) => {
        changes[change.location] = {
          ...changes[change.location],
          [change.propertyType]: change,
        };
        this.changes.next(changes);
        this.editorChange({ changes, segment }, true);
      }),
    ).subscribe();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.ig$.pipe(map((ig) => ig.id)), this.changes).pipe(
      take(1),
      concatMap(([id, igId, changes]) => {
        return this.datatypeService.saveChanges(id, igId, this.convert(changes)).pipe(
          flatMap((message) => [this.messageService.messageToAction(message)]),
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
        return this.store.select(selectDatatypesById, { id });
      }),
    );
  }

  ngOnInit() {
  }

}
