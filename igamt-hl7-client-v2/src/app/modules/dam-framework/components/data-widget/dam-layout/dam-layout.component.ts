import { AfterViewInit, Component, ContentChild, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter, repeat, skipUntil, takeUntil, tap } from 'rxjs/operators';
import { DamWidgetComponent } from '../dam-widget/dam-widget.component';

@Component({
  selector: 'app-dam-layout',
  templateUrl: './dam-layout.component.html',
  styleUrls: ['./dam-layout.component.scss'],
})
export class DamLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  // --- Templates
  @ContentChild('alerts')
  alertsTemplate: TemplateRef<any>;

  @ContentChild('titleBar')
  titleBarTemplate: TemplateRef<any>;

  @ContentChild('toolbar')
  toolbarTemplate: TemplateRef<any>;

  @ContentChild('activeTitleBar')
  activeTitlebarTemplate: TemplateRef<any>;

  @ContentChild('editorContent')
  editorContentTemplate: TemplateRef<any>;

  @ContentChild('sideBar')
  sideBarTemplate: TemplateRef<any>;

  @ContentChild('statusBar')
  statusBarTemplate: TemplateRef<any>;

  @ContentChild('bottomDrawer')
  bottomDrawerTemplate: TemplateRef<any>;

  // --- Resize Attributes
  @ViewChild('resize', { read: ElementRef })
  resize: ElementRef;
  dragging: boolean;
  positionX: string;
  resizeTocSubscription: Subscription;

  // --- Collapse Attributes
  collapsed: boolean;
  tocCollapseSubscription: Subscription;

  bottomDrawerCollapsed: boolean;
  bottomDrawerCollapseSubscription: Subscription;

  constructor(public widget: DamWidgetComponent) {
    if (widget == null) {
      throw new Error('DamLayout should be used inside a DamWidget');
    }

    this.bottomDrawerCollapseSubscription = widget.bottomDrawerCollapseStatus$().subscribe(
      (collapsed) => {
        this.bottomDrawerCollapsed = collapsed;
      },
    );

    this.tocCollapseSubscription = widget.sideBarCollapseStatus$().subscribe(
      (collapsed) => {
        this.collapsed = collapsed;
      },
    );
  }

  expandSideBar() {
    return this.widget.showSideBar();
  }

  ngAfterViewInit(): void {
    const move$ = fromEvent(document, 'mousemove');
    const up$ = fromEvent(document, 'mouseup');

    if (this.resize) {
      const down$ = fromEvent(this.resize.nativeElement, 'mousedown');
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
  }

  ngOnDestroy() {
    this.resizeTocSubscription.unsubscribe();
    this.tocCollapseSubscription.unsubscribe();
    this.bottomDrawerCollapseSubscription.unsubscribe()
  }

  ngOnInit() {
  }

}
