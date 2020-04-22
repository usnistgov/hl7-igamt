import { Component, forwardRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { DamWidgetComponent } from '../../../dam-framework/components/dam-widget/dam-widget.component';

@Component({
  selector: 'app-library-container',
  templateUrl: './library-container.component.html',
  styleUrls: ['./library-container.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => LibraryContainerComponent) },
  ],
})
export class LibraryContainerComponent extends DamWidgetComponent implements OnInit {

  constructor(store: Store<any>, dialog: MatDialog) {
    super(store, dialog);
  }

  ngOnInit() {
  }

}
