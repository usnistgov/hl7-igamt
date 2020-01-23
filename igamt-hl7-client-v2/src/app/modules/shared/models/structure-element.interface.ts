import { LengthType } from '../constants/length-type.enum';
import { Type } from '../constants/type.enum';
import { Usage } from '../constants/usage.enum';
import { IRef } from './ref.interface';

export interface IStructureElement {
  id: string;
  name: string;
  position: number;
  usage: Usage;
  type: Type;
  text?: string;
  custom?: boolean;
}

export interface ISubStructElement extends IStructureElement {
  maxLength: string;
  minLength: string;
  confLength: string;
  lengthType: LengthType;
  ref: IRef;
}
