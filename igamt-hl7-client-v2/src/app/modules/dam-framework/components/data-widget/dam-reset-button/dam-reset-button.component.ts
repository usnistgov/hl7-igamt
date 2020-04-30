import { Component, OnInit } from '@angular/core';
import { DamWidgetComponent } from '../dam-widget/dam-widget.component';

@Component({
  selector: 'app-dam-reset-button',
  templateUrl: './dam-reset-button.component.html',
  styleUrls: ['./dam-reset-button.component.scss'],
})
export class DamResetButtonComponent implements OnInit {

  constructor(public widget: DamWidgetComponent) {
    if (widget == null) {
      throw new Error('DamResetButton should be used inside a DamWidget');
    }
  }

  ngOnInit() {
  }

}
