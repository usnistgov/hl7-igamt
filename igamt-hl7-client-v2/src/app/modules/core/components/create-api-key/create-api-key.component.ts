import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { TurnOffLoader, TurnOnLoader } from 'src/app/modules/dam-framework/store';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import { ClearAll } from 'src/app/modules/dam-framework/store/messages/messages.actions';
import { BrowseType, CodeSetBrowseDialogComponent, IBrowserTreeNode } from 'src/app/modules/shared/components/codeset-browse-dialog/codeset-browse-dialog.component';
import { KeyDialogComponent } from 'src/app/modules/shared/components/key-dialog/key-dialog.component';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { UserProfileRequest } from '../../../../root-store/user-profile/user-profile.actions';
import { IUserProfile } from '../../../dam-framework/models/authentication/user-profile.class';
import { ResetPasswordRequest } from '../../../dam-framework/store/authentication/authentication.actions';
import { APIKeyService, IAPIKeyCreateRequest } from '../../services/api-key.service';

@Component({
  selector: 'app-create-api-key',
  templateUrl: './create-api-key.component.html',
  styleUrls: ['./create-api-key.component.scss'],
})
export class CreateApiKeyComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    expires: new FormControl(true),
    validityDays: new FormControl(30, [Validators.required, Validators.min(1)]),
  });
  resources: IBrowserTreeNode[] = [];

  request: IAPIKeyCreateRequest;

  constructor(
    private store: Store<any>,
    private dialog: MatDialog,
    private messageService: MessageService,
    private router: Router,
    private keyService: APIKeyService) {
  }

  addCodeSet() {
    return this.dialog.open(CodeSetBrowseDialogComponent, {
      data: {
        browserType: BrowseType.ENTITY,
        scope: {
          private: true,
          public: true,
        },
        types: [Type.CODESET],
        exclude: (this.resources || []).map((c) => ({
          id: c.data.id,
          type: Type.CODESET,
        })),
      },
    }).afterClosed().pipe(
      map((browserResult: IBrowserTreeNode[]) => {
        if (browserResult) {
          this.resources = [
            ...this.resources,
            ...browserResult,
          ];
        }
      }),
    ).subscribe();
  }

  create() {
    this.store.dispatch(new TurnOnLoader({ blockUI: true }));
    this.keyService.createAPIKey({
      ...this.form.getRawValue(),
      resources: {
        [Type.CODESET]: this.resources.map((r) => r.data.id),
      },
    }).pipe(
      map((result) => {
        this.store.dispatch(new TurnOffLoader());
        this.dialog.open(KeyDialogComponent, {
          disableClose: true,
          data: {
            key: result,
          },
        }).afterClosed().pipe(
          tap(() => {
            this.router.navigate(['/', 'keys']);
          }),
        ).subscribe();
      }),
      catchError((error) => {
        this.store.dispatch(this.messageService.actionFromError(error));
        this.store.dispatch(new TurnOffLoader());
        return of();
      }),
    ).subscribe();
  }

  removeResouce(i: number) {
    this.resources.splice(i, 1);
  }

  expiresChange(value: boolean) {
    if (!value) {
      this.form.controls['validityDays'].setValue(0);
      this.form.controls['validityDays'].disable();
    } else {
      this.form.controls['validityDays'].setValue(30);
      this.form.controls['validityDays'].enable();
    }
  }

  ngOnInit() {
    this.store.dispatch(new ClearAll());
  }

  onSubmitApplication($event: IUserProfile) {
    this.store.dispatch(new UserProfileRequest($event));
  }

  resetPassword(): void {
    this.store.select(fromAuth.selectUsername).subscribe((u) => {
      this.store.dispatch(new ResetPasswordRequest(u));
    });
  }
}
