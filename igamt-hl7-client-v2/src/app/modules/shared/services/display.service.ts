import { Injectable } from '@angular/core';
import { Type } from '../constants/type.enum';
import { IDatatype } from '../models/datatype.interface';
import { IDisplayElement } from '../models/display-element.interface';
import { IResource } from '../models/resource.interface';
import { ISegment } from '../models/segment.interface';
import { IValueSet } from '../models/value-set.interface';

@Injectable({
  providedIn: 'root',
})
export class DisplayService {

  getDisplay(resource: IResource): IDisplayElement {
    switch (resource.type) {
      case Type.DATATYPE:
        return this.datatypeDisplay(resource as IDatatype);
      case Type.SEGMENT:
        return this.segmentDisplay(resource as ISegment);
      case Type.VALUESET:
        return this.valueSetDisplay(resource as IValueSet);
      default:
        return null;
    }
  }

  datatypeDisplay(resource: IDatatype): IDisplayElement {
    return {
      id: resource.id,
      domainInfo: resource.domainInfo,
      fixedName: resource.name,
      description: resource.description,
      differential: !!resource.origin,
      origin: resource.origin,
      parentId: resource.parentId,
      parentType: resource.parentType,
      variableName: resource.ext,
      leaf: !resource.components || resource.components.length === 0,
      type: resource.type,
      isExpanded: false,
    };
  }

  segmentDisplay(resource: ISegment): IDisplayElement {
    return {
      id: resource.id,
      domainInfo: resource.domainInfo,
      fixedName: resource.name,
      description: resource.description,
      differential: !!resource.origin,
      origin: resource.origin,
      parentId: resource.parentId,
      parentType: resource.parentType,
      variableName: resource.ext,
      leaf: !resource.children || resource.children.length === 0,
      type: resource.type,
      isExpanded: false,
    };
  }

  valueSetDisplay(resource: IValueSet): IDisplayElement {
    return {
      id: resource.id,
      domainInfo: resource.domainInfo,
      fixedName: undefined,
      description: resource.name,
      differential: !!resource.origin,
      origin: resource.origin,
      parentId: resource.parentId,
      parentType: resource.parentType,
      variableName: resource.bindingIdentifier,
      leaf: true,
      type: resource.type,
      isExpanded: false,
    };
  }

}
