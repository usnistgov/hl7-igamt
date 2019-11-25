import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ExtendedModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TreeModule } from 'angular-tree-component';
import { ToastyModule } from 'ng2-toasty';
import { ContextMenuModule } from 'ngx-contextmenu';
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import {
  AccordionModule, AutoCompleteModule, CheckboxModule, ChipsModule, DragDropModule, FileUploadModule, InputSwitchModule, MultiSelectModule, OrganizationChartModule, PanelModule, RadioButtonModule, TooltipModule, TreeTableModule,
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TreeModule as pTreeModule } from 'primeng/tree';
import { AlertsContainerComponent } from '../core/components/alerts-container/alerts-container.component';
import { MessageService } from '../core/services/message.service';
import { AddResourceComponent } from './components/add-resource/add-resource.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { BindingBadgeComponent } from './components/binding-badge/binding-badge.component';
import { BindingSelectorComponent } from './components/binding-selector/binding-selector.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CopyResourceComponent } from './components/copy-resource/copy-resource.component';
import { CsDialogComponent } from './components/cs-dialog/cs-dialog.component';
import { CsPropositionComponent } from './components/cs-proposition/cs-proposition.component';
import { DeltaColumnComponent } from './components/delta-column/delta-column.component';
import { DeltaTreeComponent } from './components/delta-tree/delta-tree.component';
import { DeriveDialogComponent } from './components/derive-dialog/derive-dialog.component';
import { DisplaySectionComponent } from './components/display-section/display-section.component';
import { DynamicMappingComponent } from './components/dynamic-mapping/dynamic-mapping.component';
import { EntityBagdeComponent } from './components/entity-bagde/entity-bagde.component';
import { ExportToolComponent } from './components/export-tool/export-tool.component';
import { ExportXmlDialogComponent } from './components/export-xml-dialog/export-xml-dialog.component';
import { FileSelectInputComponent } from './components/file-select-input/file-select-input.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { CardinalityComponent } from './components/hl7-v2-tree/columns/cardinality/cardinality.component';
import { CommentsComponent } from './components/hl7-v2-tree/columns/comments/comments.component';
import { ConformanceLengthComponent } from './components/hl7-v2-tree/columns/conformance-length/conformance-length.component';
import { ConstantValueComponent } from './components/hl7-v2-tree/columns/constant-value/constant-value.component';
import { DatatypeComponent } from './components/hl7-v2-tree/columns/datatype/datatype.component';
import { LengthComponent } from './components/hl7-v2-tree/columns/length/length.component';
import { PredicateComponent } from './components/hl7-v2-tree/columns/predicate/predicate.component';
import { SegmentComponent } from './components/hl7-v2-tree/columns/segment/segment.component';
import { TextComponent } from './components/hl7-v2-tree/columns/text/text.component';
import { UsageComponent } from './components/hl7-v2-tree/columns/usage/usage.component';
import { ValuesetComponent } from './components/hl7-v2-tree/columns/valueset/valueset.component';
import { Hl7V2TreeComponent } from './components/hl7-v2-tree/hl7-v2-tree.component';
import { DtmStructureComponent } from './components/dtm-stucture/dtm-structure.component';
import { ImportCsvValuesetComponent } from './components/import-csv-valueset/import-csv-valueset.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MetadataDateComponent } from './components/metadata-date/metadata-date.component';
import { MetadataFormComponent } from './components/metadata-form/metadata-form.component';
import { NewPasswordFromComponent } from './components/new-password-from/new-password-from.component';
import { PatternDialogComponent } from './components/pattern-dialog/pattern-dialog.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ResetPasswordRequestFormComponent } from './components/reset-password-request-form/reset-password-request-form.component';
import { ResourcePickerComponent } from './components/resource-picker/resource-picker.component';
import { ScopeBadgeComponent } from './components/scope-badge/scope-badge.component';
import { SelectDatatypesComponent } from './components/select-datatypes/select-datatypes.component';
import { SelectMessagesComponent } from './components/select-messages/select-messages.component';
import { SelectNameComponent } from './components/select-name/select-name.component';
import { SelectResourceIdsComponent } from './components/select-resource-ids/select-resource-ids.component';
import { SelectSegmentsComponent } from './components/select-segments/select-segments.component';
import { SelectValueSetsComponent } from './components/select-value-sets/select-value-sets.component';
import { SelectVersionsComponent } from './components/select-versions/select-versions.component';
import { StructureTreeComponent } from './components/structure-tree/structure-tree.component';
import { TextEditorDialogComponent } from './components/text-editor-dialog/text-editor-dialog.component';
import { TocSubMenuComponent } from './components/toc-sub-menu/toc-sub-menu.component';
import { UsageDialogComponent } from './components/usage-dialog/usage-dialog.component';
import { UsageViewerComponent } from './components/usage-viewer/usage-viewer.component';
import { ValueSetStructureComponent } from './components/value-set-structure/value-set-structure.component';
import { NamingConventionDirective } from './directives/naming-convention.directive';
import { NamingDuplicationDirective } from './directives/naming-duplication.directive';
import { TooltipTextOverflowDirective } from './directives/tooltip-text-overflow.directive';
import { ConfigService } from './services/config.service';
import { StoreResourceRepositoryService } from './services/resource-repository.service';
import { DEFAULT_MESSAGE_OPTION } from './shared-injection-token';
import { MaxNumberDirective } from './validators/max-number.directive';
import { MinNumberDirective } from './validators/min-number.directive';

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
    DtmStructureComponent,
    UsageComponent,
    CardinalityComponent,
    LengthComponent,
    ConformanceLengthComponent,
    PatternDialogComponent,
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
    ConstantValueComponent,
    PredicateComponent,
    StructureTreeComponent,
    CsPropositionComponent,
    CsDialogComponent,
    ValueSetStructureComponent,
    AddResourceComponent,
    SelectResourceIdsComponent,
    ExportXmlDialogComponent,
    MinNumberDirective,
    MaxNumberDirective,
    DeltaTreeComponent,
    DeltaColumnComponent,
    BindingSelectorComponent,
    ExportToolComponent,
    AlertsContainerComponent,
    DynamicMappingComponent,
    DeriveDialogComponent,
    ImportCsvValuesetComponent,
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
    TreeModule,
    CardModule,
    CheckboxModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDialogModule,
    FileUploadModule,
    pTreeModule,
    DropdownModule,
    ToastyModule.forRoot(),
    TreeModule,
    TreeTableModule,
    TableModule,
    SelectButtonModule,
    ColorPickerModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    DragDropModule,
    RadioButtonModule,
    AccordionModule,
    InputSwitchModule,
    TableModule,
    SelectButtonModule,
    ExtendedModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    ChipsModule,
    MultiSelectModule,
    OrganizationChartModule,
    PanelModule,
    AutoCompleteModule,
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
    InputSwitchModule,
    NgbAlert,
    CardModule,
    AccordionModule,
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
    pTreeModule,
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
    DtmStructureComponent,
    UsageComponent,
    CardinalityComponent,
    LengthComponent,
    ConformanceLengthComponent,
    DatatypeComponent,
    RadioButtonModule,
    DragDropModule,
    SegmentComponent,
    ValuesetComponent,
    TextComponent,
    TooltipTextOverflowDirective,
    TextEditorDialogComponent,
    BindingBadgeComponent,
    CommentsComponent,
    UsageViewerComponent,
    ConstantValueComponent,
    PredicateComponent,
    TableModule,
    SelectButtonModule,
    ColorPickerModule,
    StructureTreeComponent,
    CsPropositionComponent,
    CsDialogComponent,
    OrganizationChartModule,
    ValueSetStructureComponent,
    AddResourceComponent,
    ExportXmlDialogComponent,
    MinNumberDirective,
    MaxNumberDirective,
    DeltaTreeComponent,
    DeltaColumnComponent,
    BindingSelectorComponent,
    ExportToolComponent,
    AlertsContainerComponent,
    DynamicMappingComponent,
  ],
  entryComponents: [ConfirmDialogComponent, ResourcePickerComponent, ImportCsvValuesetComponent, CopyResourceComponent, TextEditorDialogComponent, UsageDialogComponent, CsDialogComponent, PatternDialogComponent, AddResourceComponent, ExportXmlDialogComponent, ExportToolComponent, BindingSelectorComponent, DeriveDialogComponent],
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
