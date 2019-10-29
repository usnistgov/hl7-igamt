import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CoConstraintTableComponent } from './components/co-constraint-table/co-constraint-table.component';
import { DataHeaderDialogComponent } from './components/data-header-dialog/data-header-dialog.component';

@NgModule({
  declarations: [CoConstraintTableComponent, DataHeaderDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [CoConstraintTableComponent, DataHeaderDialogComponent],
  entryComponents: [DataHeaderDialogComponent],
})
export class CoConstraintsModule { }
