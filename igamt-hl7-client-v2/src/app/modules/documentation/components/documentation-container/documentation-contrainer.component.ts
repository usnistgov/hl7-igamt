import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {selectIsAdmin, selectIsLoggedIn} from '../../../../root-store/authentication/authentication.reducer';
import {
  DocumentationEditorReset,
  DocumentationToolBarSave, ToggleEditMode,
} from '../../../../root-store/documentation/documentation.actions';
import {
  isUser,
  selectDocumentationByType,
  selectEditMode, selectEditorTitle, selectLatestUpdate, selectSubTitle, selectWorkspaceActive,
  selectWorkspaceCurrentIsChanged,
  selectWorkspaceCurrentIsValid,
} from '../../../../root-store/documentation/documentation.reducer';
import {ConfirmDialogComponent} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {DocumentationType, IDocumentation, IDocumentationWorkspaceActive} from '../../models/documentation.interface';
import {DocumentationService} from '../../service/documentation.service';

@Component({
  selector: 'app-documentation-contrainer',
  templateUrl: './documentation-contrainer.component.html',
  styleUrls: ['./documentation-container.component.scss'],
})
export class DocumentationContainerComponent implements OnInit {

  viewOnly$: Observable<boolean>;
  collapsed: boolean;
  @ViewChild('resize', { read: ElementRef })
  resize: ElementRef;
  dragging: boolean;
  positionX: string;
  admin$: Observable<boolean>;
  editMode$: Observable<boolean>;
  valid: Observable<boolean>;
  changed: Observable<boolean>;
  subscription: Subscription;
  form: FormGroup;
  userGuides$: Observable<IDocumentation[]>;
  faqs$: Observable<IDocumentation[]>;
  decisions$: Observable<IDocumentation[]>;
  releaseNotes$: Observable<IDocumentation[]>;
  userNotes$: Observable<IDocumentation[]>;
  glossary$: Observable<IDocumentation[]>;
  title$: Observable<string>;
  subTitle$: Observable<string>;
  changeTime$: any;
  updateInfo$: any;
  active$: Observable<IDocumentationWorkspaceActive>;
  isUser$: Observable<boolean>;
  isAuthenticated$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private documentationService: DocumentationService, private store: Store<any>, private dialog: MatDialog) {
    this.admin$ = this.store.select(selectIsAdmin);
    this.isAuthenticated$ = this.store.select(selectIsLoggedIn);
    this.isUser$ = this.store.select(isUser);
    this.editMode$ = this.store.select(selectEditMode);
    this.title$ = this.store.select(selectEditorTitle);
    this.subTitle$ = this.store.select(selectSubTitle);
    this.updateInfo$ = this.store.select(selectLatestUpdate);
    this.changeTime$ = this.store.select(selectWorkspaceCurrentIsChanged);
    this.valid = this.store.select(selectWorkspaceCurrentIsValid);
    this.changed = this.store.select(selectWorkspaceCurrentIsChanged);
    this.userGuides$ = this.store.select(selectDocumentationByType, {type: DocumentationType.USERGUIDE});
    this.faqs$ = this.store.select(selectDocumentationByType, {type: DocumentationType.FAQ});
    this.decisions$ = this.store.select(selectDocumentationByType, {type: DocumentationType.IMPLEMENTATIONDECISION});
    this.releaseNotes$ = this.store.select(selectDocumentationByType, {type: DocumentationType.RELEASENOTE});
    this.userNotes$ =  this.store.select(selectDocumentationByType, {type: DocumentationType.USERNOTES});
    this.glossary$ = this.store.select(selectDocumentationByType, {type: DocumentationType.GLOSSARY});
    this.active$ = this.store.select(selectWorkspaceActive);
  }

  ngOnInit() {
  }
  reset() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to reset ?',
        action: 'Reset',
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.store.dispatch(new DocumentationEditorReset());
        }
      },
    );
  }

  edit() {
    this.store.dispatch(new ToggleEditMode(true));
  }
  save() {
    this.store.dispatch(new DocumentationToolBarSave());
  }
}
