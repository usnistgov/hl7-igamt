import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  UpdatePasswordRequest,
} from '../../../../root-store/authentication/authentication.actions';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {

  constructor(private store: Store<any>, private route: ActivatedRoute) { }

  ngOnInit() {

  }

  onSubmitApplication($event: string) {
    this.store.dispatch(new UpdatePasswordRequest({ token: this.route.snapshot.params['token'], password: $event }));
  }
}
