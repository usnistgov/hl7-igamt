import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IEditorMetadata } from '../../modules/shared/models/editor.enum';
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
    editor: IEditorMetadata,
  }) { }

}

export class OpenSegmentStructureEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentStructureEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export class OpenSegmentPreDefEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentPreDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export class OpenSegmentPostDefEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentPostDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export class OpenSegmentCrossRefEditor implements Action {
  readonly type = SegmentEditActionTypes.OpenSegmentCrossRefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
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
  | OpenSegmentMetadataEditor;
