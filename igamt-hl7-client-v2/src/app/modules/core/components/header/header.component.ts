import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromAuth from './../../../../root-store/authentication/authentication.reducer';
import * as fromRoot from './../../../../root-store/index';
import * as fromLoader from './../../../../root-store/loader/loader.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  isLoading: Observable<boolean>;
  isAdmin: Observable<boolean>;
  isIG: Observable<boolean>;

  constructor(private store: Store<fromRoot.IRouteState>) {
    this.isLoading = store.select(fromLoader.selectLoaderIsLoading);
    this.isAdmin = store.select(fromAuth.selectIsAdmin);
    this.isIG = store.select(fromRoot.selectRouterURL).pipe(
      map(
        (url: string) => {
          return url.startsWith('/ig/');
        },
      ),
    );
  }

  ngOnInit() {
  }

}
