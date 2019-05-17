import { InjectionToken } from '@angular/core';
import { EditorActionMap } from './models/editor/editor-action-map.interface';

export const EditorActionMapToken: InjectionToken<EditorActionMap> = new InjectionToken<EditorActionMap>('EDITOR_ACTION_MAP');
