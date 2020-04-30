import { IEditorMetadata } from '../../dam-framework/models/data/workspace';
import { Type } from '../constants/type.enum';

export interface IHL7EditorMetadata extends IEditorMetadata {
  title?: string;
  resourceType?: Type;
  id: EditorID;
}

export enum EditorID {
  IG_METADATA = 'IG_METADATA',
  SEGMENT_METADATA = 'SEGMENT_METADATA',
  DATATYPE_METADATA = 'DATATYPE_METADATA',
  MESSAGE_METADATA = 'MESSAGE_METADATA',
  VALUESET_METADATA = 'VALUESET_METADATA',
  SECTION_NARRATIVE = 'SECTION_NARRATIVE',
  PREDEF = 'PREDEF',
  POSTDEF = 'POSTDEF',
  CROSSREF = 'CROSSREF',
  CONFP_STRUCTURE = 'CONFP_STRUCTURE',
  SEGMENT_STRUCTURE = 'SEGMENT_STRUCTURE',
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
}
