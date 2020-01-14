import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, Observable, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, distinctUntilChanged, filter, flatMap, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { ICoConstraintGroup } from 'src/app/modules/shared/models/co-constraint.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { EditorSave, EditorUpdate, IgEditResolverLoad } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectAllDatatypes, selectCoConstraintGroupsById, selectIgId, selectValueSetsNodes } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../core/services/message.service';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { CoConstraintGroupService } from '../../services/co-constraint-group.service';

@Component({
  selector: 'app-co-constraint-group-editor',
  templateUrl: './co-constraint-group-editor.component.html',
  styleUrls: ['./co-constraint-group-editor.component.scss'],
})
export class CoConstraintGroupEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  segment$: Observable<ISegment>;
  group$: Observable<ICoConstraintGroup>;
  segmentSubject: ReplaySubject<ISegment>;
  groupSubject: ReplaySubject<ICoConstraintGroup>;
  nameSubject: ReplaySubject<ICoConstraintGroup>;
  public datatypes: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;
  public igId: Observable<string>;
  public s_workspace: Subscription;

  constructor(
    protected actions: Actions,
    protected store: Store<any>,
    public repository: StoreResourceRepositoryService,
    protected ccService: CoConstraintGroupService,
    protected messageService: MessageService,
  ) {
    super({
      id: EditorID.CC_GROUP,
      title: 'Co-Constraint Group',
    }, actions, store);

    this.segmentSubject = new ReplaySubject<ISegment>(1);
    this.groupSubject = new ReplaySubject<ICoConstraintGroup>(1);
    this.segment$ = this.segmentSubject.asObservable();
    this.group$ = this.groupSubject.asObservable();

    this.datatypes = this.store.select(selectAllDatatypes);
    this.valueSets = this.store.select(selectValueSetsNodes);
    this.igId = this.store.select(selectIgId);

    this.s_workspace = this.currentSynchronized$.pipe(
      tap((current) => {
        this.groupSubject.next(_.cloneDeep(current.ccGroup));
        this.segmentSubject.next(current.segment);
      }),
    ).subscribe();
  }

  change($event) {
    this.editorChange($event, true);
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.igId, this.elementId$, this.current$, this.segment$).pipe(
      take(1),
      concatMap(([igId, id, current, segment]) => {
        return this.ccService.save(current.data).pipe(
          mergeMap((message) => {
            return this.ccService.getById(id).pipe(
              flatMap((resource) => {
                return [this.messageService.messageToAction(message), new EditorUpdate({ value: { ccGroup: resource, segment }, updateDate: true }), new IgEditResolverLoad(igId)];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((id) => {
        return this.store.select(selectCoConstraintGroupsById, { id });
      }),
    );
  }

  onDeactivate() {
  }

  ngOnDestroy() {
    this.s_workspace.unsubscribe();
  }

  ngOnInit() {
  }

}