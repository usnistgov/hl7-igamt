import { Type } from '../constants/type.enum';

export interface IEditorMetadata {
  id: EditorID;
  title?: string;
  resourceType?: Type;
}

export enum EditorID {
  IG_METADATA = 'IG_METADATA',
  SEGMENT_METADATA = 'SEGMENT_METADATA',
  DATATYPE_METADATA = 'DATATYPE_METADATA',
  SECTION_NARRATIVE = 'SECTION_NARRATIVE',
  PREDEF = 'PREDEF',
  POSTDEF = 'POSTDEF',
  CONFP_STRUCTURE = 'CONFP_STRUCTURE',
  SEGMENT_STRUCTURE = 'SEGMENT_STRUCTURE',
  DATATYPE_STRUCTURE = 'DATATYPE_STRUCTURE',
}
