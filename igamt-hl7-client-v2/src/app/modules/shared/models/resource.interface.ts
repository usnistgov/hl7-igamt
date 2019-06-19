import {IAbstractDomain} from './abstract-domain.interface';

export interface IResource extends IAbstractDomain {
  preDef?: string;
  postDef?: string;
}
