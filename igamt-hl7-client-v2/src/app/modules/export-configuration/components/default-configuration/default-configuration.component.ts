import { Component, OnInit } from '@angular/core';
import {TabViewModule} from 'primeng/tabview';

@Component({
  selector: 'app-default-configuration',
  templateUrl: './default-configuration.component.html',
  styleUrls: ['./default-configuration.component.css']
})
export class DefaultConfigurationComponent implements OnInit {

  conformanceProfileConfig = {
    segmentORGroupsMessageExport : {
      r : true,
      re: true,
      c: true,
      x: true,
      o: true,
    }
  };


  usageConfiguration={
    r : true,
      re: true,
      c: true,
      x: false,
      o: true,
  };

    codesExport ={
    r: true,
    p: true,
    e: true,
  };

  column = {
    name: "Usage",
    position: 1,
    present: true,
    disabled: false,
  };

    messageColumn = {
    columns: this.column,
  };

  metadataConfig = {
    hl7version: true,
    publicationDate: true,
    publicationVersion: true,
    scope: false,
    preDefinition: true,
    postDefinition: true,
    usageNotes: true,
    authorNotes: true,
    organization: true,
    author: true,
    type: true,
    role: true,
  };

  valueSetMetadataConfig = {
    stability: true,
    extensibility: true,
    contentDefinition: true,
    oid: true,
    type: true,
    url: true,
  };

  constraintExportConfiguration = {
    conformanceStatement: true,
    predicate: true,
  }

  datatypeExportConfiguration = {
    creationDate: true,
    updateDate: true,
    name: true,
    type: true,
    origin: true,
    publicationInfo: true,
    publicationDate: true,
    domainInfo: false,
    comment: true,
    description: true,
    createdFrom: false,
    authorNotes: false,
    usageNotes: true,
    from: true,
    version: true,
    domainCompatibilityVersion: true,
    preDef: true,
    postDef: true,
    purposeAndUse: false,
    binding: true,
    constraintExportConfiguration: this.constraintExportConfiguration,
    includeDatatypeTable: false,
    datatypesExport: this.usageConfiguration,
    componentExport: this.usageConfiguration,
    columns: this.column,
    metadataConfig: this.metadataConfig,
    includeVaries: true,
  };

  segmentExportConfiguration ={
    creationDate: true,
    updateDate: true,
    name: true,
    type: true,
    origin: true,
    publicationInfo: true,
    publicationDate: true,
    domainInfo: true,
    comment: true,
    description: true,
    createdFrom: true,
    authorNotes: true,
    usageNotes: true,
    from: false,
    version: true,
    domainCompatibilityVersion: true,
    preDef: true,
    postDef: true,
    dynamicMappingInfo: true,
    binding: true,
    constraintExportConfiguration: this.conformanceProfileConfig,
    includeSegmentTable: true,
    greyOutOBX2FlavorColumn: true,
    segmentsExport: this.usageConfiguration,
    fieldsExport: this.usageConfiguration,
    columns: this.column,
    metadataConfig: this.metadataConfig,
  };

  conformamceProfileExportConfiguration = {
    creationDate: true,
    updateDate: true,
    name: true,
    type: true,
    origin: true,
    publicationInfo: true,
    publicationDate: true,
    domainInfo: true,
    comment: true,
    description: true,
    createdFrom: true,
    authorNotes: true,
    usageNotes: true,
    from: true,
    version: true,
    domainCompatibilityVersion: true,
    preDef: true,
    postDef: false,
    identifier: true,
    messageType: true,
    event: true,
    structID: true,
    binding: true,
    includeMessageTable: true,
    segmentORGroupsMessageExport: this.usageConfiguration,
    columns: this.column,
    metadataConfig: this.metadataConfig,
    constraintExportConfiguration: this.constraintExportConfiguration,
  };


  valueSetExportConfiguration ={
    creationDate: true,
    updateDate: true,
    name: false,
    type: false,
    origin: true,
    publicationInfo: true,
    publicationDate: true,
    domainInfo: true,
    comment: false,
    description: true,
    createdFrom: true,
    authorNotes: true,
    usageNotes: true,
    from: true,
    version: true,
    domainCompatibilityVersion: true,
    preDef: true,
    postDef: true,
    includeValuesetsTable: true,
    valuesetsExport: this.usageConfiguration,
    codesExport: this.codesExport,
    columns: this.column,
    metadataConfig: this.metadataConfig,
    unboundHL7: true,
    unboundCustom: false,
    phinvadsUpdateEmailNotification: false,
    codeNumber: 500,
    maxCodeNumber: 4000,
    stability: true,
    extensibility: true,
    contentDefinition: true,
    uRL: true,
  };

  ExportConfiguration = {
    datatypeExportConfiguration: this.datatypeExportConfiguration,
    segmentExportConfiguration: this.segmentExportConfiguration,
    conformamceProfileExportConfiguration: this.conformamceProfileExportConfiguration,
    valueSetExportConfiguration: this.valueSetExportConfiguration,
    abstractDomainExportConfiguration: null,
    resourceExportConfiguration: true,
    id: true,
    defaultType: true,
    name: true,
    username: true,
    unboundHL7: false,
    unboundCustom: false,
    includeVaries: true,
    includeMessageTable: true,
    includeSegmentTable: false,
    includeDatatypeTable: false,
    includeValuesetsTable: false,
    includeCompositeProfileTable: true,
    includeProfileComponentTable: true,
    greyOutOBX2FlavorColumn: false,
    includeDerived: true,
    segmentORGroupsMessageExport: this.usageConfiguration,
    segmentORGroupsCompositeProfileExport: this.usageConfiguration,
    segmentsExport: this.usageConfiguration,
    fieldsExport: this.usageConfiguration,
    profileComponentItemsExport: this.usageConfiguration,
    valuesetsExport: this.usageConfiguration,
    includeComposition: false,
    codesExport: this.codesExport,
    phinvadsUpdateEmailNotification: false,
    datatypesExport: this.usageConfiguration,
    componentExport: this.usageConfiguration,
    messageColumn: this.messageColumn,
    compositeProfileColumn: this.messageColumn,
    segmentColumn: this.messageColumn,
    profileComponentColumn: this.messageColumn,
    datatypeColumn: this.messageColumn,
    valuesetColumn: this.messageColumn,
    valuesetsMetadata: this.valueSetMetadataConfig,
    datatypeMetadataConfig: this.metadataConfig,
    segmentMetadataConfig: this.metadataConfig,
    messageMetadataConfig: this.metadataConfig,
    compositeProfileMetadataConfig: this.metadataConfig,
    maxCodeNumber: 100,
    datatypeLibraryIncludeSummary: false,
    datatypeLibraryIncludeDerived: true,
    documentMetadataConfiguration: false,
  };

  constructor() { }

  ngOnInit() {
  }

}
