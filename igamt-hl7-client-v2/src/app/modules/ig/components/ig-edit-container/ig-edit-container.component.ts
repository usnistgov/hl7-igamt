import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { repeat, skipUntil, takeUntil, tap } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { ClearIgEdit } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { ITitleBarMetadata } from '../ig-edit-titlebar/ig-edit-titlebar.component';

@Component({
  selector: 'app-ig-edit-container',
  templateUrl: './ig-edit-container.component.html',
  styleUrls: ['./ig-edit-container.component.scss'],
})
export class IgEditContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  titleBar: Observable<ITitleBarMetadata>;
  @ViewChild('resize', { read: ElementRef })
  resize: ElementRef;
  dragging: boolean;
  positionX: string;
  resizeTocSubscription: Subscription;

  constructor(private store: Store<fromIgEdit.IState>) {
    this.titleBar = this.store.select(fromIgEdit.selectTitleBar);
    this.positionX = '2fr';
  }

  activateComponent($event: Component) {
    if ($event instanceof AbstractEditorComponent) {
      $event.registerSaveListener();
      $event.registerTitleListener();
    }
  }

  deactivateComponent($event: Component) {
    if ($event instanceof AbstractEditorComponent) {
      $event.unregisterSaveListener();
      $event.unregisterTitleListener();
    }
  }

  ngAfterViewInit(): void {
    const move$ = fromEvent(document, 'mousemove');
    const down$ = fromEvent(this.resize.nativeElement, 'mousedown');
    const up$ = fromEvent(document, 'mouseup');
    if (!this.resizeTocSubscription || this.resizeTocSubscription.closed) {
      this.resizeTocSubscription = move$.pipe(
        skipUntil(down$),
        tap((event: MouseEvent) => {
          this.dragging = true;
          this.positionX = event.clientX + 'px';
        }),
        takeUntil(up$),
        repeat(),
      ).subscribe();
    }
    up$.pipe(
      tap(() => {
        this.dragging = false;
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.resizeTocSubscription.unsubscribe();
    this.store.dispatch(new ClearIgEdit());
  }

  ngOnInit() {
  }

}
