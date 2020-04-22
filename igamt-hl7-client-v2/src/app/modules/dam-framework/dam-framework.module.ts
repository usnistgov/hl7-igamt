import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { DamEditorOutletComponent } from './components/dam-editor-outlet/dam-editor-outlet.component';
import { DamFullscreenButtonComponent } from './components/dam-fullscreen-button/dam-fullscreen-button.component';
import { DamLayoutComponent } from './components/dam-layout/dam-layout.component';
import { DamResetButtonComponent } from './components/dam-reset-button/dam-reset-button.component';
import { DamSaveButtonComponent } from './components/dam-save-button/dam-save-button.component';
import { DamSideBarToggleComponent } from './components/dam-side-bar-toggle/dam-side-bar-toggle.component';
import { DataLoaderGuard } from './guards/data-loader.guard';
import { EditorActivateGuard } from './guards/editor-activate.guard';
import { EditorDeactivateGuard } from './guards/editor-deactivate.guard';
import * as fromDamfReducer from './store/dam.reducer';
import * as fromDamfSelector from './store/dam.selectors';

@NgModule({
  declarations: [
    DamLayoutComponent,
    DamEditorOutletComponent,
    DamSaveButtonComponent,
    DamResetButtonComponent,
    DamFullscreenButtonComponent,
    DamSideBarToggleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forFeature(fromDamfSelector.featureName, fromDamfReducer.reducer),
  ],
  providers: [
    DataLoaderGuard,
    EditorActivateGuard,
    EditorDeactivateGuard,
  ],
  exports: [
    DamLayoutComponent,
    DamEditorOutletComponent,
    DamSaveButtonComponent,
    DamResetButtonComponent,
    DamFullscreenButtonComponent,
    DamSideBarToggleComponent,
  ],
})
export class DamFrameworkModule { }
