import { CommonModule } from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ExtendedModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastyModule } from 'ng2-toasty';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import {CheckboxModule, RadioButtonModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import { MessageService } from '../core/services/message.service';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EntityBagdeComponent } from './components/entity-bagde/entity-bagde.component';
import {FormInputComponent} from './components/form-input/form-input.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MetadataDateComponent } from './components/metadata-date/metadata-date.component';
import { NewPasswordFromComponent } from './components/new-password-from/new-password-from.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ResetPasswordRequestFormComponent } from './components/reset-password-request-form/reset-password-request-form.component';
import { ScopeBadgeComponent } from './components/scope-badge/scope-badge.component';
import { SelectMessagesComponent } from './components/select-messages/select-messages.component';
import { SelectVersionsComponent } from './components/select-versions/select-versions.component';
import {ConfigService} from './services/config.service';
import { DEFAULT_MESSAGE_OPTION } from './shared-injection-token';

@NgModule({
  declarations: [
    LoginFormComponent,
    RegisterFormComponent,
    AlertsComponent,
    EntityBagdeComponent,
    MetadataDateComponent,
    ScopeBadgeComponent,
    ConfirmDialogComponent,
    ResetPasswordRequestFormComponent,
    NewPasswordFromComponent,
    FormInputComponent,
    SelectMessagesComponent,
    SelectVersionsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CardModule,
    CheckboxModule,
    ReactiveFormsModule,
    MatDialogModule,
    DropdownModule,
    ToastyModule.forRoot(),
    RadioButtonModule,
    TableModule,
    ExtendedModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    LoginFormComponent,
    FormsModule,
    ReactiveFormsModule,
    RegisterFormComponent,
    NgbModule,
    NgbAlert,
    CardModule,
    CheckboxModule,
    ReactiveFormsModule,
    ResetPasswordRequestFormComponent,
    NewPasswordFromComponent,
    AlertsComponent,
    EntityBagdeComponent,
    MetadataDateComponent,
    ScopeBadgeComponent,
    ToastyModule,
    MatDialogModule,
    DropdownModule,
    ConfirmDialogComponent,
    FormInputComponent,
    SelectVersionsComponent,
    SelectMessagesComponent,
  ],
  entryComponents: [ConfirmDialogComponent],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        MessageService, ConfigService,
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
