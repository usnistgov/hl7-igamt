import { Action } from '@ngrx/store';
import {IDocumentType} from '../../modules/document/document.type';

export enum DocumentActionTypes {
  ToggleType = '[Document] Toggle Type',
}

export class ToggleType implements Action {
  readonly type = DocumentActionTypes.ToggleType;

  constructor( readonly documentType: IDocumentType) {
  }
}

export type DocumentActions = ToggleType ;
