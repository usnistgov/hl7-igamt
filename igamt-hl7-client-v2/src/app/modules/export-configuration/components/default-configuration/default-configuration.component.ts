import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserMessage } from 'src/app/modules/dam-framework/models/messages/message.class';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { ConfirmDialogComponent } from '../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { MessageType } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IExportConfiguration } from '../../models/default-export-configuration.interface';
import { ExportTypes } from '../../models/export-types';
import { IExportConfigurationItemList } from '../../models/exportConfigurationForFrontEnd.interface';
import { ExportConfigurationService } from '../../services/export-configuration.service';

@Component({
  selector: 'app-default-configuration',
  templateUrl: './default-configuration.component.html',
  styleUrls: ['./default-configuration.component.scss'],
})
export class DefaultConfigurationComponent implements OnInit {

  basicExportConfiguration: IExportConfiguration;
  currentConfiguration: IExportConfiguration;
  backupConfiguration: IExportConfiguration;
  userConfiguration: IExportConfiguration;
  configList: IExportConfigurationItemList[] = [];
  configName: string;
  hasChanges: boolean;
  filter: string;
  type: ExportTypes;

  constructor(
    private exportConfigurationService: ExportConfigurationService,
    private store: Store<any>,
    private activeRoute: ActivatedRoute,
    private messageService: MessageService,
    private dialog: MatDialog,
  ) { }

  loadExportConfigurationList(type: ExportTypes) {
    this.exportConfigurationService.getAllExportConfigurations(type).subscribe(
      (x) => {
        this.configList = x;
        if (this.currentConfiguration && this.currentConfiguration.type !== type) {
          this.currentConfiguration = null;
        }
      });
  }

  filteredList(): IExportConfigurationItemList[] {
    return this.configList.filter((elm) => {
      return !this.filter || elm.configName.includes(this.filter);
    });
  }

  reset() {
    this.currentConfiguration = _.cloneDeep(this.backupConfiguration);
    this.hasChanges = false;
  }

  change($event) {
    this.hasChanges = true;
  }

  updateDelta($event) {
    this.hasChanges = true;
    this.currentConfiguration.deltaMode = $event.active;
    this.currentConfiguration.deltaConfig = $event.config;
    this.currentConfiguration.conformamceProfileExportConfiguration.deltaMode = $event.active;
    this.currentConfiguration.conformamceProfileExportConfiguration.deltaConfig = $event.config;

    this.currentConfiguration.segmentExportConfiguration.deltaMode = $event.active;
    this.currentConfiguration.segmentExportConfiguration.deltaConfig = $event.config;

    this.currentConfiguration.datatypeExportConfiguration.deltaMode = $event.active;
    this.currentConfiguration.datatypeExportConfiguration.deltaConfig = $event.config;

    this.currentConfiguration.valueSetExportConfiguration.deltaMode = $event.active;
    this.currentConfiguration.valueSetExportConfiguration.deltaConfig = $event.config;

  }

  useAsDefaultConfiguration(configuration: IExportConfigurationItemList) {
    this.exportConfigurationService.saveAsDefaultExportConfiguration(configuration).subscribe(
      (x) => this.loadExportConfigurationList(this.type),
    );

  }

  delete(configuration: IExportConfiguration) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to delete Export Configuration "' + configuration.configName + '" ?',
        action: 'Delete Export Configuration',
      },
    });

    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: true }));
          this.exportConfigurationService.deleteExportConfiguration(configuration).subscribe(
            (response) => {
              this.loadExportConfigurationList(this.type);
              this.store.dispatch(this.messageService.messageToAction(response));
              if (this.currentConfiguration && this.currentConfiguration.id === configuration.id) {
                this.currentConfiguration = undefined;
                this.hasChanges = false;
              }
            },
            (error) => {
              this.store.dispatch(this.messageService.actionFromError(error));
              this.store.dispatch(new fromDAM.TurnOffLoader());
            },
            () => {
              this.store.dispatch(new fromDAM.TurnOffLoader());
            },
          );
        }
      },
    );
  }

  save(): Observable<boolean> {
    const success: Subject<boolean> = new Subject<boolean>();
    this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: true }));
    this.exportConfigurationService.saveExportConfiguration(this.currentConfiguration).subscribe(
      (response) => {
        this.loadExportConfigurationList(this.type);
        this.store.dispatch(this.messageService.messageToAction(response));
        this.backupConfiguration = _.cloneDeep(this.currentConfiguration);
        this.hasChanges = false;
        success.next(true);
      },
      (error) => {
        this.store.dispatch(this.messageService.actionFromError(error));
        this.store.dispatch(new fromDAM.TurnOffLoader());
        success.next(false);
        success.complete();
      },
      () => {
        this.store.dispatch(new fromDAM.TurnOffLoader());
        success.complete();
      },
    );

    return success.asObservable();
  }

  open(id: string) {
    const fetchAndOpen = () => {
      this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: true }));
      this.exportConfigurationService.getExportConfigurationById(id).subscribe(
        (x) => {
          this.currentConfiguration = x;
          this.backupConfiguration = _.cloneDeep(this.currentConfiguration);
          this.hasChanges = false;
        },
        (error) => {
          this.store.dispatch(this.messageService.actionFromError(error));
          this.store.dispatch(new fromDAM.TurnOffLoader());
        },
        () => {
          this.store.dispatch(new fromDAM.TurnOffLoader());
        },
      );
    };

    if (this.currentConfiguration && this.currentConfiguration.id !== id && this.hasChanges) {
      this.save().pipe(
        map((success) => {
          if (success) {
            fetchAndOpen();
          }
        }),
      ).subscribe();
    } else if (!this.currentConfiguration || this.currentConfiguration.id !== id) {
      fetchAndOpen();
    }
  }

  create(type: ExportTypes) {
    this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: true }));
    this.exportConfigurationService.createExportConfiguration(type).subscribe(
      (x) => {
        this.currentConfiguration = x;
        this.open(this.currentConfiguration.id);
        this.store.dispatch(this.messageService.userMessageToAction(new UserMessage(MessageType.SUCCESS, 'Configuration Created Successfully')));
        this.loadExportConfigurationList(type);
      },
      (error) => {
        this.store.dispatch(this.messageService.actionFromError(error));
        this.store.dispatch(new fromDAM.TurnOffLoader());
      },
      () => {
        this.store.dispatch(new fromDAM.TurnOffLoader());
      },
    );
  }

  ngOnInit() {
    this.activeRoute.queryParams.pipe(filter((x) => x != null)).subscribe((params) => {
      this.type = params.type;
      this.loadExportConfigurationList(this.type);
    });
  }

  isDefault(item: IExportConfigurationItemList) {
    if (item.original) {
      return this.configList.findIndex((x) => x.defaultConfig) < 0;
    } else {
      return item.defaultConfig;
    }
  }
}
