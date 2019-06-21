import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import * as fromAuth from 'src/app/root-store/authentication/authentication.reducer';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectAllDatatypes, selectAllSegments, selectSegmentsById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Type } from '../../../shared/constants/type.enum';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { HL7v2TreeColumnType } from './../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';

@Component({
  selector: 'app-segment-structure-editor',
  templateUrl: './segment-structure-editor.component.html',
  styleUrls: ['./segment-structure-editor.component.scss'],
})
export class SegmentStructureEditorComponent extends AbstractEditorComponent implements OnInit {

  type = Type;
  segment: ReplaySubject<ISegment>;
  datatypes: Observable<IDisplayElement[]>;
  segments: Observable<IDisplayElement[]>;
  changes: ReplaySubject<IStructureChanges>;
  columns: HL7v2TreeColumnType[];
  username: Observable<string>;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    actions$: Actions,
    store: Store<any>) {
    super({
      id: EditorID.SEGMENT_STRUCTURE,
      title: 'Structure',
      resourceType: Type.SEGMENT,
    }, actions$, store);
    this.columns = [
      HL7v2TreeColumnType.NAME,
      HL7v2TreeColumnType.DATATYPE,
      HL7v2TreeColumnType.USAGE,
      HL7v2TreeColumnType.VALUESET,
      HL7v2TreeColumnType.CARDINALITY,
      HL7v2TreeColumnType.LENGTH,
      HL7v2TreeColumnType.CONFLENGTH,
      HL7v2TreeColumnType.TEXT,
      HL7v2TreeColumnType.COMMENT,
    ];
    this.datatypes = this.store.select(selectAllDatatypes);
    this.segments = this.store.select(selectAllSegments);
    this.username = store.select(fromAuth.selectUsername);
    this.segment = new ReplaySubject<ISegment>();
    this.changes = new ReplaySubject<IStructureChanges>();
    this.currentSynchronized$.pipe(
      map((current) => {
        this.segment.next({ ...current.segment });
        this.changes.next({ ...current.changes });
      }),
    ).subscribe();
  }

  change(change: IChange) {
    combineLatest(this.changes.asObservable(), this.segment.asObservable()).pipe(
      take(1),
      map(([changes, segment]) => {
        changes[change.location] = {
          [change.propertyType]: change,
        };
        this.changes.next(changes);
        this.editorChange({ changes, segment }, true);
      }),
    ).subscribe();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectSegmentsById, { id });
      }),
    );
  }

  ngOnInit() {
  }
}

export interface IStructureChanges {
  [index: string]: {
    [property: string]: IChange;
  };
}