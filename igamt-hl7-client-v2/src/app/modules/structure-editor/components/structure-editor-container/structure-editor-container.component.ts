import { Component, forwardRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DamWidgetComponent } from '../../../dam-framework/components/data-widget/dam-widget/dam-widget.component';

export const STRUCT_EDIT_WIDGET_ID = 'STRUCT-EDIT-WIDGET-ID';

@Component({
  selector: 'app-structure-editor-container',
  templateUrl: './structure-editor-container.component.html',
  styleUrls: ['./structure-editor-container.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => StructureEditorContainerComponent) },
  ],
})
export class StructureEditorContainerComponent extends DamWidgetComponent implements OnInit {

  constructor(store: Store<any>, dialog: MatDialog) {
    super(STRUCT_EDIT_WIDGET_ID, store, dialog);
  }

  ngOnInit() {
  }

}
