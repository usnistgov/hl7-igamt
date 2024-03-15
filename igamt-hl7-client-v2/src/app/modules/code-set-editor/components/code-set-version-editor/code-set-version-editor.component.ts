import { ICodes } from './../../../shared/models/value-set.interface';
import { EditorChange } from './../../../dam-framework/store/data/dam.actions';
import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { IEditorMetadata } from 'src/app/modules/dam-framework';
import { DamAbstractEditorComponent } from 'src/app/modules/dam-framework/services/dam-editor.component';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { BehaviorSubject, combineLatest, Observable, of, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import * as _ from 'lodash';
import { SelectItem } from 'primeng/primeng';
import { IDocumentRef } from 'src/app/modules/shared/models/abstract-domain.interface';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { ICodeSetInfo, ICodeSetVersionContent } from '../../models/code-set.models';
import { selectCodeSetId, selectCodeSetVersionById } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.selectors';
import { MatDialog } from '@angular/material';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { CodeSetServiceService } from '../../services/CodeSetService.service';
import * as fromDam from '../../../dam-framework/store';
import { CommitCodeSetVersionDialogComponent } from '../commit-code-set-version-dialog/commit-code-set-version-dialog.component';
import { selectViewOnly } from 'src/app/root-store/dam-igamt/igamt.selectors';

@Component({
  selector: 'app-code-set-version-editor',
  templateUrl: './code-set-version-editor.component.html',
  styleUrls: ['./code-set-version-editor.component.css']
})
export class CodeSetVersionEditorComponent extends DamAbstractEditorComponent {


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



  constructor(
    actions$: Actions,
    store: Store<any>,
    private dialog: MatDialog,
    private messageService: MessageService,
    private codeSetService: CodeSetServiceService
    ) {
    super({
      id: EditorID.CODE_SET_VERSION,
      title: "Code Set Version",
    },
      actions$,
      store,
    );
    this.resourceType = Type.CODESETVERSION;

    // this.username = this.store.select(fromAuth.selectUsername);
    this.resourceSubject = new ReplaySubject<ICodeSetVersionContent>(1);


    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next(_.cloneDeep(current));
        this.committed = current.dateCommitted != null
        // this.changes.next({ ...current.changes });
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
    console.log("event");
    console.log(event);

    this.resource$.pipe(
      take(1),
      tap((resource) => {

        this.editorChange({ data: { resource: { ...resource, codes: event } } }, true);
      }),
    ).subscribe();


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

        return combineLatest(this.elementId$, this.codeSetId$, this.resource$).pipe(
          take(1),
          mergeMap(([id, parent, resource]) => {

            return this.codeSetService.saveCodeSetVersion(parent, resource.id, resource).pipe(
              mergeMap((message) => {
                return  this.codeSetService.getCodeSetVersionContent(parent, resource.id).pipe(
                  take(1),
                  flatMap((resource) => {
                    this.resourceSubject.next(resource);
                    return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: { resource }, updateDate: false }), new fromDam.SetValue({ selected: resource })];
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
        map(cs => {
          const actions = this.codeSetService.getUpdateAction(cs);
          return actions;
        })
      );
    }





      saveAndUpdate(parent: string, resource: any) {
        this.codeSetService.commitCodeSetVersion(parent, resource.id, resource).pipe(
          mergeMap((message) =>
            this.codeSetService.getCodeSetVersionContent(parent, resource.id).pipe(
              take(1),
              mergeMap((updatedResource) => {
                console.log("TEST");
                this.resourceSubject.next(updatedResource);
                return this.updateCodeSetState(parent);
              }),
              tap((actions) => {
                console.log("Calling");

                this.dispatchList([...actions,
                  this.messageService.messageToAction(message),
                  new fromDam.EditorUpdate({ value: { resource: resource }, updateDate: false }),
                  new fromDam.SetValue({ selected: resource })
                ])
              }
              ),
            )
          ),
        ).subscribe();
      }
      dispatchList(actions: Action []){
        actions.forEach((action) => {
          this.store.dispatch(action);
        });
      }


      commit() {
        combineLatest([this.elementId$, this.codeSetId$, this.resource$]).pipe(
          take(1),
          tap(([id, parent, resource]) => {
            this.dialog.open(CommitCodeSetVersionDialogComponent, {
              data: {
                title: 'Commit Code Set Version',
                comments: '',
                version: resource.version,
              },
            }).afterClosed().subscribe({
              next: (res) => {
                if (res) {
                  resource.version = res.version;
                  resource.comments = res.comments;
                  this.saveAndUpdate(parent, resource);
                }
              },
            });
          }),
        ).subscribe();
      }

      importCSV($event){

      }

      exportCSV($event){

        this.codeSetService.exportCSV( $event.id);
       
      }


}
