import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ToastyModule } from 'ng2-toasty';
import { DamAlertsContainerComponent } from './components/dam-alerts-container/dam-alerts-container.component';
import { DamAlertsComponent } from './components/dam-alerts/dam-alerts.component';
import { DamEditorOutletComponent } from './components/dam-editor-outlet/dam-editor-outlet.component';
import { DamFullscreenButtonComponent } from './components/dam-fullscreen-button/dam-fullscreen-button.component';
import { DamLayoutComponent } from './components/dam-layout/dam-layout.component';
import { DamResetButtonComponent } from './components/dam-reset-button/dam-reset-button.component';
import { DamSaveButtonComponent } from './components/dam-save-button/dam-save-button.component';
import { DamSideBarToggleComponent } from './components/dam-side-bar-toggle/dam-side-bar-toggle.component';
import { DamWidgetContainerComponent } from './components/dam-widget-container/dam-widget-container.component';
import { DataLoaderGuard } from './guards/data-loader.guard';
import { EditorActivateGuard } from './guards/editor-activate.guard';
import { EditorDeactivateGuard } from './guards/editor-deactivate.guard';
import { WidgetDeactivateGuard } from './guards/widget-deactivate.guard';
import { WidgetSetupGuard } from './guards/widget-setup.guard';
import { DEFAULT_MESSAGE_OPTION } from './injection-token';
import { MessageService } from './services/message.service';
import * as fromDataReducer from './store/data/dam.reducer';
import * as fromDataSelector from './store/data/dam.selectors';
import * as fromLoaderReducer from './store/loader/loader.reducer';
import * as fromLoaderSelector from './store/loader/loader.selectors';
import { MessagesEffects } from './store/messages/message.effects';
import * as fromMessagesReducer from './store/messages/messages.reducer';
import * as fromMessagesSelector from './store/messages/messages.selectors';

@NgModule({
  declarations: [
    DamLayoutComponent,
    DamEditorOutletComponent,
    DamSaveButtonComponent,
    DamResetButtonComponent,
    DamFullscreenButtonComponent,
    DamSideBarToggleComponent,
    DamWidgetContainerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forFeature(fromDataSelector.featureName, fromDataReducer.reducer),
  ],
  exports: [
    DamLayoutComponent,
    DamEditorOutletComponent,
    DamSaveButtonComponent,
    DamResetButtonComponent,
    DamFullscreenButtonComponent,
    DamSideBarToggleComponent,
    DamWidgetContainerComponent,
  ],
})
export class DamFrameworkModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DamFrameworkModule,
      providers: [
        DataLoaderGuard,
        EditorActivateGuard,
        EditorDeactivateGuard,
        WidgetSetupGuard,
        WidgetDeactivateGuard,
      ],
    };
  }
}

@NgModule({
  declarations: [
    DamAlertsComponent,
    DamAlertsContainerComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    ToastyModule,
    EffectsModule.forFeature([MessagesEffects]),
    StoreModule.forFeature(fromMessagesSelector.messageFeatureName, fromMessagesReducer.messagesReducer),
  ],
  exports: [
    DamAlertsComponent,
    DamAlertsContainerComponent,
  ],
})
export class DamMessagesModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DamMessagesModule,
      providers: [
        MessageService,
        {
          provide: DEFAULT_MESSAGE_OPTION,
          useValue: {
            closable: true,
            timeout: 2000,
          },
        },
      ],
    };
  }
}

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(fromLoaderSelector.loaderFeatureName, fromLoaderReducer.loaderReducer),
  ],
  exports: [],
})
export class DamLoaderModule { }
