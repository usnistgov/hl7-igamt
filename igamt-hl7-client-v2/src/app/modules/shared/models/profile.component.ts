import { Type } from '../constants/type.enum';
import { Usage } from '../constants/usage.enum';
import { IExternalSingleCode, IValuesetBinding, InternalSingleCode } from './binding.interface';
import { IComment } from './comment.interface';
import { IResource } from './resource.interface';
import { PropertyType } from './save-change';
import { IDynamicMappingInfo } from './segment.interface';
import { LengthType } from '../constants/length-type.enum';
import { IPredicate } from './predicate.interface';

export interface IProfileComponent extends IResource {
  children?: IProfileComponentContext;
}
export interface IProfileComponentContext {
  id: string;
  level: Type;
  sourceId: string;
  structure: string;
  position: number;
  profileComponentBindings: IProfileComponentBinding;
  profileComponentItems: IProfileComponentItem[];
}

export interface IProfileComponentBinding {
  contextBindings: IPropertyBinding[];
  itemBindings: IProfileComponentItemBinding[];
}

export interface IProfileComponentItem {
  path: string;
  itemProperties: IItemProperty[];
}

export interface IProfileComponentItemBinding {
  path: string;
  bindings: IPropertyBinding[];
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
export interface IPropertyBinding extends IItemProperty {
  target: string;
}
export interface IPropertyPredicate extends IPropertyBinding {
  predicate: IPredicate;
  propertyKey: PropertyType.PREDICATE,
}
export interface IPropertyRef extends IItemProperty {
  ref: string,
  propertyKey: PropertyType.SEGMENTREF,
}

export interface IPropertySingleCode extends IPropertyBinding {
  internalSingleCode: InternalSingleCode,
  propertyKey: PropertyType.SINGLECODE,
}
export interface IPropertyUsage extends IItemProperty {
  usage: Usage,
  propertyKey: PropertyType.USAGE,
}
export interface IPropertyLengthType extends IItemProperty {
  type: LengthType,
  propertyKey: PropertyType.LENGTHTYPE,
}
export interface IPropertyValueSet extends IPropertyBinding {
  valuesetBindings: IValuesetBinding[],
  propertyKey: PropertyType.VALUESET
}

export interface IValuedPath {
  elementId: string;
  child?: IValuedPath;
  values?: IItemProperty[];
}
