import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromPageMessages from '../../../dam-framework/store/messages/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
    this.store.dispatch(new fromPageMessages.ClearAll());
  }

}
