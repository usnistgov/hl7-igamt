import { Type } from '../constants/type.enum';
import { IAbstractDomain } from './abstract-domain.interface';
import {ISlicing} from './slicing';

export interface IResource extends IAbstractDomain {
  preDef?: string;
  postDef?: string;
  purposeAndUse?: string;
  shortDescription?: string;
  parentId: string;
  parentType: Type;
  fixedExtension?: string;
  structureIdentifier?: string;
  slicings?: ISlicing[];
  allowEmpty?: any;
}
