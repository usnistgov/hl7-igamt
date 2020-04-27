import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { MessageType, UserMessage } from '../../../dam-framework/models/messages/message.class';
import { AddMessage, ClearAll } from '../../../dam-framework/store/messages/messages.actions';
import { IgService } from '../../../ig/services/ig.service';
import { IConnectingInfo } from '../../models/config.class';
import { IDisplayElement } from '../../models/display-element.interface';
import { ISelectedIds } from '../select-resource-ids/select-resource-ids.component';

@Component({
  selector: 'app-export-tool',
  templateUrl: './export-tool.component.html',
  styleUrls: ['./export-tool.component.css'],
})
export class ExportToolComponent implements OnInit {
  ids: ISelectedIds = { conformanceProfilesId: [], compositeProfilesId: [] };
  username: string;
  password: string;
  tool: IConnectingInfo;
  hasDomains = false;
  domains: any[];
  selectedDomain: string;
  redirectUrl: string;
  errors: any = null;
  constructor(
    public dialogRef: MatDialogRef<ExportToolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IExportToolDialogComponent,
    private igService: IgService,
    private store: Store<any>) {

  }
  ngOnInit() {
  }
  cancel() {
    this.dialogRef.close();
  }
  submit() {
    this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: false }));

    this.igService.exportToTesting(this.data.igId, this.ids, this.username, this.password, this.tool, this.selectedDomain).subscribe(
      (x: any) => {
        this.store.dispatch(new fromDAM.TurnOffLoader());
        if (x.token) {
          this.redirectUrl = this.tool.url + this.tool.redirectToken + '?x=' + encodeURIComponent(x.token) + '&y=' + encodeURIComponent(btoa(this.username + ':' + this.password)) + '&d=' + encodeURIComponent(this.selectedDomain);
          window.open(this.redirectUrl, '_blank');
        } else if (x.success === false && x.report) {
          this.errors = x.report;
        }
      },
      (response: HttpErrorResponse) => {
        this.store.dispatch(new fromDAM.TurnOffLoader());
        this.store.dispatch(new AddMessage(new UserMessage(MessageType.FAILED, response.error.text)));
      });
  }
  matchId($event: ISelectedIds) {
    this.ids = $event;
  }
  loadDomain() {
    this.hasDomains = false;
    this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: false }));
    this.igService.loadDomain(this.username, this.password, this.tool).subscribe((x) => {
      this.domains = x;
      this.hasDomains = true;
      this.store.dispatch(new fromDAM.TurnOffLoader());
      this.store.dispatch(new ClearAll());
    }, (response: HttpErrorResponse) => {
      this.hasDomains = false;

      this.store.dispatch(new fromDAM.TurnOffLoader());
      this.store.dispatch(new AddMessage(new UserMessage(MessageType.FAILED, response.error.text)));
    });
  }
  isSelected(): boolean {
    return (this.ids.conformanceProfilesId && this.ids.conformanceProfilesId.length > 0) || (this.ids.compositeProfilesId && this.ids.compositeProfilesId.length > 0);
  }
  selectDomain($event) {
    console.log($event);
    this.selectedDomain = $event.value.domain;
    console.log(this.selectedDomain);
  }
}
export interface IExportToolDialogComponent {

  conformanceProfiles?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
  tools: IConnectingInfo[];
  igId: string;
}
