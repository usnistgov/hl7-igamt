import {IDisplayElement} from '../ig/ig-document.class';

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
  subject: {[ k: string]: IDisplayElement[]};
  to: string;
  index?: number;
}
