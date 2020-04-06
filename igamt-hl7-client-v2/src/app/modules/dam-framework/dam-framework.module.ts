import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DamLayoutComponent } from './components/dam-layout/dam-layout.component';
import { DamWidgetComponent } from './components/dam-widget/dam-widget.component';

@NgModule({
  declarations: [DamLayoutComponent, DamWidgetComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    DamLayoutComponent,
  ],
})
export class DamFrameworkModule { }
