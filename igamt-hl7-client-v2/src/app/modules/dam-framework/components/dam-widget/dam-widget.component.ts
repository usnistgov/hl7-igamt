import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-dam-widget',
  templateUrl: './dam-widget.component.html',
  styleUrls: ['./dam-widget.component.scss'],
})
export abstract class DamWidgetComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnDestroy() {
    // CLEAR DATA
  }

  ngOnInit() {
    // CLEAR DATA
  }

}
