import { Type } from '../constants/type.enum';

export interface IEditorMetadata {
  id: EditorID;
  title?: string;
  resourceType?: Type;
}

export enum EditorID {
  IG_METADATA = 'IG_METADATA',
  SECTION_NARRATIVE = 'SECTION_NARRATIVE',
  PREDEF = 'PREDEF',
  POSTDEF = 'POSTDEF',
}
