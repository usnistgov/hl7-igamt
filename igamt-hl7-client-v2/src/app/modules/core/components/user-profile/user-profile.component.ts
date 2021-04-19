import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ClearAll } from 'src/app/modules/dam-framework/store/messages/messages.actions';
import { UserProfileRequest } from '../../../../root-store/user-profile/user-profile.actions';
import { IUserProfile } from '../../../dam-framework/models/authentication/user-profile.class';
import {ResetPasswordRequest} from '../../../dam-framework/store/authentication/authentication.actions';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';

@Component({
  selector: 'app-userprofile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  constructor(private store: Store<any>) {
  }

  ngOnInit() {
    this.store.dispatch(new ClearAll());
  }

  onSubmitApplication($event: IUserProfile) {
    this.store.dispatch(new UserProfileRequest($event));
  }

  resetPassword(): void {
    this.store.select(fromAuth.selectUsername).subscribe(u => {
      this.store.dispatch(new ResetPasswordRequest(u));
    });
  }
}
