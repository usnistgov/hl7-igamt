import { Action } from '@ngrx/store';

export enum ProfileComponentActionTypes {
  OpenProfileComponent = '[ProfileComponent] Open Profile Component',
  LoadSegmentContext =  '[ProfileComponent] Load Segment Context',
  LoadSegmentContextSuccess = '[ProfileComponent] Load Segment Context Success',
  LoadSegmentContextFailure = '[ProfileComponent] Load Segment Context Failure',
  OpenSegmentContextStructureEditor = 'Open Segment Context Structure Editor',
  LoadMessageContext =  '[ProfileComponent] Load Message Context',
  LoadMessageContextSuccess = '[ProfileComponent] Load Message Context Success',
  LoadMessageContextFailure = '[ProfileComponent] Load Message Context Failure',
  OpenMessageContextStructureEditor = 'Open Message Context Structure Editor',

}

export class OpenProfileComponent implements Action {
  readonly type = ProfileComponentActionTypes.OpenProfileComponent;
}

export class LoadSegmentContext implements Action {
  readonly type = ProfileComponentActionTypes.LoadSegmentContext;
}

export class LoadSegmentContextSuccess implements Action {
  readonly type = ProfileComponentActionTypes.LoadSegmentContextSuccess;
}

export class LoadSegmentContextFailure implements Action {
  readonly type = ProfileComponentActionTypes.LoadSegmentContextFailure;
}

export class OpenSegmentContextStructureEditor implements Action {
  readonly type = ProfileComponentActionTypes.OpenSegmentContextStructureEditor;
}

export class LoadMessageContext implements Action {
  readonly type = ProfileComponentActionTypes.LoadMessageContext;
}

export class LoadMessageContextSuccess implements Action {
  readonly type = ProfileComponentActionTypes.LoadMessageContextSuccess;
}

export class LoadMessageContextFailure implements Action {
  readonly type = ProfileComponentActionTypes.LoadMessageContextFailure;
}

export class OpenMessageContextStructureEditor implements Action {
  readonly type = ProfileComponentActionTypes.OpenMessageContextStructureEditor;
}

export type ProfileComponentActions = OpenProfileComponent | LoadSegmentContext| LoadSegmentContextSuccess | LoadSegmentContextFailure | OpenSegmentContextStructureEditor | LoadMessageContext
  | LoadMessageContextSuccess | LoadMessageContextFailure | OpenMessageContextStructureEditor;
