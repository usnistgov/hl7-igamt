import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter, repeat, skipUntil, takeUntil, tap } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { ClearIgEdit, ExpandTOC } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { DamController } from '../../../dam-framework/services/dam-widget.controller';
import { IWorkspaceActive } from '../../../shared/models/editor.class';
import { ITitleBarMetadata } from '../ig-edit-titlebar/ig-edit-titlebar.component';

export class IgDamController extends DamController {

  constructor(private store: Store<fromIgEdit.IState>) {
    super();
  }

  getTitleBarInfo(payload: any): Observable<any> {
    return this.store.select(fromIgEdit.selectTitleBar);
  }

}

@Component({
  selector: 'app-ig-edit-container',
  templateUrl: './ig-edit-container.component.html',
  styleUrls: ['./ig-edit-container.component.scss'],
})
export class IgEditContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  controller: IgDamController;

  titleBar: Observable<ITitleBarMetadata>;
  collapsed: boolean;
  @ViewChild('resize', { read: ElementRef })
  resize: ElementRef;
  dragging: boolean;
  positionX: string;
  resizeTocSubscription: Subscription;
  tocCollapseSubscription: Subscription;
  activeComponent: AbstractEditorComponent;
  activeWorkspace: Observable<IWorkspaceActive>;
  deltaMode$: Observable<boolean>;
  delta: boolean;

  constructor(private store: Store<fromIgEdit.IState>) {
    this.titleBar = this.store.select(fromIgEdit.selectTitleBar);
    this.activeWorkspace = store.select(fromIgEdit.selectWorkspaceActive);
    this.tocCollapseSubscription = this.store.select(fromIgEdit.selectTocCollapsed).subscribe(
      (collapsed) => {
        this.collapsed = collapsed;
      },
    );
    this.positionX = '2fr';
    this.controller = new IgDamController(store);
  }

  expandToc() {
    this.store.dispatch(new ExpandTOC());
  }

  activateComponent($event: Component) {
    if ($event instanceof AbstractEditorComponent) {
      this.activeComponent = $event;
      $event.registerSaveListener();
      $event.registerTitleListener();
    }
  }

  deactivateComponent($event: Component) {
    if ($event instanceof AbstractEditorComponent) {
      this.activeComponent = undefined;
      $event.unregisterSaveListener();
      $event.unregisterTitleListener();
    }
  }
  getControl() {
    return this.activeComponent ? this.activeComponent.controls : undefined;
  }

  ngAfterViewInit(): void {
    const move$ = fromEvent(document, 'mousemove');
    const down$ = fromEvent(this.resize.nativeElement, 'mousedown');
    const up$ = fromEvent(document, 'mouseup');
    if (!this.resizeTocSubscription || this.resizeTocSubscription.closed) {
      this.resizeTocSubscription = move$.pipe(
        skipUntil(down$),
        filter(() => !this.collapsed),
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
