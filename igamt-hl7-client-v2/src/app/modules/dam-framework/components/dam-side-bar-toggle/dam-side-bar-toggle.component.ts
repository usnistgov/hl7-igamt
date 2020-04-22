import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DamWidgetComponent } from '../dam-widget/dam-widget.component';

@Component({
  selector: 'app-dam-side-bar-toggle',
  templateUrl: './dam-side-bar-toggle.component.html',
  styleUrls: ['./dam-side-bar-toggle.component.scss'],
})
export class DamSideBarToggleComponent implements OnInit, OnDestroy {

  collapsed: boolean;
  subscription: Subscription;

  constructor(public widget: DamWidgetComponent) {
    if (widget == null) {
      throw new Error('DamSideBarToggle should be used inside a DamWidget');
    }

    this.subscription = widget.sideBarCollapseStatus$().subscribe(
      (status) => this.collapsed = status,
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
  }

}
