import { ICodes } from './../../../shared/models/value-set.interface';
import { EditorChange } from './../../../dam-framework/store/data/dam.actions';
import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import {  Observable, ReplaySubject, Subscription, of, throwError } from 'rxjs';
import { IEditorMetadata } from 'src/app/modules/dam-framework';
import { DamAbstractEditorComponent } from 'src/app/modules/dam-framework/services/dam-editor.component';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { SelectItem } from 'primeng/primeng';
import { IDocumentRef } from 'src/app/modules/shared/models/abstract-domain.interface';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { ICodeSetVersionContent } from '../../models/code-set.models';

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
  derived$: Observable<boolean>;
  constructor(
    actions$: Actions,
    store: Store<any>) {
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
    // return this.elementId$.pipe(
    //   concatMap((id) => {
    //     return this.store.select(this.elementSelector(), { id });
    //   }),
    // );
    return of(null);
  }

  contentChange(change: IChange) {
    this.change(change);

  }

  updateCodes(event: ICodes[]){
    console.log("event");
    console.log(event);

     this.resource$.pipe(
      take(1),
      tap((resource) => {

        this.editorChange({ data: {resource: {... resource, codes: event }} }, true);
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
    console.log("action");
  //   return combineLatest(this.elementId$, this.documentRef$, this.changes.asObservable()).pipe(
  //     take(1),
  //     mergeMap(([id, documentRef, changes]) => {
  //       return this.saveChanges(id, documentRef, Object.values(changes)).pipe(
  //         mergeMap((message) => {
  //           return this.getById(id).pipe(
  //             take(1),
  //             flatMap((resource) => {
  //               this.changes.next({});
  //               this.resourceSubject.next(resource);
  //               return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: { changes: {}, resource }, updateDate: false }), new fromDam.SetValue({ selected: resource })];
  //             }),
  //           );
  //         }),
  //         catchError((error) => throwError(this.messageService.actionFromError(error))),
  //       );
  //     }),
  //   );
  // }
  return of(null);

}

}
