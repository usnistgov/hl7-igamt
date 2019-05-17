import {Type} from '../../../shared/constants/type.enum';
import {IAddingInfo} from '../../../shared/models/adding-info';
import {IDisplayElement} from '../../../shared/models/display-element.interface';

export interface IDeleteNode {
  subject: IDisplayElement;
  from: string;
}

export interface IModeNode {
  subject: IDisplayElement;
  from: string;
  to: string;
  index: number;
}

export interface IAddNodes {
  documentId: string;
  selected: IAddingInfo[];
  type: Type;
}
