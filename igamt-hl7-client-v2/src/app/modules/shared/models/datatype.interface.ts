import { Usage } from '../constants/usage.enum';
import { IResourceBinding } from './binding.interface';
import { IComment } from './comment.interface';
import { IResource } from './resource.interface';
import { ISubStructElement } from './structure-element.interface';

export interface IDatatype extends IResource {
  ext?: string;
  purposeAndUse: string;
  binding?: IResourceBinding;
  components?: IComponent[];
}

export interface IComponent extends ISubStructElement {
  constantValue: string;
  comments: IComment[];
  components: IComponent[];
}

export enum PredicateType {
  PRESENCE = 'PRESENCE', NOTPRESENCE = 'NOTPRESENCE', EQUAL = 'EQUAL', NOTEQUAL = 'NOTEQUAL',
}

export interface IDateTimePredicate {
  trueUsage?: Usage;
  falseUsage?: Usage;
  predicateType?: PredicateType;
  value?: string;
  target: IDateTimeComponentDefinition;
}

export interface IDateTimeComponentDefinition {
  position?: number;
  name?: string;
  description?: string;
  usage: Usage;
  dateTimePredicate: IDateTimePredicate;
}

export interface IDateTimeConstraints {
  dateTimeComponentDefinitions: IDateTimeComponentDefinition[];
}

export interface IDateTimeDatatype extends IDatatype {
  dateTimeConstraints: IDateTimeConstraints;

}
