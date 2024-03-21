import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { SelectItem } from 'primeng/primeng';
import { BehaviorSubject, combineLatest, Observable, of, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { IEditorMetadata } from 'src/app/modules/dam-framework';
import { DamAbstractEditorComponent } from 'src/app/modules/dam-framework/services/dam-editor.component';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IDocumentRef } from 'src/app/modules/shared/models/abstract-domain.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { selectCodeSetId, selectCodeSetVersionById } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.selectors';
import * as fromDam from '../../../dam-framework/store';
import { ICodeSetInfo, ICodeSetVersionContent } from '../../models/code-set.models';
import { CodeSetServiceService } from '../../services/CodeSetService.service';
import { EditorChange } from './../../../dam-framework/store/data/dam.actions';
import { ImportCodeCSVComponent } from './../../../shared/components/import-code-csv/import-code-csv.component';
import { ICodes } from './../../../shared/models/value-set.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-code-set-dash-board',
  templateUrl: './code-set-dash-board.component.html',
  styleUrls: ['./code-set-dash-board.component.css'],
})
export class CodeSetDashBoardComponent extends DamAbstractEditorComponent {

  selectedColumns: any[] = [];
  cols: any[] = [];
  codeSystemOptions: any[] = [];
  hasOrigin$: Observable<boolean>;
  enforceChangeReason = true;
  type = Type;
  resourceSubject: ReplaySubject<ICodeSetInfo>;
  username: Observable<string>;
  resource$: Observable<ICodeSetInfo>;
  workspace_s: Subscription;
  resource_s: Subscription;
  codeSetId$: Observable<string>;
  // metaDataForm: FormGroup;
  // wsSubscription: Subscription;
  // changeSubscription: Subscription;

  constructor(
    actions$: Actions,
    store: Store<any>,
    private dialog: MatDialog,
    private messageService: MessageService,
    private codeSetService: CodeSetServiceService,
    ) {
    super({
      id: EditorID.CODE_SET_DASHBOARD,
      title: 'Code Set Dashboard',
    },
      actions$,
      store,
    );
    // this.username = this.store.select(fromAuth.selectUsername);
    this.resourceSubject = new ReplaySubject<ICodeSetInfo>(1);

    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {


        this.resourceSubject.next(_.cloneDeep(current));
        // this.changes.next({ ...current.changes });
      }),
    ).subscribe();
    this.resource$ = this.resourceSubject.asObservable();

    this.codeSetId$ = this.store.select(selectCodeSetId);



    // this.metaDataForm = new FormGroup({
    //   title: new FormControl('', [Validators.required]),
    //   description: new FormControl('', []),
    // });
    // this.wsSubscription = this.currentSynchronized$.pipe(
    //   tap((value) => {
    //     console.log(value);
    //     this.metaDataForm.patchValue(value.metadata, { emitEvent: false });
    //   }),
    // ).subscribe();
    // this.changeSubscription = this.metaDataForm.valueChanges.subscribe((changed) => {
    //   this.editorChange(changed, this.metaDataForm.valid);
    // });
  }


  editorChange(data: any, valid: boolean) {
    this.changeTime = new Date();
    this.store.dispatch(new EditorChange({
      data,
      valid,
      date: this.changeTime,
    }));
  }

  ngOnDestroy(): void {
    if (this.workspace_s) {
      this.workspace_s.unsubscribe();
    }
    if (this.resource_s) {
      this.resource_s.unsubscribe();
    }
  }

  ngOnInit(): void {
  }

  onDeactivate(): void {
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return of(null);
  }

  contentChange(change: IChange) {
    this.change(change);

  }

  updateCodes(event: ICodes[]) {

    // this.resource$.pipe(
    //   take(1),
    //   tap((resource) => {
    //     this.resourceSubject.next({ ...resource});

    //     this.editorChange({ data: { resource: { ...resource, codes: event } } }, true);
    //   }),
   // ).subscribe();

    //               this.resourceSubject.next(resource);

  }
  change(change: IChange) {

    // this.changes.pipe(
    //   take(1),
    //   tap((changes) => {
    //     const updates = { ...changes } || {};
    //     updates[change.propertyType] = change;
    //     this.changes.next(updates);
    //     this.editorChange({ changes: updates }, true);
    //   }),
    // ).subscribe();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(
      this.current$,
      this.elementId$,
    ).pipe(
      take(1),
      flatMap(([current, id]) => {
        return this.codeSetService.saveDashBoard(id, current.data).pipe(
          flatMap((message) => {
            return this.codeSetService.getCodeSetInfo(id).pipe(
              flatMap((codeSetInfo) => {
                return [
                  this.messageService.messageToAction(message),
                  new fromDam.EditorUpdate({ value: codeSetInfo, updateDate: false }),
                  new fromDam.LoadPayloadData(codeSetInfo),
                ];
              }),
            );
          }),
        );
      }),
    );
  }

    updateCodeSetState(id: string): Observable<Action[]> {
      return this.codeSetService.getCodeSetInfo(id).pipe(
        map((cs) => {
          const actions = this.codeSetService.getUpdateAction(cs);
          return actions;
        }),
      );
    }

      dispatchList(actions: Action []) {
        actions.forEach((action) => {
          this.store.dispatch(action);
        });
      }


}
