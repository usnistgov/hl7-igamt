import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ExtendedModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatFormFieldModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TreeModule } from 'angular-tree-component';
import { ToastyModule } from 'ng2-toasty';
import { AvatarModule } from 'ngx-avatar';
import { ContextMenuModule } from 'ngx-contextmenu';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DragDropModule as PrimeNgDragDrop } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { BreadcrumbModule, ConfirmationService, ConfirmDialogModule, ListboxModule, OverlayPanelModule } from 'primeng/primeng';
import {
  AccordionModule,
  AutoCompleteModule,
  CheckboxModule,
  ChipsModule,
  FileUploadModule,
  InputSwitchModule,
  MultiSelectModule,
  OrganizationChartModule,
  PanelModule,
  PickListModule,
  RadioButtonModule,
  TabViewModule,
  TieredMenuModule,
  TooltipModule,
  TreeTableModule,
} from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TreeModule as pTreeModule } from 'primeng/tree';
import { DamComponentsModule, DamLoaderModule, DamMessagesModule } from '../dam-framework/dam-framework.module';
import { IgListItemCardComponent } from '../ig/components/ig-list-item-card/ig-list-item-card.component';
import { ActiveUsersListComponent, FirstLetterPipe } from './components/active-users-list/active-users-list.component';
import { AddCoConstraintGroupComponent } from './components/add-co-constraint-group/add-co-constraint-group.component';
import { AddCompositeComponent } from './components/add-composite/add-composite.component';
import { AddProfileComponentContextComponent } from './components/add-profile-component-context/add-profile-component-context.component';
import { AddProfileComponentComponent } from './components/add-profile-component/add-profile-component.component';
import { AddResourceComponent } from './components/add-resource/add-resource.component';
import { BindingBadgeComponent } from './components/binding-badge/binding-badge.component';
import { BindingSelectorComponent } from './components/binding-selector/binding-selector.component';
import { BuildCompositeComponent } from './components/build-composite/build-composite.component';
import { BuildValueSetComponent } from './components/build-value-set/build-value-set.component';
import { ChangeLogInfoComponent } from './components/change-log-info/change-log-info.component';
import { ChangeLogListInfoComponent } from './components/change-log-list-info/change-log-list-info.component';
import { ChangeReasonDialogComponent } from './components/change-reason-dialog/change-reason-dialog.component';
import { ChangeReasonListDialogComponent } from './components/change-reason-list-dialog/change-reason-list-dialog.component';
import { CodeSetBrowseDialogComponent } from './components/codeset-browse-dialog/codeset-browse-dialog.component';
import { CopyResourceComponent } from './components/copy-resource/copy-resource.component';
import { CsDialogComponent } from './components/cs-dialog/cs-dialog.component';
import { CsListComponent } from './components/cs-list/cs-list.component';
import { CsPropositionComponent } from './components/cs-proposition/cs-proposition.component';
import { CsSubcontextComponent } from './components/cs-subcontext/cs-subcontext.component';
import { DeactivatingDialogComponent } from './components/deactivating-dialog/deactivating-dialog.component';
import { DeleteListConfirmationComponent } from './components/delete-list-confirmation/delete-list-confirmation.component';
import { DeltaColumnComponent } from './components/delta-column/delta-column.component';
import { DeltaTreeComponent } from './components/delta-tree/delta-tree.component';
import { DeriveDialogComponent } from './components/derive-dialog/derive-dialog.component';
import { DisplayRefComponent } from './components/display-ref/display-ref.component';
import { DisplaySectionComponent } from './components/display-section/display-section.component';
import { DocumentBreadcrumbsComponent } from './components/document-breadcrumbs/document-breadcrumbs.component';
import { DocumentBrowserComponent } from './components/document-browser/document-browser.component';
import { DocumentConfigComponent } from './components/document-config/document-config.component';
import { DtmStructureComponent } from './components/dtm-stucture/dtm-structure.component';
import { AddMappingDialgComponent } from './components/dynamic-mapping/add-mapping-dialg/add-mapping-dialg.component';
import { DynamicMappingComponent } from './components/dynamic-mapping/dynamic-mapping.component';
import { EntityBagdeComponent } from './components/entity-bagde/entity-bagde.component';
import { EntityBrowseDialogComponent } from './components/entity-browse-dialog/entity-browse-dialog.component';
import { ExportToolComponent } from './components/export-tool/export-tool.component';
import { ExportXmlDialogComponent } from './components/export-xml-dialog/export-xml-dialog.component';
import { ExternalVsCodesFetchComponent } from './components/external-vs-codes-fetch/external-vs-codes-fetch.component';
import { FetchCodesDialogComponent } from './components/fetch-codes-dialog/fetch-codes-dialog.component';
import { FieldAddDialogComponent } from './components/field-add-dialog/field-add-dialog.component';
import { FileInputComponent } from './components/file-input/file-input.component';
import { FileSelectInputComponent } from './components/file-select-input/file-select-input.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { CardinalityComponent } from './components/hl7-v2-tree/columns/cardinality/cardinality.component';
import { CommentsComponent } from './components/hl7-v2-tree/columns/comments/comments.component';
import { ConformanceLengthComponent } from './components/hl7-v2-tree/columns/conformance-length/conformance-length.component';
import { ConstantValueComponent } from './components/hl7-v2-tree/columns/constant-value/constant-value.component';
import { DatatypeComponent } from './components/hl7-v2-tree/columns/datatype/datatype.component';
import { LengthComponent } from './components/hl7-v2-tree/columns/length/length.component';
import { NameComponent } from './components/hl7-v2-tree/columns/name/name.component';
import { SegmentComponent } from './components/hl7-v2-tree/columns/segment/segment.component';
import { TextComponent } from './components/hl7-v2-tree/columns/text/text.component';
import { UsageComponent } from './components/hl7-v2-tree/columns/usage/usage.component';
import { ValuesetComponent } from './components/hl7-v2-tree/columns/valueset/valueset.component';
import { Hl7V2TreeComponent } from './components/hl7-v2-tree/hl7-v2-tree.component';
import { IgPublisherComponent } from './components/ig-publisher/ig-publisher.component';
import { IgTypeComponent } from './components/ig-type/ig-type.component';
import { ImportCodeCSVComponent } from './components/import-code-csv/import-code-csv.component';
import { ImportCsvValuesetComponent } from './components/import-csv-valueset/import-csv-valueset.component';
import { ImportFromLibComponent } from './components/import-from-lib/import-from-lib.component';
import { ImportFromProviderComponent } from './components/import-from-provider/import-from-provider.component';
import { ImportStructureComponent } from './components/import-structure/import-structure.component';
import { InputCopyComponent } from './components/input-copy/input-copy.component';
import { IssueBadgeComponent } from './components/issue-badge/issue-badge.component';
import { KeyDialogComponent } from './components/key-dialog/key-dialog.component';
import { MessagePickerComponent } from './components/message-picker/message-picker.component';
import { MetadataAttributeConfigComponent } from './components/metadata-attribute-config/metadata-attribute-config.component';
import { MetadataDateComponent } from './components/metadata-date/metadata-date.component';
import { MetadataFormComponent } from './components/metadata-form/metadata-form.component';
import { NewPasswordFromComponent } from './components/new-password-from/new-password-from.component';
import { NgxDropdownComponent } from './components/ngx-dropdown/ngx-dropdown.component';
import { PatternDialogComponent } from './components/pattern-dialog/pattern-dialog.component';
import { AddPcToList } from './components/pc-list/add-profile-component/add-pc-to-list.component';
import { RefreshDialogComponent } from './components/refresh-dialog/refresh-dialog.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ResetPasswordRequestFormComponent } from './components/reset-password-request-form/reset-password-request-form.component';
import { ResourceDropdownComponent } from './components/resource-dropdown/resource-dropdown.component';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
import { ResourcePickerComponent } from './components/resource-picker/resource-picker.component';
import { ScopeBadgeComponent } from './components/scope-badge/scope-badge.component';
import { SegmentAddDialogComponent } from './components/segment-add-dialog/segment-add-dialog.component';
import { SelectDatatypesComponent } from './components/select-datatypes/select-datatypes.component';
import { SelectMessagesComponent } from './components/select-messages/select-messages.component';
import { SelectNameComponent } from './components/select-name/select-name.component';
import { SelectProfileComponentContextComponent } from './components/select-profile-component-context/select-profile-component-context.component';
import { SelectProfileComponentsComponent } from './components/select-profile-components/select-profile-components.component';
import { SelectResourceIdsComponent } from './components/select-resource-ids/select-resource-ids.component';
import { SelectSegmentsComponent } from './components/select-segments/select-segments.component';
import { SelectSlicingContextComponent } from './components/select-sling-context/select-slicing-context.component';
import { SelectValueSetsComponent } from './components/select-value-sets/select-value-sets.component';
import { SelectVersionsComponent } from './components/select-versions/select-versions.component';
import { SelectedMessagesComponent } from './components/selected-messages/selected-messages.component';
import { SharingDialogComponent } from './components/sharing-dialog/sharing-dialog.component';
import { SlicingRowComponent } from './components/slicing-editor/slicing-row.component';
import { SlicingViewerComponent } from './components/slicing-viewer/slicing-viewer.component';
import { StructureTreeComponent } from './components/structure-tree/structure-tree.component';
import { TextEditorDialogComponent } from './components/text-editor-dialog/text-editor-dialog.component';
import { TocSubMenuComponent } from './components/toc-sub-menu/toc-sub-menu.component';
import { UnusedElementsComponent } from './components/unused-elements/unused-elements.component';
import { UsageDialogComponent } from './components/usage-dialog/usage-dialog.component';
import { UsageViewerComponent } from './components/usage-viewer/usage-viewer.component';
import { UserProfileFormComponent } from './components/user-profile-form/user-profile-form.component';
import { ValueSetStructureComponent } from './components/value-set-structure/value-set-structure.component';
import { ValuesetDeltaComponent } from './components/valueset-delta/valueset-delta.component';
import { VerificationBadgeComponent } from './components/verification-badge/verification-badge.component';
import { VerificationEntryTableComponent } from './components/verification-entry-table/verification-entry-table.component';
import { VerificationResultDisplayComponent } from './components/verification-result-display/verification-result-display.component';
import { VerifyIgDialogComponent } from './components/verify-ig-dialog/verify-ig-dialog.component';
import { VsCodePickerComponent } from './components/vs-code-picker/vs-code-picker.component';
import { AddingDuplicationDirective } from './directives/adding-duplication.directive';
import { GeneratedNamingDuplicationDirective } from './directives/generated-naming-duplication.directive';
import { NamingConventionDirective } from './directives/naming-convention.directive';
import { NamingDuplicationDirective } from './directives/naming-duplication.directive';
import { TooltipTextOverflowDirective } from './directives/tooltip-text-overflow.directive';
import { ConfigService } from './services/config.service';
import { StoreResourceRepositoryService } from './services/resource-repository.service';
import { MaxNumberDirective } from './validators/max-number.directive';
import { MinNumberDirective } from './validators/min-number.directive';
@NgModule({
  declarations: [
    UserProfileFormComponent,
    RegisterFormComponent,
    EntityBagdeComponent,
    MetadataDateComponent,
    ScopeBadgeComponent,
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
    AddingDuplicationDirective,
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
    SharingDialogComponent,
    UsageViewerComponent,
    ConstantValueComponent,
    StructureTreeComponent,
    CsPropositionComponent,
    CsDialogComponent,
    ValueSetStructureComponent,
    AddResourceComponent,
    SelectResourceIdsComponent,
    ExportXmlDialogComponent,
    VerifyIgDialogComponent,
    MinNumberDirective,
    MaxNumberDirective,
    DeltaTreeComponent,
    DeltaColumnComponent,
    BindingSelectorComponent,
    ExportToolComponent,
    DynamicMappingComponent,
    DeriveDialogComponent,
    AddCoConstraintGroupComponent,
    ResourceDropdownComponent,
    ImportCsvValuesetComponent,
    ValuesetDeltaComponent,
    DisplayRefComponent,
    NgxDropdownComponent,
    CsListComponent,
    SelectDatatypesComponent,
    SegmentAddDialogComponent,
    FieldAddDialogComponent,
    NameComponent,
    ChangeReasonDialogComponent,
    ChangeLogInfoComponent,
    DeactivatingDialogComponent,
    ResourceListComponent,
    AddMappingDialgComponent,
    AddProfileComponentComponent,
    SelectProfileComponentContextComponent,
    AddProfileComponentContextComponent,
    BuildCompositeComponent,
    AddCompositeComponent,
    SelectProfileComponentsComponent,
    AddPcToList,
    CsSubcontextComponent,
    GeneratedNamingDuplicationDirective,
    ImportStructureComponent,
    VerificationEntryTableComponent,
    IssueBadgeComponent,
    ChangeLogListInfoComponent,
    ChangeReasonListDialogComponent,
    SelectSlicingContextComponent,
    SlicingRowComponent,
    SlicingViewerComponent,
    DocumentBrowserComponent,
    EntityBrowseDialogComponent,
    IgListItemCardComponent,
    VsCodePickerComponent,
    IgPublisherComponent,
    DocumentBreadcrumbsComponent,
    UnusedElementsComponent,
    DeleteListConfirmationComponent,
    RefreshDialogComponent,
    VerificationBadgeComponent,
    IgTypeComponent,
    ActiveUsersListComponent,
    FirstLetterPipe,
    MessagePickerComponent,
    SelectedMessagesComponent,
    DocumentConfigComponent,
    MetadataAttributeConfigComponent,
    ImportFromLibComponent,
    VerificationResultDisplayComponent,
    FileInputComponent,
    ImportCodeCSVComponent,
    BuildValueSetComponent,
    CodeSetBrowseDialogComponent,
    KeyDialogComponent,
    InputCopyComponent,
    ExternalVsCodesFetchComponent,
    FetchCodesDialogComponent,
    ImportFromProviderComponent,
  ],
  providers: [
    StoreResourceRepositoryService,
    ConfirmationService,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TabViewModule,
    ReactiveFormsModule,
    NgbModule,
    TooltipModule,
    TreeModule,
    CardModule,
    CheckboxModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDialogModule,
    MatSliderModule,
    MatInputModule,
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
    DamMessagesModule,
    DamLoaderModule,
    DamComponentsModule,
    RadioButtonModule,
    AccordionModule,
    ListboxModule,
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
    PrimeNgDragDrop,
    DragDropModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    TabViewModule,
    OverlayPanelModule,
    AvatarModule,
    PickListModule,
    MatExpansionModule,
    MatTooltipModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    MatProgressSpinnerModule,
    CodemirrorModule,
    TieredMenuModule,
  ],
  exports: [
    MatExpansionModule,
    CommonModule,
    RouterModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    UserProfileFormComponent,
    RegisterFormComponent,
    TooltipModule,
    NgbModule,
    InputSwitchModule,
    CardModule,
    AccordionModule,
    ListboxModule,
    TreeTableModule,
    CheckboxModule,
    DamMessagesModule,
    DamComponentsModule,
    TabViewModule,
    PrimeNgDragDrop,
    ReactiveFormsModule,
    ResetPasswordRequestFormComponent,
    NewPasswordFromComponent,
    FileSelectInputComponent,
    EntityBagdeComponent,
    MetadataDateComponent,
    ScopeBadgeComponent,
    ToastyModule,
    MultiSelectModule,
    TreeModule,
    ContextMenuModule,
    pTreeModule,
    MatDialogModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    TieredMenuModule,
    DropdownModule,
    FormInputComponent,
    SelectVersionsComponent,
    SelectMessagesComponent,
    SelectDatatypesComponent,
    DisplaySectionComponent,
    TocSubMenuComponent,
    FroalaEditorModule,
    FroalaViewModule,
    MetadataFormComponent,
    ChipsModule,
    NgxDropdownComponent,
    ResourcePickerComponent,
    CopyResourceComponent,
    NamingDuplicationDirective,
    NamingConventionDirective,
    AddingDuplicationDirective,
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
    VerifyIgDialogComponent,
    MinNumberDirective,
    MaxNumberDirective,
    DeltaTreeComponent,
    DeltaColumnComponent,
    CsListComponent,
    BindingSelectorComponent,
    ExportToolComponent,
    DynamicMappingComponent,
    AddCoConstraintGroupComponent,
    ResourceDropdownComponent,
    ValuesetDeltaComponent,
    DisplayRefComponent,
    SelectDatatypesComponent,
    SegmentAddDialogComponent,
    FieldAddDialogComponent,
    NameComponent,
    ChangeReasonDialogComponent,
    ChangeLogInfoComponent,
    ResourceListComponent,
    AddProfileComponentComponent,
    AddProfileComponentContextComponent,
    AddCompositeComponent,
    BuildCompositeComponent,
    SelectProfileComponentsComponent,
    AddPcToList,
    CsSubcontextComponent,
    GeneratedNamingDuplicationDirective,
    ImportStructureComponent,
    VerificationEntryTableComponent,
    IssueBadgeComponent,
    ChangeLogListInfoComponent,
    ChangeReasonListDialogComponent,
    SelectSlicingContextComponent,
    SlicingRowComponent,
    DocumentBrowserComponent,
    IgListItemCardComponent,
    VsCodePickerComponent,
    IgPublisherComponent,
    BreadcrumbModule,
    DocumentBreadcrumbsComponent,
    UnusedElementsComponent,
    DeleteListConfirmationComponent,
    RefreshDialogComponent,
    DeriveDialogComponent,
    VerificationBadgeComponent,
    IgTypeComponent,
    MessagePickerComponent,
    SelectedMessagesComponent,
    DocumentConfigComponent,
    ActiveUsersListComponent,
    FirstLetterPipe,
    MetadataAttributeConfigComponent,
    ImportFromLibComponent,
    MatTooltipModule,
    VerificationResultDisplayComponent,
    CodeSetBrowseDialogComponent,
    KeyDialogComponent,
    InputCopyComponent,
    ExternalVsCodesFetchComponent,
    FetchCodesDialogComponent,
    FileInputComponent,
  ],
  entryComponents: [
    ResourcePickerComponent,
    CopyResourceComponent,
    TextEditorDialogComponent,
    UsageDialogComponent,
    SharingDialogComponent,
    CsDialogComponent,
    PatternDialogComponent,
    AddResourceComponent,
    ExportXmlDialogComponent,
    ExportToolComponent,
    BindingSelectorComponent,
    DeriveDialogComponent,
    AddCoConstraintGroupComponent,
    ImportCsvValuesetComponent,
    VerifyIgDialogComponent,
    SegmentAddDialogComponent,
    FieldAddDialogComponent,
    ChangeReasonDialogComponent,
    DeactivatingDialogComponent,
    AddMappingDialgComponent,
    AddProfileComponentComponent,
    AddProfileComponentContextComponent,
    AddCompositeComponent,
    AddPcToList,
    ImportStructureComponent,
    ChangeReasonListDialogComponent,
    SelectSlicingContextComponent,
    DocumentBrowserComponent,
    EntityBrowseDialogComponent,
    VsCodePickerComponent,
    IgPublisherComponent,
    UnusedElementsComponent,
    DeleteListConfirmationComponent,
    RefreshDialogComponent,
    MessagePickerComponent,
    DocumentConfigComponent,
    MetadataAttributeConfigComponent,
    ImportFromLibComponent,
    ImportCodeCSVComponent,
    CodeSetBrowseDialogComponent,
    KeyDialogComponent,
    BuildValueSetComponent,
    FetchCodesDialogComponent,
    ImportFromProviderComponent,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ConfigService,
      ],
    };
  }
}
