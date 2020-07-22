import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClearAll } from 'src/app/modules/dam-framework/store/messages/messages.actions';
import { UserProfileRequest } from '../../../../root-store/user-profile/user-profile.actions';
import { IUserProfile } from '../../../dam-framework/models/authentication/user-profile.class';

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
}
