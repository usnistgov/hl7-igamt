import { AfterViewInit, Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTooltipTextOverflow]',
})
export class TooltipTextOverflowDirective implements AfterViewInit {

  @Input() set appTooltipTextOverflow(text: string) {
    this.text = text;
  }
  text: string;
  tooltipActive = true;
  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: this.tooltipActive, a: 'b' });
  }

  ngAfterViewInit(): void {
    const element = this.element.nativeElement;
    if (element.offsetWidth < element.scrollWidth) {
      this.tooltipActive = true;
    } else {
      this.tooltipActive = false;
    }
  }

}
