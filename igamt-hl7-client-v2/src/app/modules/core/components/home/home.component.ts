import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClearAll } from 'src/app/root-store/page-messages/page-messages.actions';
import * as fromPageMessages from '../../../../root-store/page-messages/page-messages.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private store: Store<fromPageMessages.IState>) {
  }

  ngOnInit() {
    this.store.dispatch(new ClearAll());
  }

}
