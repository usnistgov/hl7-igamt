import { SaveUserConfig } from './../../../../root-store/user-config/user-config.actions';
import { IUserConfig } from './../../../shared/models/config.class';
import { ConfigurationDialogComponent } from './../configuration-dialog/configuration-dialog.component';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import * as fromAuth from '../../../dam-framework/store/authentication/index';
import { LogoutRequest } from '../../../dam-framework/store/authentication/index';
import * as fromRoot from './../../../../root-store/index';
import { getUserConfigState } from 'src/app/root-store/user-config/user-config.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  isLoading: Observable<boolean>;
  isAdmin: Observable<boolean>;
  isIG: Observable<boolean>;
  isDtLib: Observable<boolean>;
  isConfig: Observable<boolean>;
  isLoggedIn: Observable<boolean>;
  username: Observable<string>;

  constructor(private store: Store<fromRoot.IRouteState>, private dialog: MatDialog,
    ) {
    this.isLoading = store.select(fromDAM.selectLoaderIsLoading);
    this.isAdmin = store.select(fromAuth.selectIsAdmin);
    this.isIG = store.select(fromDAM.selectRouterURL).pipe(
      map(
        (url: string) => {
          return url.startsWith('/ig/');
        },
      ),
    );
    this.isDtLib = store.select(fromDAM.selectRouterURL).pipe(
      map(
        (url: string) => {
          return url.startsWith('/datatype-library/');
        },
      ),
    );
    this.isConfig = store.select(fromDAM.selectRouterURL).pipe(
      map(
        (url: string) => {
          return url.startsWith('/configuration');
        },
      ),
    );
    this.isAdmin = store.select(fromAuth.selectIsAdmin);
    this.isLoggedIn = store.select(fromAuth.selectIsLoggedIn);
    this.username = store.select(fromAuth.selectUsername);
  }

  logout() {
    this.store.dispatch(new LogoutRequest());
  }

  ngOnInit() {
  }

  openConfig(){
   this.store.select(getUserConfigState).pipe(
      filter((config) => !!config),
      take(1),
      map((x) => {
        const dialogRef = this.dialog.open(ConfigurationDialogComponent, {
          data: {config: x},
        });
        dialogRef.afterClosed().pipe(
          filter((x) => x !== undefined),
          take(1),
          map((result: IUserConfig) => {
            this.store.dispatch(new SaveUserConfig(result));
          }),
        ).subscribe();

        }
      ),
    ).subscribe();
  }



}
