import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DamWidgetComponent } from '../dam-widget/dam-widget.component';

@Component({
  selector: 'app-dam-fullscreen-button',
  templateUrl: './dam-fullscreen-button.component.html',
  styleUrls: ['./dam-fullscreen-button.component.scss'],
})
export class DamFullscreenButtonComponent implements OnInit, OnDestroy {

  fullscreen: boolean;
  subscription: Subscription;

  constructor(public widget: DamWidgetComponent) {
    if (widget == null) {
      throw new Error('DamFullScreenButton should be used inside a DamWidget');
    }

    this.subscription = widget.fullScreenStatus$().subscribe(
      (status) => this.fullscreen = status,
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
