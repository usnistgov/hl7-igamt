import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BootstrapCheckAuthStatus } from './root-store/authentication/authentication.actions';
import { selectIsLoggedIn } from './root-store/authentication/authentication.reducer';
import { LoadConfig } from './root-store/config/config.actions';
import { selectFullScreen } from './root-store/ig/ig-edit/ig-edit.selectors';
import * as fromLoader from './root-store/loader/loader.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'igamt-client';
  @BlockUI() blockUIView: NgBlockUI;
  fullscreen: boolean;
  constructor(private store: Store<any>) {
    store.select(fromLoader.selectLoaderUiIsBlocked).subscribe(
      (block) => {
        if (block) {
          this.blockUIView.start();
        } else {
          this.blockUIView.stop();
        }
      },
    );
    combineLatest(store.select(selectIsLoggedIn), store.select(selectFullScreen)).pipe(
      map(([logged, full]) => {
        this.fullscreen = logged && full;
      }),
    ).subscribe();
  }

  ngOnInit(): void {
    this.store.dispatch(new BootstrapCheckAuthStatus());
    this.store.dispatch(new LoadConfig());

  }

}
