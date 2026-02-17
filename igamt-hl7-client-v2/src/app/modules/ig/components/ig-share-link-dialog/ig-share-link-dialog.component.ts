import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, flatMap, map, tap } from 'rxjs/operators';
import { IMessage } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { ExportDialogComponent } from 'src/app/modules/export-configuration/components/export-dialog/export-dialog.component';
import { IExportConfiguration } from 'src/app/modules/export-configuration/models/default-export-configuration.interface';
import { ExportTypes } from 'src/app/modules/export-configuration/models/export-types';
import { IExportConfigurationItemList } from 'src/app/modules/export-configuration/models/exportConfigurationForFrontEnd.interface';
import { ExportConfigurationService } from 'src/app/modules/export-configuration/services/export-configuration.service';
import { RefreshUpdateInfo } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { selectProfileTree } from 'src/app/root-store/ig/ig-edit/ig-edit.selectors';
import { ExportShareService } from '../../services/export-share.service';
import { IgService } from '../../services/ig.service';

export interface IShareExportConfiguration {
  name: string;
  configurationId: string;
  exportDecision: any;
  differential?: boolean;
}

export interface IShareLink extends IShareExportConfiguration {
  id: string;
}

@Component({
  selector: 'app-ig-share-link-dialog',
  templateUrl: './ig-share-link-dialog.component.html',
  styleUrls: ['./ig-share-link-dialog.component.scss'],
})
export class IgShareLinkDialogComponent {

  links: IShareLink[];
  list = true;
  configuration: IShareExportConfiguration;
  configurations: IExportConfigurationItemList[];
  configurationNotFound: boolean;
  igId: string;
  selectedId: string;
  copied = {};
  base = '';
  hasClipboard = !!window.navigator['clipboard'];
  isDifferential = false;

  constructor(
    public dialogRef: MatDialogRef<IgShareLinkDialogComponent>,
    private exportConfigurationService: ExportConfigurationService,
    private exportShareService: ExportShareService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private store: Store<any>,
    private igService: IgService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.links = [];
    this.igId = data.igId;
    this.isDifferential = data.isDifferential || false;
    for (const id of Object.keys(data.links)) {
      this.links.push({
        id,
        ...this.data.links[id],
      });
    }
    const host = window.location.protocol + '//' + window.location.host;
    const linkType = this.isDifferential ? 'differential' : '';
    this.base = host + '/public/ig/' + this.igId + '/' + linkType + (linkType ? '/' : '');
  }

  create() {
    this.configurationNotFound = false;
    const exportType = this.isDifferential ? ExportTypes.DIFFERENTIAL : ExportTypes.IGDOCUMENT;
    this.exportConfigurationService.getAllExportConfigurations(exportType).pipe(
      map((configurations) => {
        this.configurations = configurations;
        this.list = false;
        this.selectedId = '';
        this.configuration = {
          name: '',
          configurationId: '',
          exportDecision: undefined,
          differential: this.isDifferential,
        };
      }),
    ).subscribe();
  }

  edit(item: IShareLink) {
    this.configurationNotFound = false;
    const exportType = this.isDifferential ? ExportTypes.DIFFERENTIAL : ExportTypes.IGDOCUMENT;
    this.exportConfigurationService.getAllExportConfigurations(exportType).pipe(
      map((configurations) => {
        this.configurations = configurations;
        this.list = false;
        this.selectedId = item.id;
        this.configuration = {
          ...item,
        };
        const selectedConfiguration = configurations.find((conf) => conf.id === this.configuration.configurationId);
        if (!selectedConfiguration) {
          this.configuration.configurationId = undefined;
        }
        this.configurationNotFound = !this.configuration.configurationId;
      }),
    ).subscribe();
  }

  deleteLink(item: IShareLink) {
    const deleteAction = this.isDifferential
      ? this.exportShareService.deleteDifferentialLink(this.igId, item.id)
      : this.exportShareService.deleteLink(this.igId, item.id);
    this.refresh(deleteAction).subscribe();
  }

  copy(item: IShareLink) {
    const host = window.location.protocol + '//' + window.location.host;
    const url = host + '/public/ig/' + this.igId + '/' + item.id;
    window.navigator['clipboard'].writeText(url);
    this.copied[item.id] = true;
    setTimeout(() => {
      this.copied[item.id] = false;
    }, 600);
  }

  selectConfiguration() {
    const exportType = this.isDifferential ? ExportTypes.DIFFERENTIAL : ExportTypes.IGDOCUMENT;
    this.exportConfigurationService.getAllExportConfigurations(exportType).pipe(
      map((configurations) => {
        const selectedConfiguration = configurations.find((conf) => conf.id === this.configuration.configurationId);
        if (!selectedConfiguration) {
          this.configuration.configurationId = undefined;
        }
        const dialogRef = this.dialog.open(ExportDialogComponent, {
          data: {
            toc: this.store.select(selectProfileTree),
            igId: this.igId,
            configurations,
            type: exportType,
            exportFilterDecision: this.configuration.exportDecision,
            selectedConfigurationId: this.configuration.configurationId,
            delta: this.isDifferential,
            title: this.isDifferential ? 'Differential Share Link Export Configuration' : 'Share Link Export Configuration',
          },
        });
        dialogRef.afterClosed().pipe(
          filter((y) => y !== undefined),
          map((result) => {
            this.configuration.configurationId = result.configurationId;
            this.configuration.exportDecision = result.decision;
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  save() {
    let action: Observable<IMessage<any>>;
    if (this.isDifferential) {
      if (!this.selectedId) {
        action = this.exportShareService.createDifferentialLink(this.igId, this.configuration);
      } else {
        action = this.exportShareService.saveDifferentialLink(this.igId, this.selectedId, this.configuration);
      }
    } else {
      if (!this.selectedId) {
        action = this.exportShareService.createLink(this.igId, this.configuration);
      } else {
        action = this.exportShareService.saveLink(this.igId, this.selectedId, this.configuration);
      }
    }

    this.refresh(action).subscribe();
  }

  refresh(action: Observable<IMessage<any>>): Observable<any> {
    return action.pipe(
      flatMap((message) => {
        return this.igService.getUpdateInfo(this.igId).pipe(
          flatMap((v) => {
            this.store.dispatch(new RefreshUpdateInfo(v));
            this.store.dispatch(this.messageService.messageToAction(message));
            return this.update().pipe(
              tap(() => {
                this.list = true;
              }),
            );
          }),
        );
      }),
      catchError((e) => {
        this.store.dispatch(this.messageService.actionFromError(e));
        return of();
      }),
    );
  }

  update() {
    const getLinksAction = this.isDifferential
      ? this.exportShareService.getDifferentialShareLinks(this.igId)
      : this.exportShareService.getShareLinks(this.igId);
    return getLinksAction.pipe(
      tap((shareLinks) => {
        this.links = [];
        for (const id of Object.keys(shareLinks)) {
          this.links.push({
            id,
            ...shareLinks[id],
          });
        }
      }),
    );
  }

}
