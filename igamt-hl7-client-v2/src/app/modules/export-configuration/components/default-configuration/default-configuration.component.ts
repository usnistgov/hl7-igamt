import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserMessage } from 'src/app/modules/core/models/message/message.class';
import { TurnOffLoader, TurnOnLoader } from '../../../../root-store/loader/loader.actions';
import { MessageType } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { IExportConfiguration } from '../../models/default-export-configuration.interface';
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

  constructor(
    private exportConfigurationService: ExportConfigurationService,
    private store: Store<any>,
    private messageService: MessageService,
    private dialog: MatDialog,
  ) { }

  loadExportConfigurationList() {
    this.exportConfigurationService.getAllExportConfigurations().subscribe(
      (x) => this.configList = x,
    );
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

  useAsDefaultConfiguration(configuration: IExportConfigurationItemList) {
    this.exportConfigurationService.saveAsDefaultExportConfiguration(configuration).subscribe(
      (x) =>  this.loadExportConfigurationList(),
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
          this.store.dispatch(new TurnOnLoader({ blockUI: true }));
          this.exportConfigurationService.deleteExportConfiguration(configuration).subscribe(
            (response) => {
              this.loadExportConfigurationList();
              this.store.dispatch(this.messageService.messageToAction(response));
              if (this.currentConfiguration && this.currentConfiguration.id === configuration.id) {
                this.currentConfiguration = undefined;
                this.hasChanges = false;
              }
            },
            (error) => {
              this.store.dispatch(this.messageService.actionFromError(error));
              this.store.dispatch(new TurnOffLoader());
            },
            () => {
              this.store.dispatch(new TurnOffLoader());
            },
          );
        }
      },
    );
  }

  save(): Observable<boolean> {
    const success: Subject<boolean> = new Subject<boolean>();
    this.store.dispatch(new TurnOnLoader({ blockUI: true }));
    this.exportConfigurationService.saveExportConfiguration(this.currentConfiguration).subscribe(
      (response) => {
        this.loadExportConfigurationList();
        this.store.dispatch(this.messageService.messageToAction(response));
        this.backupConfiguration = _.cloneDeep(this.currentConfiguration);
        this.hasChanges = false;
        success.next(true);
      },
      (error) => {
        this.store.dispatch(this.messageService.actionFromError(error));
        this.store.dispatch(new TurnOffLoader());
        success.next(false);
        success.complete();
      },
      () => {
        this.store.dispatch(new TurnOffLoader());
        success.complete();
      },
    );

    return success.asObservable();
  }

  open(id: string) {
    const fetchAndOpen = () => {
      this.store.dispatch(new TurnOnLoader({ blockUI: true }));
      this.exportConfigurationService.getExportConfigurationById(id).subscribe(
        (x) => {
          this.currentConfiguration = x;
          this.backupConfiguration = _.cloneDeep(this.currentConfiguration);
          this.hasChanges = false;
        },
        (error) => {
          this.store.dispatch(this.messageService.actionFromError(error));
          this.store.dispatch(new TurnOffLoader());
        },
        () => {
          this.store.dispatch(new TurnOffLoader());
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

  create() {
    this.store.dispatch(new TurnOnLoader({ blockUI: true }));
    this.exportConfigurationService.createExportConfiguration().subscribe(
      (x) => {
        this.currentConfiguration = x;
        this.open(this.currentConfiguration.id);
        this.store.dispatch(this.messageService.userMessageToAction(new UserMessage(MessageType.SUCCESS, 'Configuration Created Successfully')));
        this.loadExportConfigurationList();
      },
      (error) => {
        this.store.dispatch(this.messageService.actionFromError(error));
        this.store.dispatch(new TurnOffLoader());
      },
      () => {
        this.store.dispatch(new TurnOffLoader());
      },
    );
  }

  ngOnInit() {
    this.loadExportConfigurationList();
  }

  isDefault(item: IExportConfigurationItemList) {
    if (item.original) {
      return this.configList.findIndex((x) => x.defaultConfig)  < 0;
    } else {
      return item.defaultConfig;
    }
  }
}