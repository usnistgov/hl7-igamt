import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ConfirmationService, ConfirmDialogModule } from 'primeng/primeng';
import { CodeSetEditEffects } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.effects';
import { CodeSetListEffects } from 'src/app/root-store/code-set-editor/code-set-list/code-set-list.effects';
import * as fromCodeSet from '../../root-store/code-set-editor/code-set.reducer';
import { CoreModule } from '../core/core.module';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { DamMessagesModule } from '../dam-framework/dam-framework.module';
import { SharedModule } from './../shared/shared.module';
import { CodeSetRoutingModule } from './code-set-editor-routing.module';
import { CodeSetActiveTitlebarComponent } from './components/code-set-active-titlebar/code-set-active-titlebar.component';
import { CodeSetDashBoardComponent } from './components/code-set-dash-board/code-set-dash-board.component';
import { CodeSetEditorCreateComponent } from './components/code-set-editor-create/code-set-editor-create.component';
import { CodeSetEditorListCardComponent } from './components/code-set-editor-list-card/code-set-editor-list-card.component';
import { CodeSetEditorListComponent } from './components/code-set-editor-list/code-set-editor-list.component';
import { CodeSetEditorComponent } from './components/code-set-editor/code-set-editor.component';
import { CodeSetManagementComponent } from './components/code-set-management/code-set-management.component';
import { CodeSetSideBarComponent } from './components/code-set-side-bar/code-set-side-bar.component';
import { CodeSetTableComponent } from './components/code-set-table/code-set-table.component';
import { CodeSetToolBarComponent } from './components/code-set-tool-bar/code-set-tool-bar.component';
import { CodeSetVersionEditorComponent } from './components/code-set-version-editor/code-set-version-editor.component';
import { CommitCodeSetVersionDialogComponent } from './components/commit-code-set-version-dialog/commit-code-set-version-dialog.component';
import { DeleteCodeSetDialogComponent } from './components/delete-code-set-dialog/delete-code-set-dialog.component';
@NgModule({
  declarations: [CodeSetEditorListComponent, CodeSetEditorCreateComponent, CodeSetEditorComponent, CodeSetVersionEditorComponent, CodeSetActiveTitlebarComponent, CodeSetSideBarComponent, CodeSetToolBarComponent, CodeSetTableComponent, CodeSetEditorListCardComponent, DeleteCodeSetDialogComponent, CommitCodeSetVersionDialogComponent, CodeSetDashBoardComponent, CodeSetManagementComponent],
  imports: [
    DamFrameworkModule.forRoot(),
    CodeSetRoutingModule,
    CoreModule,
    SharedModule,
    EffectsModule.forFeature([CodeSetEditEffects, CodeSetListEffects]),
    StoreModule.forFeature(fromCodeSet.featureName, fromCodeSet.reducers),
    DamMessagesModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [ConfirmationService],
  exports: [CodeSetEditorComponent],
  entryComponents: [CommitCodeSetVersionDialogComponent, DeleteCodeSetDialogComponent, CodeSetEditorComponent],
})
export class CodeSetEditorModule { }
