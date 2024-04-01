import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import { ClearAll } from 'src/app/modules/dam-framework/store/messages/messages.actions';
import { UserProfileRequest } from '../../../../root-store/user-profile/user-profile.actions';
import { IUserProfile } from '../../../dam-framework/models/authentication/user-profile.class';
import { ResetPasswordRequest } from '../../../dam-framework/store/authentication/authentication.actions';
import { APIKeyService, IAPIKeyDisplay } from '../../services/api-key.service';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { catchError, finalize, flatMap, map } from 'rxjs/operators';
import { TurnOffLoader, TurnOnLoader } from 'src/app/modules/dam-framework/store';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/modules/dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-api-key-management',
  templateUrl: './api-key-management.component.html',
  styleUrls: ['./api-key-management.component.scss'],
})
export class ApiKeyManagementComponent implements OnInit {

  keys$: Observable<IAPIKeyDisplay[]>;
  openCodeSets: Record<string, boolean> = {}

  constructor(
    private store: Store<any>,
    private keyService: APIKeyService,
    private dialog: MatDialog,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.store.dispatch(new ClearAll());
    this.keys$ = this.keyService.getAPIKeys();
  }

  deleteAPIKey(key: IAPIKeyDisplay) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Delete API Key',
        question: 'Are you sure you want to delete API Key "' + key.name + '", you will not be able to use the key to access resources anymore'
      }
    }).afterClosed().pipe(
      flatMap((answer) => {
        if (answer) {
          this.store.dispatch(new TurnOnLoader({ blockUI: true }));
          return this.keyService.deleteAPIKey(key.id).pipe(
            flatMap((message) => {
              this.store.dispatch(this.messageService.messageToAction(message));
              return this.keys$ = this.keyService.getAPIKeys().pipe(
                finalize(() => {
                  this.store.dispatch(new TurnOffLoader());
                })
              );
            }),
            catchError((error) => {
              this.store.dispatch(this.messageService.actionFromError(error));
              this.store.dispatch(new TurnOffLoader());
              return of();
            })
          );
        }
        return of();
      })
    ).subscribe();
  }

  expiresIn(date: Date) {
    const a = (moment as any)(date);
    const b = (moment as any)(new Date());
    return a.from(b);
  }
}
