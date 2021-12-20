import { IEditorMetadata } from '../../dam-framework/models/data/workspace';
import { Type } from '../constants/type.enum';

export interface IHL7EditorMetadata extends IEditorMetadata {
  title?: string;
  resourceType?: Type;
  id: EditorID;
}

export enum EditorID {
  IG_METADATA = 'IG_METADATA',
  LIBRARY_METADATA = 'LIBRARY_METADATA',
  SEGMENT_METADATA = 'SEGMENT_METADATA',
  CUSTOM_SEGMENT_STRUC_METADATA = 'CUSTOM_SEGMENT_STRUC_METADATA',

  DATATYPE_METADATA = 'DATATYPE_METADATA',
  MESSAGE_METADATA = 'MESSAGE_METADATA',
  CUSTOM_MESSAGE_STRUC_METADATA = 'CUSTOM_MESSAGE_STRUC_METADATA',

  VALUESET_METADATA = 'VALUESET_METADATA',
  SECTION_NARRATIVE = 'SECTION_NARRATIVE',
  PREDEF = 'PREDEF',
  POSTDEF = 'POSTDEF',
  CROSSREF = 'CROSSREF',

  CONFP_STRUCTURE = 'CONFP_STRUCTURE',
  CONFP_CUSTOM_STRUCTURE = 'CONFP_CUSTOM_STRUCTURE',
  PC_CONFP_CTX_STRUCTURE = 'PC_CONFP_CTX_STRUCTURE',
  PC_CONFP_CTX_CS = 'PC_CONFP_CTX_CS',
  PC_CONFP_CTX_CC = 'PC_CONFP_CTX_CC',

  SEGMENT_STRUCTURE = 'SEGMENT_STRUCTURE',
  SEGMENT_CUSTOM_STRUCTURE = 'SEGMENT_CUSTOM_STRUCTURE',
  PC_SEGMENT_CTX_STRUCTURE = 'PC_SEGMENT_CTX_STRUCTURE',
  PC_SEGMENT_CTX_CS = 'PC_SEGMENT_CTX_CS',
  PC_SEGMENT_CTX_DYNAMIC_MAPPING = 'PC_SEGMENT_CTX_DYNAMIC_MAPPING',

  SEGMENT_CS = 'SEGMENT_CS',
  DATATYPE_CS = 'DATATYPE_CS',
  CP_CS = 'CP_CS',
  CP_CC_BINDING = 'CP_CC_BINDING',
  DATATYPE_STRUCTURE = 'DATATYPE_STRUCTURE',
  VALUESET_STRUCTURE = 'VALUESET_STRUCTURE',
  DATATYPE_DELTA = 'DATATYPE_DELTA',
  SEGMENT_DELTA = 'SEGMENT_DELTA',
  CONFP_DELTA = 'CONFP_DELTA',
  DYNAMIC_MAPPING = 'DYNAMIC_MAPPING',
  CC_GROUP = 'CC_GROUP',
  VALUESET_DELTA = 'VALUESET_DELTA',
  CS_SUMMARY = 'CS_SUMMARY',
  CC_GROUP_DELTA = 'CC_GROUP_DELTA',

  PC_METADATA = 'PC_METADATA',
  PC_CONTEXT_STRUCTURE = 'PC_CONTEXT_STRUCTURE',
  COMPOSITE_PROFILE_COMPOSITION = 'COMPOSITE_PROFILE_COMPOSITION',

  COMPOSITE_PROFILE_STRUCTURE = 'COMPOSITE_PROFILE_STRUCTURE',
  COMPOSITE_PROFILE_METADATA = 'COMPOSITE_PROFILE_METADATA',
  COMPOSITE_PROFILE_DELTA = 'COMPOSITE_PROFILE_DELTA',

  SEGMENT_BINDINGS = 'SEGMENT_BINDINGS',
  DATATYPE_BINDINGS = 'DATATYPE_BINDINGS',
  CP_BINDINGS = 'CP_BINDINGS',

  SEGMENT_SLICING = 'SEGMENT_SLICING',
  CP_SLICING = 'CP_SLICING',

}
