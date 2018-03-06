import {Component, Input, OnInit, EventEmitter, ViewChild} from '@angular/core';
import {AppComponent} from './app.component';

@Component({
  selector: 'app-menu',
  templateUrl: 'app.menu.html'
})
export class AppMenuComponent implements OnInit {

  @Input() reset: boolean;

  model: any[];

  constructor(public app: AppComponent) {
  }

  ngOnInit() {

  }

}
