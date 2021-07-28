import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import * as fromRouter from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { ToastyModule } from 'ng2-toasty';
import { CardModule } from 'primeng/card';
import * as fromAuthReducer from 'src/app/modules/dam-framework/store/authentication/authentication.reducer';
import * as fromAuthSelector from 'src/app/modules/dam-framework/store/authentication/authentication.selectors';
import { DamAlertsContainerComponent } from './components/alerts/dam-alerts-container/dam-alerts-container.component';
import { DamAlertsComponent } from './components/alerts/dam-alerts/dam-alerts.component';
import { LoginFormComponent } from './components/authentication/login-form/login-form.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { TimeoutLoginDialogComponent } from './components/authentication/timeout-login-dialog/timeout-login-dialog.component';
import { UserManagementHeaderComponent } from './components/authentication/user-management-header/user-management-header.component';
import { DamEditorOutletComponent } from './components/data-widget/dam-editor-outlet/dam-editor-outlet.component';
import { DamFullscreenButtonComponent } from './components/data-widget/dam-fullscreen-button/dam-fullscreen-button.component';
import { DamLayoutComponent } from './components/data-widget/dam-layout/dam-layout.component';
import { DamResetButtonComponent } from './components/data-widget/dam-reset-button/dam-reset-button.component';
import { DamSaveButtonComponent } from './components/data-widget/dam-save-button/dam-save-button.component';
import { DamSideBarToggleComponent } from './components/data-widget/dam-side-bar-toggle/dam-side-bar-toggle.component';
import { DamWidgetContainerComponent } from './components/data-widget/dam-widget-container/dam-widget-container.component';
import { ConfirmDialogComponent } from './components/fragments/confirm-dialog/confirm-dialog.component';
import { AuthenticatedGuard, NotAuthenticatedGuard } from './guards/auth-guard.guard';
import { DataLoaderGuard } from './guards/data-loader.guard';
import { EditorActivateGuard } from './guards/editor-activate.guard';
import { EditorDeactivateGuard } from './guards/editor-deactivate.guard';
import { AuthInterceptor } from './guards/logout-interceptor.service';
import { NewPasswordResolver } from './guards/new-password.resolver';
import { WidgetDeactivateGuard } from './guards/widget-deactivate.guard';
import { WidgetSetupGuard } from './guards/widget-setup.guard';
import { DAM_AUTH_CONFIG, DEFAULT_MESSAGE_OPTION } from './injection-token';
import { AuthenticationService, IAuthenticationURL } from './services/authentication.service';
import { MessageService } from './services/message.service';
import { AuthenticationEffects } from './store/authentication/authentication.effects';
import * as fromDataReducer from './store/data/dam.reducer';
import * as fromDataSelector from './store/data/dam.selectors';
import * as fromLoaderReducer from './store/loader/loader.reducer';
import * as fromLoaderSelector from './store/loader/loader.selectors';
import { MessagesEffects } from './store/messages/message.effects';
import * as fromMessagesReducer from './store/messages/messages.reducer';
import * as fromMessagesSelector from './store/messages/messages.selectors';
import * as fromRouterSelector from './store/router/router.selectors';
import { DamBottomToggleComponent } from './components/data-widget/dam-bottom-toggle/dam-bottom-toggle.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  exports: [
    ConfirmDialogComponent,
  ],
  entryComponents: [
    ConfirmDialogComponent,
  ],
})
export class DamComponentsModule {
}

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forFeature(fromRouterSelector.routerFeatureName, fromRouter.routerReducer),
  ],
  exports: [
  ],
  entryComponents: [
  ],
})
export class DamRoutingModule {
}

@NgModule({
  declarations: [
    DamLayoutComponent,
    DamEditorOutletComponent,
    DamSaveButtonComponent,
    DamResetButtonComponent,
    DamFullscreenButtonComponent,
    DamSideBarToggleComponent,
    DamWidgetContainerComponent,
    DamBottomToggleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DamComponentsModule,
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
    DamBottomToggleComponent,
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

@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent,
    UserManagementHeaderComponent,
    TimeoutLoginDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DamComponentsModule,
    CardModule,
    DamMessagesModule,
    NgbModule,
    StoreModule.forFeature(fromAuthSelector.authenticationFeatureName, fromAuthReducer.authenticationReducer),
    EffectsModule.forFeature([AuthenticationEffects]),
  ],
  exports: [
    LoginComponent,
    LoginFormComponent,
    UserManagementHeaderComponent,
    TimeoutLoginDialogComponent,
  ],
  entryComponents: [
    TimeoutLoginDialogComponent,
  ],
})
export class DamAuthenticationModule {

  static forRoot(urls: IAuthenticationURL): ModuleWithProviders {
    return {
      ngModule: DamAuthenticationModule,
      providers: [
        AuthenticationService,
        NewPasswordResolver,
        AuthenticatedGuard,
        NotAuthenticatedGuard,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: DAM_AUTH_CONFIG, useValue: urls },
      ],
    };
  }
}
