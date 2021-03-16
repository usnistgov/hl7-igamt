import { Type } from '../constants/type.enum';
import { Usage } from '../constants/usage.enum';
import { IExternalSingleCode, IValuesetBinding } from './binding.interface';
import { IComment } from './comment.interface';
import { IResource } from './resource.interface';
import { PropertyType } from './save-change';
import { IDynamicMappingInfo } from './segment.interface';

export interface IProfileComponent extends IResource {
  children?: IProfileComponentContext;
}
export interface IProfileComponentContext {
  id: string;
  level: Type;
  sourceId: string;
  structure: string;
  position: number;
  profileComponentItems: IProfileComponentItem[];
}

export interface IProfileComponentItem {
  path: string;
  itemProperties: IItemProperty[];
}

export interface IItemProperty {
  propertyKey: PropertyType;
}

export interface IPropertyCardinalityMax extends IItemProperty {
  max: string,
  propertyKey: PropertyType.CARDINALITYMAX,
}

export interface IPropertyCardinalityMin extends IItemProperty {
  min: number,
  propertyKey: PropertyType.CARDINALITYMIN,
}

export interface IPropertyComment extends IItemProperty {
  comment: IComment[]
  propertyKey: PropertyType.COMMENT,
}

export interface IPropertyConfLength extends IItemProperty {
  confLength: string,
  propertyKey: PropertyType.CONFLENGTH,
}

export interface IPropertyConformanceStatement extends IItemProperty {
  constraintId: string,
  description: string,
  assertionScript: string,
  propertyKey: PropertyType.STATEMENT,
}

export interface IPropertyConstantValue extends IItemProperty {
  constantValue: string,
  propertyKey: PropertyType.CONSTANTVALUE,
}

export interface IPropertyDatatype extends IItemProperty {
  datatypeId: string,
  propertyKey: PropertyType.DATATYPE,
}
export interface IPropertyDefinitionText extends IItemProperty {
  definitionText: string,
  propertyKey: PropertyType.DEFINITIONTEXT,
}
export interface IPropertyDynamicMapping extends IItemProperty {
  dynamicMappingInfo: IDynamicMappingInfo,
  propertyKey: PropertyType.DYNAMICMAPPINGITEM,
}
export interface IPropertyLengthMax extends IItemProperty {
  max: string
  propertyKey: PropertyType.LENGTHMAX,
}
export interface IPropertyLengthMin extends IItemProperty {
  min: string
  propertyKey: PropertyType.LENGTHMIN,
}

export interface IPropertyName extends IItemProperty {
  name: string
  propertyKey: PropertyType.NAME,
}
export interface IPropertyPredicate extends IItemProperty {
  trueUsage: Usage,
  falseUsage: Usage,
  constraintTarget: string,
  description: string,
  assertion: string,
  PropertyType: PropertyType.PREDICATE,

}
export interface IPropertyRef extends IItemProperty {
  ref: string,
  propertyKey: PropertyType.SEGMENTREF,
}

export interface IPropertySingleCode extends IItemProperty {
  singleCodeId: string,
  externalSingleCode: IExternalSingleCode,
  propertyKey: PropertyType.SINGLECODE,
}
export interface IPropertyUsage extends IItemProperty {
  usage: Usage,
  propertyKey: PropertyType.USAGE,
}
export interface IPropertyValueSet extends IItemProperty {
  valuesetBinding: IValuesetBinding[],
  propertyKey: PropertyType.VALUESET
}

export interface IValuedPath {
  elementId: string;
  child?: IValuedPath;
  values?: IItemProperty[];
}
