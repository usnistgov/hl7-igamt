import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import * as fromAuth from '../../../dam-framework/store/authentication/index';
import * as fromRoot from './../../../../root-store/index';

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

  constructor(private store: Store<fromRoot.IRouteState>) {
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
  }

  ngOnInit() {
  }

}
