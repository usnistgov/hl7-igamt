import { Component, forwardRef } from '@angular/core';
import { OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, takeWhile, tap } from 'rxjs/operators';
import { IActiveUser } from 'src/app/modules/shared/components/active-users-list/active-users-list.component';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { DamWidgetComponent } from '../../../dam-framework/components/data-widget/dam-widget/dam-widget.component';
import { IWorkspaceActive } from '../../../dam-framework/models/data/workspace';
import { VerificationService } from '../../../shared/services/verification.service';
import { ITitleBarMetadata } from '../ig-edit-titlebar/ig-edit-titlebar.component';
import { selectDocumentSessionId, selectIgDocumentLocation } from './../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { selectIgDocumentStatusInfo } from './../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { selectViewOnly } from './../../../../root-store/library/library-edit/library-edit.selectors';
import { RefreshDialogComponent } from './../../../shared/components/refresh-dialog/refresh-dialog.component';
import { IDocumentLocation } from './../../models/ig/ig-document.class';
import { IgDocumentStatusInfo } from './../../models/ig/ig-document.class';
import { DocumentSessionMessageManager, DocumentSessionStompService } from './../../services/stomp.service';

export const IG_EDIT_WIDGET_ID = 'IG-EDIT-WIDGET';

@Component({
  selector: 'app-ig-edit-container',
  templateUrl: './ig-edit-container.component.html',
  styleUrls: ['./ig-edit-container.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => IgEditContainerComponent) },
  ],
})
export class IgEditContainerComponent extends DamWidgetComponent implements OnInit, OnDestroy {

  titleBar$: Observable<ITitleBarMetadata>;
  activeWorkspace: Observable<IWorkspaceActive>;
  showStatusBar$: Observable<boolean>;
  showBottomDrawer$: Observable<boolean>;
  location$: Observable<IDocumentLocation[]>;
  viewOnly$: Observable<boolean>;
  statusInfo$: Observable<IgDocumentStatusInfo>;
  activeUsers$: Observable<IActiveUser[]>;
  saveAction$: Observable<IActiveUser>;
  dsm: DocumentSessionMessageManager;
  sessionId$: Observable<string>;
  dsmSubscription: Subscription;

  constructor(
    protected store: Store<any>,
    protected verificationService: VerificationService,
    private documentSessionStompService: DocumentSessionStompService,
    dialog: MatDialog) {
    super(IG_EDIT_WIDGET_ID, store, dialog);
    this.titleBar$ = this.store.select(fromIgEdit.selectTitleBar);
    this.activeWorkspace = store.select(fromIgamtSelectors.selectWorkspaceActive);
    this.showStatusBar$ = verificationService.getStatusBarActive();
    this.showBottomDrawer$ = verificationService.getBottomDrawerActive();
    this.location$ = this.store.select(selectIgDocumentLocation).pipe(
      map((igLocation) => igLocation.location),
    );
    this.viewOnly$ = this.store.select(selectViewOnly);
    this.statusInfo$ = this.store.select(selectIgDocumentStatusInfo);
    this.sessionId$ = this.store.select(selectDocumentSessionId).pipe(
      map((session) => session.uid),
    );
  }

  containsUnsavedChanges$(): Observable<boolean> {
    return this.store.select(fromIgDocumentEdit.selectWorkspaceOrTableOfContentChanged);
  }

  ngOnInit() {
    this.dsmSubscription = this.documentSessionStompService.getDocumentSessionManager().pipe(
      switchMap((dsm) => {
        this.dsm = dsm;
        this.dsm.sendOpenAndSubscribe();
        this.activeUsers$ = this.dsm.getActiveUsers();
        return dsm.getSaveAction().pipe(
          takeWhile(() => {
            return dsm.isConnected();
          }),
          tap((user) => {
            if (user.id !== dsm.getSessionId()) {
              this.dialog.open(RefreshDialogComponent, {
                maxWidth: '600px',
                disableClose: true,
                data: {
                  message: 'User ' + user.username + ' has made changes to this document. This document is now out of date, please refresh the page.',
                  title: 'Document Out Of Synchronization',
                },
              });
            }
          }),
        );
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.dsm) {
      this.dsm.close();
    }
    if (this.dsmSubscription) {
      this.dsmSubscription.unsubscribe();
    }
  }
}
