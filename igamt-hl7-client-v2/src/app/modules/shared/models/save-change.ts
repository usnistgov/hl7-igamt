import { IBindingContext } from '../services/structure-element-binding.service';

export interface IChange<T = any> {
  location: string;
  propertyType: PropertyType;
  propertyValue: T;
  oldPropertyValue?: T;
  position?: number;
  changeType: ChangeType;
}

export interface IChangeReason {
  reason: string;
  date: Date;
}

export interface IChangeLog {
  [type: string]: IChangeReason;
}

export interface ILocationChangeLog {
  [type: string]: Array<{
    context: IBindingContext,
    log: IChangeReason;
  }>;
}

export enum ChangeType {
  UPDATE = 'UPDATE',
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export enum PropertyType {
  USAGE = 'USAGE',
  DATATYPE = 'DATATYPE',
  SEGMENTREF = 'SEGMENTREF',
  STRUCTSEGMENT = 'STRUCTSEGMENT',
  CARDINALITYMAX = 'CARDINALITYMAX',
  CARDINALITY = 'CARDINALITY',
  LENGTH = 'LENGTH',
  LENGTHMIN = 'LENGTHMIN',
  LENGTHMAX = 'LENGTHMAX',
  LENGTHTYPE = 'LENGTHTYPE',
  FIELD = 'FIELD',
  CONFLENGTH = 'CONFLENGTH',
  CARDINALITYMIN = 'CARDINALITYMIN',
  PREDEF = 'PREDEF',
  POSTDEF = 'POSTDEF',
  VALUESET = 'VALUESET',
  COMMENT = 'COMMENT',
  DEFINITIONTEXT = 'DEFINITIONTEXT',
  EXT = 'EXT',
  DESCRIPTION = 'DESCRIPTION',
  AUTHORNOTES = 'AUTHORNOTES',
  USAGENOTES = 'USAGENOTES',
  CONSTANTVALUE = 'CONSTANTVALUE',
  PREDICATE = 'PREDICATE',
  CODES = 'CODES',
  CODESYSTEM = 'CODESYSTEM',
  EXTENSIBILITY = 'EXTENSIBILITY',
  CONTENTDEFINITION = 'CONTENTDEFINITION',
  STABILITY = 'STABILITY',
  BINDINGIDENTIFIER = 'BINDINGIDENTIFIER',
  URL = 'URL',
  INTENSIONALCOMMENT = 'INTENSIONALCOMMENT',
  STATEMENT = 'STATEMENT',
  SINGLECODE = 'SINGLECODE',
  NAME = 'NAME',
  AUTHORS = 'AUTHORS',
  PROFILETYPE = 'PROFILETYPE',
  ROLE = 'ROLE',
  PROFILEIDENTIFIER = 'PROFILEIDENTIFIER',
  COCONSTRAINTBINDINGS = 'COCONSTRAINTBINDINGS',
  COCONSTRAINTBINDING_CONTEXT = 'COCONSTRAINTBINDING_CONTEXT',
  COCONSTRAINTBINDING_SEGMENT = 'COCONSTRAINTBINDING_SEGMENT',
  COCONSTRAINTBINDING_CONDITION = 'COCONSTRAINTBINDING_CONDITION',
  COCONSTRAINTBINDING_TABLE = 'COCONSTRAINTBINDING_TABLE',
  COCONSTRAINTBINDING_HEADER = 'COCONSTRAINTBINDING_HEADER',
  COCONSTRAINTBINDING_GROUP = 'COCONSTRAINTBINDING_GROUP',
  COCONSTRAINTBINDING_ROW = 'COCONSTRAINTBINDING_ROW',
  COCONSTRAINTBINDING_CELL = 'COCONSTRAINTBINDING_CELL',
  ORGANISATION = 'ORGANISATION',
  DTMSTRUC = 'DTMSTRUC',
  SHORTDESCRIPTION = 'SHORTDESCRIPTION',
  DYNAMICMAPPINGITEM = 'DYNAMICMAPPINGITEM',
  DISPLAYNAME = 'DISPLAYNAME',
  CHANGEREASON = 'CHANGEREASON',
  CSCHANGEREASON = 'CSCHANGEREASON',
  FLAVORSEXTENSION = 'FLAVORSEXTENSION',
  DYNAMICMAPPING = 'DYNAMICMAPPING',
  SLICING = 'SLICING',
  ALLOWEMPTY = 'ALLOWEMPTY',
  CODESETREFERENCE = 'CODESETREFERENCE',
  SLICE_FLAVOR = 'SLICE_FLAVOR',
  ORDERED_SLICE_POSITION = 'ORDERED_SLICE_POSITION',
  CONDITIONAL_SLICE_ASSERTION = 'CONDITIONAL_SLICE_ASSERTION',
}

export const PropertyTypeText: Record<PropertyType, string> = {
  [PropertyType.USAGE]: 'Usage',
  [PropertyType.LENGTH]: 'Length',
  [PropertyType.DATATYPE]: 'Datatype',
  [PropertyType.SEGMENTREF]: 'Segment Reference',
  [PropertyType.STRUCTSEGMENT]: 'Segment Structure',
  [PropertyType.CARDINALITYMAX]: 'Max Cardinality',
  [PropertyType.CARDINALITY]: 'Cardinality',
  [PropertyType.LENGTHMIN]: 'Min Length',
  [PropertyType.LENGTHMAX]: 'Max Length',
  [PropertyType.LENGTHTYPE]: 'Length Type',
  [PropertyType.FIELD]: 'Field',
  [PropertyType.CONFLENGTH]: 'Conformance Length',
  [PropertyType.CARDINALITYMIN]: 'Min Cardinality',
  [PropertyType.PREDEF]: 'Pre-definition',
  [PropertyType.POSTDEF]: 'Post-definition',
  [PropertyType.VALUESET]: 'Value Set',
  [PropertyType.COMMENT]: 'Comment',
  [PropertyType.DEFINITIONTEXT]: 'Definition Text',
  [PropertyType.EXT]: 'Extension',
  [PropertyType.DESCRIPTION]: 'Description',
  [PropertyType.AUTHORNOTES]: 'Author Notes',
  [PropertyType.USAGENOTES]: 'Usage Notes',
  [PropertyType.CONSTANTVALUE]: 'Constant Value',
  [PropertyType.PREDICATE]: 'Predicate',
  [PropertyType.CODES]: 'Codes',
  [PropertyType.CODESYSTEM]: 'Code System',
  [PropertyType.EXTENSIBILITY]: 'Extensibility',
  [PropertyType.CONTENTDEFINITION]: 'Content Definition',
  [PropertyType.STABILITY]: 'Stability',
  [PropertyType.BINDINGIDENTIFIER]: 'Binding Identifier',
  [PropertyType.URL]: 'URL',
  [PropertyType.INTENSIONALCOMMENT]: 'Intensional Comment',
  [PropertyType.STATEMENT]: 'Conformance Statement',
  [PropertyType.SINGLECODE]: 'Single Code',
  [PropertyType.NAME]: 'Name',
  [PropertyType.AUTHORS]: 'Authors',
  [PropertyType.PROFILETYPE]: 'Profile Type',
  [PropertyType.ROLE]: 'Role',
  [PropertyType.PROFILEIDENTIFIER]: 'Profile Identifier',
  [PropertyType.COCONSTRAINTBINDINGS]: 'Co-constraints Bindings',
  [PropertyType.COCONSTRAINTBINDING_CONTEXT]: 'Co-constraint Binding Context',
  [PropertyType.COCONSTRAINTBINDING_SEGMENT]: 'Co-constraint Binding Segment',
  [PropertyType.COCONSTRAINTBINDING_CONDITION]: 'Co-constraint Binding Condition',
  [PropertyType.COCONSTRAINTBINDING_TABLE]: 'Co-constraint Table',
  [PropertyType.COCONSTRAINTBINDING_HEADER]: 'Co-constraint Table Header',
  [PropertyType.COCONSTRAINTBINDING_GROUP]: 'Co-constraint Group',
  [PropertyType.COCONSTRAINTBINDING_ROW]: 'Co-Constraint Row',
  [PropertyType.COCONSTRAINTBINDING_CELL]: 'Co-Constraint Cell',
  [PropertyType.ORGANISATION]: 'Organization',
  [PropertyType.DTMSTRUC]: 'Date Time Structure',
  [PropertyType.SHORTDESCRIPTION]: 'Short Description',
  [PropertyType.DYNAMICMAPPINGITEM]: 'Dynamic Mapping Item',
  [PropertyType.DISPLAYNAME]: 'Display Name',
  [PropertyType.CHANGEREASON]: 'Change Reason',
  [PropertyType.CSCHANGEREASON]: 'Conformance Statement Change Reason',
  [PropertyType.FLAVORSEXTENSION]: 'Flavors Extension',
  [PropertyType.DYNAMICMAPPING]: 'Dynamic Mapping',
  [PropertyType.SLICING]: 'Slicing',
  [PropertyType.ALLOWEMPTY]: 'Allow Empty',
  [PropertyType.CODESETREFERENCE]: 'Code Set Reference',
  [PropertyType.SLICE_FLAVOR]: 'Slice Flavor',
  [PropertyType.ORDERED_SLICE_POSITION]: 'Ordered Slice Position',
  [PropertyType.CONDITIONAL_SLICE_ASSERTION]: 'Conditional Slice Assertion',
};
