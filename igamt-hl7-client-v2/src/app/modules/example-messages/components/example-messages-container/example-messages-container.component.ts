import { Component, forwardRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DamWidgetComponent } from '../../../dam-framework/components/data-widget/dam-widget/dam-widget.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectIgExampleMessages } from '../../../../root-store/example-messages/example-messages.reducer';

export const EXAMPLE_MESSAGES_WIDGET_ID = 'EXAMPLE_MESSAGES_WIDGET_ID';

@Component({
  selector: 'app-example-messages-container',
  templateUrl: './example-messages-container.component.html',
  styleUrls: ['./example-messages-container.component.scss'],
  providers: [
    { provide: DamWidgetComponent, useExisting: forwardRef(() => ExampleMessagesContainerComponent) },
  ],
})
export class ExampleMessagesContainerComponent extends DamWidgetComponent implements OnInit {

  title$: Observable<string>;

  constructor(
    store: Store<any>,
    dialog: MatDialog
  ) {
    super(EXAMPLE_MESSAGES_WIDGET_ID, store, dialog);
    this.title$ = this.store.select(selectIgExampleMessages).pipe(
      map((data) => data.title)
    );
  }

  ngOnInit() {
  }

}
