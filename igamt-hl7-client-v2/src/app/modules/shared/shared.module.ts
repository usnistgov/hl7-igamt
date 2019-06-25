import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ExtendedModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgbAlert, NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TreeModule } from 'angular-tree-component';
import { ToastyModule } from 'ng2-toasty';
import { ContextMenuModule } from 'ngx-contextmenu';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule, ChipsModule, FileUploadModule, MultiSelectModule, RadioButtonModule, TooltipModule, TreeTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { MessageService } from '../core/services/message.service';
import { AlertsComponent } from './components/alerts/alerts.component';
import { BindingBadgeComponent } from './components/binding-badge/binding-badge.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CopyResourceComponent } from './components/copy-resource/copy-resource.component';
import { DisplaySectionComponent } from './components/display-section/display-section.component';
import { EntityBagdeComponent } from './components/entity-bagde/entity-bagde.component';
import { FileSelectInputComponent } from './components/file-select-input/file-select-input.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { CardinalityComponent } from './components/hl7-v2-tree/columns/cardinality/cardinality.component';
import { CommentsComponent } from './components/hl7-v2-tree/columns/comments/comments.component';
import { ConformanceLengthComponent } from './components/hl7-v2-tree/columns/conformance-length/conformance-length.component';
import { DatatypeComponent } from './components/hl7-v2-tree/columns/datatype/datatype.component';
import { LengthComponent } from './components/hl7-v2-tree/columns/length/length.component';
import { SegmentComponent } from './components/hl7-v2-tree/columns/segment/segment.component';
import { TextComponent } from './components/hl7-v2-tree/columns/text/text.component';
import { UsageComponent } from './components/hl7-v2-tree/columns/usage/usage.component';
import { ValuesetComponent } from './components/hl7-v2-tree/columns/valueset/valueset.component';
import { Hl7V2TreeComponent } from './components/hl7-v2-tree/hl7-v2-tree.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MetadataDateComponent } from './components/metadata-date/metadata-date.component';
import { MetadataFormComponent } from './components/metadata-form/metadata-form.component';
import { NewPasswordFromComponent } from './components/new-password-from/new-password-from.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ResetPasswordRequestFormComponent } from './components/reset-password-request-form/reset-password-request-form.component';
import { ResourcePickerComponent } from './components/resource-picker/resource-picker.component';
import { ScopeBadgeComponent } from './components/scope-badge/scope-badge.component';
import { SelectDatatypesComponent } from './components/select-datatypes/select-datatypes.component';
import { SelectMessagesComponent } from './components/select-messages/select-messages.component';
import { SelectNameComponent } from './components/select-name/select-name.component';
import { SelectSegmentsComponent } from './components/select-segments/select-segments.component';
import { SelectValueSetsComponent } from './components/select-value-sets/select-value-sets.component';
import { SelectVersionsComponent } from './components/select-versions/select-versions.component';
import { TextEditorDialogComponent } from './components/text-editor-dialog/text-editor-dialog.component';
import { TocSubMenuComponent } from './components/toc-sub-menu/toc-sub-menu.component';
import {UsageDialogComponent} from './components/usage-dialog/usage-dialog.component';
import {UsageViewerComponent} from './components/usage-viewer/usage-viewer.component';
import { NamingConventionDirective } from './directives/naming-convention.directive';
import { NamingDuplicationDirective } from './directives/naming-duplication.directive';
import { TooltipTextOverflowDirective } from './directives/tooltip-text-overflow.directive';
import { ConfigService } from './services/config.service';
import { StoreResourceRepositoryService } from './services/resource-repository.service';
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
    DisplaySectionComponent,
    TocSubMenuComponent,
    MetadataFormComponent,
    ResourcePickerComponent,
    SelectDatatypesComponent,
    SelectSegmentsComponent,
    SelectValueSetsComponent,
    FileSelectInputComponent,
    NamingDuplicationDirective,
    NamingConventionDirective,
    CopyResourceComponent,
    SelectNameComponent,
    Hl7V2TreeComponent,
    UsageComponent,
    CardinalityComponent,
    LengthComponent,
    ConformanceLengthComponent,
    DatatypeComponent,
    SegmentComponent,
    ValuesetComponent,
    TextComponent,
    TooltipTextOverflowDirective,
    TextEditorDialogComponent,
    BindingBadgeComponent,
    CommentsComponent,
    UsageDialogComponent,
    UsageViewerComponent,
  ],
  providers: [
    StoreResourceRepositoryService,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TooltipModule,
    CardModule,
    CheckboxModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDialogModule,
    FileUploadModule,
    DropdownModule,
    ToastyModule.forRoot(),
    TreeModule,
    TreeTableModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    RadioButtonModule,
    TableModule,
    ExtendedModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    ChipsModule,
    MultiSelectModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    LoginFormComponent,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    RegisterFormComponent,
    TooltipModule,
    NgbModule,
    NgbAlert,
    CardModule,
    CheckboxModule,
    ReactiveFormsModule,
    ResetPasswordRequestFormComponent,
    NewPasswordFromComponent,
    FileSelectInputComponent,
    AlertsComponent,
    EntityBagdeComponent,
    MetadataDateComponent,
    ScopeBadgeComponent,
    ToastyModule,
    MultiSelectModule,
    TreeModule,
    ContextMenuModule,
    MatDialogModule,
    MatRadioModule,
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
    CopyResourceComponent,
    NamingDuplicationDirective,
    NamingConventionDirective,
    Hl7V2TreeComponent,
    UsageComponent,
    CardinalityComponent,
    LengthComponent,
    ConformanceLengthComponent,
    DatatypeComponent,
    SegmentComponent,
    ValuesetComponent,
    TextComponent,
    TooltipTextOverflowDirective,
    TextEditorDialogComponent,
    BindingBadgeComponent,
    CommentsComponent,
    UsageViewerComponent,
  ],
  entryComponents: [ConfirmDialogComponent, ResourcePickerComponent, CopyResourceComponent, TextEditorDialogComponent, UsageDialogComponent],
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
