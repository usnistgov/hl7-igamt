import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { BootstrapCheckAuthStatus } from './root-store/authentication/authentication.actions';
import * as fromLoader from './root-store/loader/loader.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'igamt-client';
  @BlockUI() blockUIView: NgBlockUI;
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
  }

  ngOnInit(): void {
    this.store.dispatch(new BootstrapCheckAuthStatus());
  }

}
