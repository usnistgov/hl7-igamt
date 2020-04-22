import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IHL7EditorMetadata } from '../../modules/shared/models/editor.enum';
import { ISegment } from '../../modules/shared/models/segment.interface';

export enum SegmentEditActionTypes {
  LoadSegment = '[Segment Edit] Load Segment',
  LoadSegmentSuccess = '[Segment Edit] Load Segment Success',
  LoadSegmentFailure = '[Segment Edit] Load Segment Failure',
  OpenSegmentPreDefEditor = '[Segment Edit] Open Segment Editor',
  OpenSegmentPostDefEditor = '[Segment Edit] Open Segment PostDef Editor',
  OpenSegmentStructureEditor = '[Segment Edit] Open Segment Structure Editor',
  OpenSegmentCrossRefEditor = '[Segment Edit] Open Segment Cross References Editor',
  OpenSegmentMetadataEditor = '[Segment Edit] Open Segment Metadata Editor',
  OpenSegmentDeltaEditor = '[Segment Edit] Open Segment Delta Editor',
  OpenSegmentConformanceStatementEditor = '[Segment Edit] Open Segment Conformance Statement Editor',
  OpenSegmentDynamicMappingEditor = '[Segment Edit] Open Segment Dynamic Mapping Editor',
}

export class LoadSegment implements Action {
  readonly type = SegmentEditActionTypes.LoadSegment;
  constructor(readonly id: string) { }
}

export class LoadSegmentSuccess implements Action {
  readonly type = SegmentEditActionTypes.LoadSegmentSuccess;
  constructor(readonly segment: ISegment) { }
}

export class LoadSegmentFailure implements Action {
  readonly type = SegmentEditActionTypes.LoadSegmentFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

export class OpenSegmentMetadataEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentMetadataEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenSegmentDeltaEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentDeltaEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenSegmentStructureEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentStructureEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenSegmentPreDefEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentPreDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenSegmentPostDefEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentPostDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenSegmentCrossRefEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentCrossRefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenSegmentDynamicMappingEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentDynamicMappingEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}
export class OpenSegmentConformanceStatementEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentConformanceStatementEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export type SegmentEditActions =
  LoadSegment
  | LoadSegmentSuccess
  | LoadSegmentFailure
  | OpenSegmentStructureEditor
  | OpenSegmentPreDefEditor
  | OpenSegmentPostDefEditor
  | OpenSegmentCrossRefEditor
  | OpenSegmentDeltaEditor
  | OpenSegmentConformanceStatementEditor
  | OpenSegmentMetadataEditor
  | OpenSegmentDynamicMappingEditor;
