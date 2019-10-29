import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CoConstraintTableComponent } from './components/co-constraint-table/co-constraint-table.component';
import { DataHeaderDialogComponent } from './components/data-header-dialog/data-header-dialog.component';
import { CcValueSetCellComponent } from './components/cc-value-set-cell/cc-value-set-cell.component';

@NgModule({
  declarations: [CoConstraintTableComponent, DataHeaderDialogComponent, CcValueSetCellComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [CoConstraintTableComponent, DataHeaderDialogComponent, CcValueSetCellComponent],
  entryComponents: [DataHeaderDialogComponent],
})
export class CoConstraintsModule { }
