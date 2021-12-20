import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DamWidgetComponent } from '../../..';

@Component({
  selector: 'app-dam-bottom-toggle',
  templateUrl: './dam-bottom-toggle.component.html',
  styleUrls: ['./dam-bottom-toggle.component.scss'],
})
export class DamBottomToggleComponent implements OnInit, OnDestroy {

  collapsed: boolean;
  subscription: Subscription;

  constructor(public widget: DamWidgetComponent) {
    if (widget == null) {
      throw new Error('DamBottomDrawerToggle should be used inside a DamWidget');
    }

    this.subscription = widget.bottomDrawerCollapseStatus$().subscribe(
      (status) => {
        this.collapsed = status;
      },
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
