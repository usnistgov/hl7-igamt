import {Type} from '../constants/type.enum';
import {Usage} from '../constants/usage.enum';
import {IExternalSingleCode, IValuesetBinding} from './binding.interface';
import {IComment} from './comment.interface';
import {IResource} from './resource.interface';
import {PropertyType} from './save-change';
import {IDynamicMappingInfo} from './segment.interface';

export interface IProfileComponent extends IResource {
  children?: IProfileComponentContext;
}
export interface IProfileComponentContext {
  id: string;
  level: Type;
  sourceId: string;
  structure: string;
  position: number;
  profileComponentItems:  IProfileComponentItem[];
}
export interface IProfileComponentItem {
  path: string;
  itemProperties: ItemProperty[];
}

export class ItemProperty {
  constructor(public propertyKey: PropertyType ) {
  }
}
export class PropertyCardinalityMax extends ItemProperty {
  constructor( public max: string ) {
    super(PropertyType.CARDINALITYMAX);
  }
}
export class PropertyCardinalityMin extends ItemProperty {
  constructor( public min: number ) {
    super(PropertyType.CARDINALITYMIN);
  }
}
export class PropertyComment extends ItemProperty {
  constructor( public comment: IComment[] ) {
    super(PropertyType.COMMENT);
  }
}
export class PropertyConfLength extends ItemProperty {
  constructor( public confLength: string ) {
    super(PropertyType.CONFLENGTH);
  }
}
export class PropertyConformanceStatement extends ItemProperty {
  constructor( public constraintId: string, private description: string, private assertionScript: string ) {
    super(PropertyType.STATEMENT);
  }
}
export class PropertyConstantValue extends ItemProperty {
  constructor( public constantValue: string ) {
    super(PropertyType.CONSTANTVALUE);
  }
}
export class PropertyDatatype extends ItemProperty {
  constructor( public datatypeId: string ) {
    super(PropertyType.DATATYPE);
  }
}
export class PropertyDefinitionText extends ItemProperty {
  constructor( public definitionText: string ) {
    super(PropertyType.DEFINITIONTEXT);
  }
}
export class PropertyDynamicMapping extends ItemProperty {
  constructor( public dynamicMappingInfo: IDynamicMappingInfo ) {
    super(PropertyType.DYNAMICMAPPINGITEM);
  }
}
export class PropertyLengthMax extends ItemProperty {
  constructor( public max: string ) {
    super(PropertyType.LENGTHMAX);
  }
}
export class PropertyLengthMin extends ItemProperty {
  constructor( public min: string ) {
    super(PropertyType.LENGTHMIN);
  }
}
export class PropertyName extends ItemProperty {
  constructor( public name: string ) {
    super(PropertyType.NAME);
  }
}
export class PropertyPredicate extends ItemProperty {
  constructor( public trueUsage: Usage, public falseUsage: Usage, public constraintTarget: string, public description: string, public assertion: string ) {
    super(PropertyType.PREDICATE);
  }
}
export class PropertyRef extends ItemProperty {
  constructor( public ref: string ) {
    super(PropertyType.SEGMENTREF);
  }
}
export class PropertySingleCode extends ItemProperty {
  constructor( public singleCodeId: string, public externalSingleCode: IExternalSingleCode ) {
    super(PropertyType.SINGLECODE);
  }
}
export class PropertyUsage extends ItemProperty {
  constructor( public usage: Usage ) {
    super(PropertyType.USAGE);
  }
}
export class PropertyValueSet extends ItemProperty {
  constructor( public valuesetBinding: IValuesetBinding[] ) {
    super(PropertyType.VALUESET);
  }
}
export interface IValuedPath {
  elementId: string;
  child?: IValuedPath;
  values?: ItemProperty[];
}
