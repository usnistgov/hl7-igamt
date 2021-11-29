import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { BootstrapCheckAuthStatus } from './modules/dam-framework/store/authentication/authentication.actions';
import { selectIsLoggedIn } from './modules/dam-framework/store/authentication/authentication.selectors';
import { selectIsFullScreen } from './modules/dam-framework/store/data/dam.selectors';
import { LoadConfig } from './root-store/config/config.actions';

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
    store.select(fromDAM.selectLoaderUiIsBlocked).subscribe(
      (block) => {
        if (block) {
          this.blockUIView.start();
        } else {
          this.blockUIView.stop();
        }
      },
    );
    combineLatest(store.select(selectIsLoggedIn), store.select(selectIsFullScreen)).pipe(
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
