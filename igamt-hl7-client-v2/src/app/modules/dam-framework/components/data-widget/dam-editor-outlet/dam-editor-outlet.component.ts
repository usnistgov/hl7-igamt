import { Component, OnInit } from '@angular/core';
import { DamWidgetComponent } from '../dam-widget/dam-widget.component';

@Component({
  selector: 'app-dam-editor-outlet',
  templateUrl: './dam-editor-outlet.component.html',
  styleUrls: ['./dam-editor-outlet.component.scss'],
})
export class DamEditorOutletComponent implements OnInit {

  constructor(public widget: DamWidgetComponent) {
    if (widget == null) {
      throw new Error('DamEditorOutlet should be used inside a DamWidget');
    }
  }

  ngOnInit() {
  }

}
