import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ExtendedModule } from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule } from '@angular/material/dialog';
import {RouterModule } from '@angular/router';
import {NgbAlert, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import {TreeModule} from 'angular-tree-component';
import {ToastyModule} from 'ng2-toasty';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule, ChipsModule, RadioButtonModule } from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import { MessageService } from '../core/services/message.service';
import {AlertsComponent} from './components/alerts/alerts.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import {DisplaySectionComponent} from './components/display-section/display-section.component';
import { EntityBagdeComponent } from './components/entity-bagde/entity-bagde.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import {MetadataDateComponent} from './components/metadata-date/metadata-date.component';
import { MetadataFormComponent } from './components/metadata-form/metadata-form.component';
import { NewPasswordFromComponent } from './components/new-password-from/new-password-from.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ResetPasswordRequestFormComponent } from './components/reset-password-request-form/reset-password-request-form.component';
import { ResourcePickerComponent } from './components/resource-picker/resource-picker.component';
import { ScopeBadgeComponent } from './components/scope-badge/scope-badge.component';
import { SelectDatatypesComponent } from './components/select-datatypes/select-datatypes.component';
import { SelectMessagesComponent } from './components/select-messages/select-messages.component';
import { SelectSegmentsComponent } from './components/select-segments/select-segments.component';
import { SelectValueSetsComponent } from './components/select-value-sets/select-value-sets.component';
import { SelectVersionsComponent } from './components/select-versions/select-versions.component';
import {TocSubMenuComponent} from './components/toc-sub-menu/toc-sub-menu.component';
import { NamingDuplicationDirective } from './directives/naming-duplication.directive';
import { ConfigService } from './services/config.service';
import {DEFAULT_MESSAGE_OPTION} from './shared-injection-token';

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
    DisplaySectionComponent,
    TocSubMenuComponent,
    MetadataFormComponent,
    ResourcePickerComponent,
    SelectDatatypesComponent,
    SelectSegmentsComponent,
    SelectValueSetsComponent,
    NamingDuplicationDirective,
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
    TreeModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    RadioButtonModule,
    TableModule,
    ExtendedModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    ChipsModule,
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
    TreeModule,
    ContextMenuModule,
    MatDialogModule,
    DropdownModule,
    ConfirmDialogComponent,
    FormInputComponent,
    SelectVersionsComponent,
    SelectMessagesComponent,
    DisplaySectionComponent,
    TocSubMenuComponent,
    FroalaEditorModule,
    FroalaViewModule,
    MetadataFormComponent,
    ChipsModule,
    ResourcePickerComponent,
    NamingDuplicationDirective,
  ],
  entryComponents: [ConfirmDialogComponent, ResourcePickerComponent],
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
