import { Component, OnInit } from '@angular/core';
import { DamWidgetComponent } from '../dam-widget/dam-widget.component';

@Component({
  selector: 'app-dam-save-button',
  templateUrl: './dam-save-button.component.html',
  styleUrls: ['./dam-save-button.component.scss'],
})
export class DamSaveButtonComponent implements OnInit {

  constructor(public widget: DamWidgetComponent) {
    if (widget == null) {
      throw new Error('DamSaveButton should be used inside a DamWidget');
    }
  }

  ngOnInit() {
  }

}
