import { Type } from '@angular/core';
import { Action } from '@ngrx/store';
import { EditorID } from '../../../shared/models/editor.enum';

export type EditorActionMap = {
  [id in EditorID]: Type<Action>;
};
