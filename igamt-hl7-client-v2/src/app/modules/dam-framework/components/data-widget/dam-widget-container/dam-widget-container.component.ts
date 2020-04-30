import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CleanStateData, ClearWidgetId } from '../../../store/data/dam.actions';
import { DamWidgetComponent } from '../dam-widget/dam-widget.component';

@Component({
  selector: 'app-dam-widget-container',
  template: '',
})
export class DamWidgetContainerComponent implements OnInit {

  public activeWidget: ComponentRef<DamWidgetComponent>;

  constructor(
    public store: Store<any>,
    public viewContainerRef: ViewContainerRef,
    protected route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  bootstrapWidget() {
    // Load Component
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<DamWidgetComponent>(this.route.snapshot.data.component);
    this.viewContainerRef.clear();
    this.activeWidget = this.viewContainerRef.createComponent<DamWidgetComponent>(componentFactory);

    // Execute User onClose
    this.activeWidget.instance.bootstrapWidget();
  }

  closeWidget() {
    if (this.activeWidget.instance.activeComponent) {
      this.activeWidget.instance.deactivateComponent(this.activeWidget.instance.activeComponent);
    }
    // Execute User onClose
    this.activeWidget.instance.closeWidget();
    this.activeWidget.destroy();
    // Clear State
    this.store.dispatch(new CleanStateData());
    // Clear Widget Id
    this.store.dispatch(new ClearWidgetId(this.activeWidget.instance.widgetId));
  }

  ngOnInit() {
    this.bootstrapWidget();
  }
}
