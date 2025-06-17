import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { SelectItem } from 'primeng/primeng';
import { combineLatest, Observable, of, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, flatMap, map, mergeMap, take, tap } from 'rxjs/operators';
import { DamAbstractEditorComponent } from 'src/app/modules/dam-framework/services/dam-editor.component';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { selectUsername } from 'src/app/modules/dam-framework/store/authentication';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { selectAllCodeSetVersions, selectCodeSetId, selectCodeSetVersions } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.selectors';
import * as fromDam from '../../../dam-framework/store';
import { ICodeSetCommit, ICodeSetVersionContent, ICodeSetVersionInfo } from '../../models/code-set.models';
import { CodeSetServiceService } from '../../services/CodeSetService.service';
import { CommitCodeSetVersionDialogComponent } from '../commit-code-set-version-dialog/commit-code-set-version-dialog.component';
import { EditorChange } from './../../../dam-framework/store/data/dam.actions';
import { ImportCodeCSVComponent } from './../../../shared/components/import-code-csv/import-code-csv.component';
import { ICodes } from './../../../shared/models/value-set.interface';
import { NgForm } from '@angular/forms';
import { CodeSetTableComponent } from '../code-set-table/code-set-table.component';

@Component({
  selector: 'app-code-set-version-editor',
  templateUrl: './code-set-version-editor.component.html',
  styleUrls: ['./code-set-version-editor.component.css'],
})
export class CodeSetVersionEditorComponent extends DamAbstractEditorComponent implements OnDestroy, OnInit {

  selectedColumns: any[] = [];
  cols: any[] = [];
  codeSystemOptions: any[] = [];
  hasOrigin$: Observable<boolean>;
  enforceChangeReason = true;
  type = Type;
  resourceSubject: ReplaySubject<ICodeSetVersionContent>;
  username: Observable<string>;
  resource$: Observable<ICodeSetVersionContent>;
  workspace_s: Subscription;
  resource_s: Subscription;
  resourceType: Type;
  committed: boolean;
  codeSetId$: Observable<string>;
  versionURL: string;
  hasChanges: Observable<boolean>;
  codeSetVersions$: Observable<ICodeSetVersionInfo[]>;

  @ViewChild('CodeSetTableComponent') child!: CodeSetTableComponent;


  constructor(
    actions$: Actions,
    store: Store<any>,
    private dialog: MatDialog,
    private messageService: MessageService,
    private codeSetService: CodeSetServiceService,
  ) {
    super({
      id: EditorID.CODE_SET_VERSION,
      title: 'Code Set Version',
    },
      actions$,
      store,
    );
    this.resourceType = Type.CODESETVERSION;

    this.username = this.store.select(selectUsername);
    this.resourceSubject = new ReplaySubject<ICodeSetVersionContent>(1);

    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next(_.cloneDeep(current));
        this.committed = current.dateCommitted !== null;
        const host = window.location.protocol + '//' + window.location.host;
        this.versionURL = host + '/codesets/' + current.parentId + '?version=' + current.version;
      }),
    ).subscribe();
    this.resource$ = this.resourceSubject.asObservable();

    this.resource_s = this.resource$.subscribe((resource: ICodeSetVersionContent) => {
      this.cols = [];
      this.cols.push({ field: 'value', header: 'Value' });
      this.cols.push({ field: 'pattern', header: 'Pattern' });
      this.cols.push({ field: 'description', header: 'Description' });
      this.cols.push({ field: 'codeSystem', header: 'Code System' });
      this.cols.push({ field: 'usage', header: 'Usage' });
      this.cols.push({ field: 'comments', header: 'Comments' });
      this.selectedColumns = this.cols;
      this.codeSystemOptions = this.getCodeSystemOptions(resource);
    });

    this.codeSetId$ = this.store.select(selectCodeSetId);
    this.hasChanges = this.store.select(fromDam.selectWorkspaceCurrentIsChanged);
    this.codeSetVersions$ = this.store.select(selectAllCodeSetVersions);
  }

  setVersionURL(codeSetId: string, version: string) {
    const host = window.location.protocol + '//' + window.location.host;
    this.versionURL = host + '/codesets/' + codeSetId + '?version=' + version;
  }

  getCodeSystemOptions(resource: ICodeSetVersionContent): SelectItem[] {
    if (resource.codeSystems && resource.codeSystems.length > 0) {
      return resource.codeSystems.map((codeSystem: string) => {
        return { label: codeSystem, value: codeSystem };
      });
    } else {
      return [];
    }
  }

  editorChange(data: any, valid: boolean) {
    valid = this.child.isValid();
    this.changeTime = new Date();
    this.store.dispatch(new EditorChange({
      data,
      valid: valid,
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

  updateCodes(event: { codes: ICodes[], valid?: boolean }) {
    this.resource$.pipe(
      take(1),
      tap((resource) => {
        this.resourceSubject.next({ ...resource, codes: event.codes });

        this.editorChange({ data: { resource: { ...resource, codes: event.codes } } }, this.child.isValid());
      }),
    ).subscribe();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.codeSetId$, this.resource$).pipe(
      take(1),
      mergeMap(([id, parent, resource]) => {
        return this.codeSetService.saveCodeSetVersion(parent, resource.id, resource.codes).pipe(
          mergeMap((message) => {
            return this.codeSetService.getCodeSetVersionContent(parent, resource.id).pipe(
              take(1),
              flatMap((res) => {
                this.resourceSubject.next(resource);
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: { res }, updateDate: false }), new fromDam.SetValue({ selected: res })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  updateCodeSetState(id: string): Observable<Action[]> {
    return this.codeSetService.getCodeSetInfo(id).pipe(
      map((cs) => {
        return this.codeSetService.getUpdateAction(cs);
      }),
    );
  }

  saveAndUpdate(parent: string, id: string, commit: ICodeSetCommit) {
    return this.codeSetService.commitCodeSetVersion(parent, id, commit).pipe(
      mergeMap((message) => {
        return this.codeSetService.getCodeSetVersionContent(parent, id).pipe(
          take(1),
          mergeMap((updatedResource) => {
            this.resourceSubject.next(updatedResource);
            return this.updateCodeSetState(parent).pipe(
              tap((actions) => {
                this.setVersionURL(parent, updatedResource.version);
                return this.dispatchList([
                  ...actions,
                  this.messageService.messageToAction(message),
                  new fromDam.EditorUpdate({ value: { updatedResource }, updateDate: false }),
                  new fromDam.SetValue({ selected: updatedResource }),
                ]);
              }),
            );
          }),
        );
      }),
      catchError((message) => {
        this.dispatchList([this.messageService.actionFromError(message)]);
        return of();
      }),
    );
  }

  dispatchList(actions: Action[]) {
    actions.forEach((action) => {
      this.store.dispatch(action);
    });
  }

  commit() {
    combineLatest(this.codeSetId$, this.resource$, this.codeSetVersions$).pipe(
      take(1),
      flatMap(([parent, resource, versions]) => {
        return this.dialog.open(CommitCodeSetVersionDialogComponent, {
          height: '80vh',
          width: '70vw',
          data: {
            title: 'Commit Code Set Version',
            comments: '',
            version: resource.version,
            versionId: resource.id,
            codeSetId: parent,
            versions,
          },
        }).afterClosed().pipe(
          flatMap((res) => {
            if (res) {
              return this.saveAndUpdate(parent, resource.id, {
                version: res.version,
                comments: res.comments,
                markAsLatestStable: res.latest,
              });
            }
            return of();
          }),
        );
      }),
    ).subscribe();
  }

  importCSV($event) {
    this.dialog.open(ImportCodeCSVComponent).afterClosed().subscribe((codes: ICodes[]) => {
      if (codes) {
        this.resource$.pipe(
          take(1),
          tap((resource) => {
            this.resourceSubject.next({ ...resource, codes });
          })
        ).subscribe();
      }
    });
  }

  exportCSV($event) {
    this.codeSetService.exportCSV($event.id);
  }

  isValid() {
    return true;
  }

}
