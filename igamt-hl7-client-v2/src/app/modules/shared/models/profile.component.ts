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
  constructor( private max: string ) {
    super(PropertyType.CARDINALITYMAX);
  }
}
export class PropertyCardinalityMin extends ItemProperty {
  constructor( private min: string ) {
    super(PropertyType.CARDINALITYMIN);
  }
}
export class PropertyComment extends ItemProperty {
  constructor( comment: IComment ) {
    super(PropertyType.COMMENT);
  }
}
export class PropertyConfLength extends ItemProperty {
  constructor( private confLength: string ) {
    super(PropertyType.CONFLENGTH);
  }
}
export class PropertyConformanceStatement extends ItemProperty {
  constructor( private constraintId: string, private description: string, private assertionScript: string ) {
    super(PropertyType.STATEMENT);
  }
}
export class PropertyConstantValue extends ItemProperty {
  constructor( private constantValue: string ) {
    super(PropertyType.CONSTANTVALUE);
  }
}
export class PropertyDatatype extends ItemProperty {
  constructor( private datatypeId: string ) {
    super(PropertyType.DATATYPE);
  }
}
export class PropertyDefinitionText extends ItemProperty {
  constructor( private definitionText: string ) {
    super(PropertyType.DEFINITIONTEXT);
  }
}
export class PropertyDynamicMapping extends ItemProperty {
  constructor( private dynamicMappingInfo: IDynamicMappingInfo ) {
    super(PropertyType.DYNAMICMAPPINGITEM);
  }
}
export class PropertyLengthMax extends ItemProperty {
  constructor( private max: string ) {
    super(PropertyType.LENGTHMAX);
  }
}
export class PropertyLengthMin extends ItemProperty {
  constructor( private min: string ) {
    super(PropertyType.LENGTHMIN);
  }
}
export class PropertyName extends ItemProperty {
  constructor( private name: string ) {
    super(PropertyType.NAME);
  }
}
export class PropertyPredicate extends ItemProperty {
  constructor( private trueUsage: Usage, private falseUsage: Usage, private constraintTarget: string, private description: string, private assertion: string ) {
    super(PropertyType.PREDICATE);
  }
}
export class PropertyRef extends ItemProperty {
  constructor( private ref: string ) {
    super(PropertyType.SEGMENTREF);
  }
}
export class PropertySingleCode extends ItemProperty {
  constructor( private singleCodeId: string, private externalSingleCode: IExternalSingleCode ) {
    super(PropertyType.SINGLECODE);
  }
}
export class PropertyUsage extends ItemProperty {
  constructor( private usage: Usage ) {
    super(PropertyType.USAGE);
  }
}
export class PropertyValueSet extends ItemProperty {
  constructor( private valuesetBinding: IValuesetBinding[] ) {
    super(PropertyType.VALUESET);
  }
}
