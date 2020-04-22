import { Component, forwardRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { selectIsAdmin } from '../../../../root-store/authentication/authentication.reducer';
import {
  ToggleEditMode,
} from '../../../../root-store/documentation/documentation.actions';
import {
  selectDocumentationByType,
  selectEditMode,
} from '../../../../root-store/documentation/documentation.reducer';
import { isUser, selectActiveTitleBar, selectLatestUpdate } from '../../../../root-store/documentation/documentation.reducer';
import { DamWidgetComponent } from '../../../dam-framework/components/dam-widget/dam-widget.component';
import { DocumentationType, IDocumentation } from '../../models/documentation.interface';

@Component({
  selector: 'app-documentation-contrainer',
  templateUrl: './documentation-contrainer.component.html',
  styleUrls: ['./documentation-container.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => DocumentationContainerComponent) },
  ],
})
export class DocumentationContainerComponent extends DamWidgetComponent implements OnInit {

  viewOnly$: Observable<boolean>;

  admin$: Observable<boolean>;
  editMode$: Observable<boolean>;
  activeTitleBar$: Observable<{ title: string, subtitle: string }>;
  userGuides$: Observable<IDocumentation[]>;
  faqs$: Observable<IDocumentation[]>;
  decisions$: Observable<IDocumentation[]>;
  releaseNotes$: Observable<IDocumentation[]>;
  userNotes$: Observable<IDocumentation[]>;
  glossary$: Observable<IDocumentation[]>;
  isUser$: Observable<boolean>;
  updateInfo$: Observable<any>;
  hasActive$: Observable<boolean>;

  constructor(store: Store<any>, dialog: MatDialog) {
    super(store, dialog);
    this.admin$ = this.store.select(selectIsAdmin);
    this.isUser$ = this.store.select(isUser);
    this.activeTitleBar$ = this.store.select(selectActiveTitleBar);
    this.updateInfo$ = this.store.select(selectLatestUpdate);
    this.editMode$ = this.store.select(selectEditMode);
    this.hasActive$ = this.store.select(fromDAM.selectWorkspaceHasActive);
    this.userGuides$ = this.store.select(selectDocumentationByType, { type: DocumentationType.USERGUIDE });
    this.faqs$ = this.store.select(selectDocumentationByType, { type: DocumentationType.FAQ });
    this.decisions$ = this.store.select(selectDocumentationByType, { type: DocumentationType.IMPLEMENTATIONDECISION });
    this.releaseNotes$ = this.store.select(selectDocumentationByType, { type: DocumentationType.RELEASENOTE });
    this.userNotes$ = this.store.select(selectDocumentationByType, { type: DocumentationType.USERNOTES });
    this.glossary$ = this.store.select(selectDocumentationByType, { type: DocumentationType.GLOSSARY });
  }

  ngOnInit() {
  }

  edit(toggle: boolean) {
    this.store.dispatch(new ToggleEditMode(toggle));
  }
}
