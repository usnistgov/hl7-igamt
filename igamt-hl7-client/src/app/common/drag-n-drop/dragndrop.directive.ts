import {AfterViewInit, Directive, ElementRef, OnDestroy, ViewChild} from '@angular/core';

@Directive({
  selector: '[appDroppable]'
})
export class DragDropListDirective implements AfterViewInit, OnDestroy {

  @ViewChild('placeholder') placeholder: ElementRef;

  constructor() {}

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

}
