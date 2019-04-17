import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BootstrapCheckAuthStatus } from './root-store/authentication/authentication.actions';
import {LoadConfig, LoadConfigFailure} from './root-store/config/config.actions';
import * as fromLoader from './root-store/loader/loader.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'igamt-client';
  blockUI: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.blockUI = store.select(fromLoader.selectLoaderUiIsBlocked);
  }

  ngOnInit(): void {
    this.store.dispatch(new BootstrapCheckAuthStatus());
  }

}
