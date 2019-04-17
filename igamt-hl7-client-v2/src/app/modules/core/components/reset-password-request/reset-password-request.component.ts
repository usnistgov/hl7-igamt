import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ResetPasswordRequest } from '../../../../root-store/authentication/authentication.actions';

@Component({
  selector: 'app-reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./reset-password-request.component.scss'],
})
export class ResetPasswordRequestComponent implements OnInit {
  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  onSubmitApplication($event: string) {
    this.store.dispatch(new ResetPasswordRequest($event));
  }
}
