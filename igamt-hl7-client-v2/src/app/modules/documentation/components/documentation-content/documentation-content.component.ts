import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Actions, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {selectIsAdmin} from '../../../../root-store/authentication/authentication.reducer';
import {UpdateActiveResource} from '../../../../root-store/document/document-edit/ig-edit.actions';
import {
  DocumentationEditorChange,
} from '../../../../root-store/documentation/documentation.actions';
import {selectEditMode} from '../../../../root-store/documentation/documentation.reducer';
import * as fromDocumentation from '../../../../root-store/documentation/documentation.reducer';
import {MessageService} from '../../../core/services/message.service';
import {IWorkspaceCurrent} from '../../../shared/models/editor.class';
import {
  IDocumentation,
  IDocumentationWorkspaceActive,
  IDocumentationWorkspaceCurrent,
} from '../../models/documentation.interface';
import {DocumentationService} from '../../service/documentation.service';

@Component({
  selector: 'app-documentation-content',
  templateUrl: './documentation-content.component.html',
  styleUrls: ['./documentation-content.component.css'],
})
export class DocumentationContentComponent implements  OnInit {

  changeTime: Date;
  readonly active$: Observable<IDocumentationWorkspaceActive>;
  readonly elementId$: Observable<string>;
  readonly current$: Observable<IDocumentationWorkspaceCurrent>;
  readonly currentSynchronized$: Observable<any>;
  readonly initial$: Observable<any>;
  readonly viewOnly$: Observable<boolean>;
  readonly admin$: Observable<boolean>;
  constructor(
    private actions$: Actions,
    private documentationService: DocumentationService,
    private messageService: MessageService,
    private store: Store<any>) {
    this.changeTime = new Date();
    this.active$ = this.store.select(fromDocumentation.selectWorkspaceActive);
    this.viewOnly$ = combineLatest(this.store.select(selectIsAdmin), this.store.select(selectEditMode)).
    pipe(
      map(([admin, editMode]) => {
        return !admin || !editMode;
      }));
    this.viewOnly$.subscribe();
    this.initial$ = this.store.select(fromDocumentation.selectWorkspace).pipe(
      map((ws) => ws.initial),
    );
    this.elementId$ = this.active$.pipe(
      map((active) => {
        return active.display.id;
      }),
      distinctUntilChanged(),
    );
    this.current$ = this.store.select<IWorkspaceCurrent>(fromDocumentation.selectWorkspaceCurrent);
    this.currentSynchronized$ = this.current$.pipe(
      filter((current) => {
        return !current || !current.time || (current.time.getTime() !== this.changeTime.getTime());
      }),
      tap((current) => this.changeTime = current.time),
      map((current) => current.data),
    );
  }

  dataChange(form: FormGroup) {
    this.editorChange(form.getRawValue(), form.valid);
  }
  onDeactivate() {
    return of(true);
  }
  ngOnInit(): void {
  }
  editorChange(data: any, valid: boolean) {
    this.changeTime = new Date();
    this.store.dispatch(new DocumentationEditorChange({
      data,
      valid,
      date: this.changeTime,
    }));
  }

}
