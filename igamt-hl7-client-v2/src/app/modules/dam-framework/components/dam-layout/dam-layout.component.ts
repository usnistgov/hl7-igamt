import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ContentChild, TemplateRef } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter, repeat, skipUntil, takeUntil, tap } from 'rxjs/operators';
import { DamController } from '../../services/dam-widget.controller';

@Component({
  selector: 'app-dam-layout',
  templateUrl: './dam-layout.component.html',
  styleUrls: ['./dam-layout.component.scss'],
})
export class DamLayoutComponent implements OnInit, AfterViewInit {

  @Input()
  set controller(c: DamController) {
    this.titleBar = c.getTitleBarInfo({});
    this._controller = c;
  }

  @ContentChild('titleBar')
  titleBarTemplate: TemplateRef<any>;
  titleBar: Observable<any>;
  _controller: DamController;

  collapsed: boolean;
  @ViewChild('resize', { read: ElementRef })
  resize: ElementRef;
  dragging: boolean;
  positionX: string;
  resizeTocSubscription: Subscription;

  constructor() { }

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

  ngOnInit() {
  }

}
