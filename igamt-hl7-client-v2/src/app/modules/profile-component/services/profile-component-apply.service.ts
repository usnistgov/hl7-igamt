import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  IHL7v2TreeNode,
  IResourceRef,
} from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {
  IItemProperty,
  IProfileComponentContext,
  IProfileComponentItem,
  IPropertyCardinalityMax,
  IPropertyCardinalityMin,
  IPropertyUsage,
} from '../../shared/models/profile.component';
import { PropertyType } from '../../shared/models/save-change';
import { PathService } from '../../shared/services/path.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileComponentApplyService {

  constructor(
    private pathService: PathService,
  ) { }

  public apply(node: IHL7v2TreeNode, context: IProfileComponentContext) {
    return this.applyItems(node, context.profileComponentItems);
  }

  public applyItems(node: IHL7v2TreeNode, allItems: IProfileComponentItem[]) {
    const items = this.getApplicableItems(node, allItems);
    const propertyList = this.flatten(items);
    const properties: Record<PropertyType, IItemProperty> = propertyList.reduce((acc, item) => {
      return {
        ...acc,
        [item.propertyKey]: item,
      };
    }, {} as Record<PropertyType, IItemProperty>);
    node.data.profileComponentOverrides.next(properties);
  }

  public applyRef(node: IHL7v2TreeNode, ref: IResourceRef) {
    if (node.data.ref) {
      node.data.ref.next(ref);
    } else {
      node.data.ref = new BehaviorSubject(ref);
    }
  }

  public applyCardinality(node: IHL7v2TreeNode, properties: Record<PropertyType, IItemProperty>) {
    if (properties[PropertyType.CARDINALITYMAX] && properties[PropertyType.CARDINALITYMIN]) {
      node.data.cardinality = {
        min: (properties[PropertyType.CARDINALITYMIN] as IPropertyCardinalityMin).min,
        max: (properties[PropertyType.CARDINALITYMAX] as IPropertyCardinalityMax).max,
      };
    }
  }

  public applyUsage(node: IHL7v2TreeNode, properties: Record<PropertyType, IItemProperty>) {
    if (properties[PropertyType.USAGE]) {
      node.data.usage = {
        value: (properties[PropertyType.USAGE] as IPropertyUsage).usage,
      };
    }
  }

  public flatten(items: IProfileComponentItem[]): IItemProperty[] {
    const result: IItemProperty[] = [];
    for (const item of items) {
      result.push(...item.itemProperties);
    }
    return result;
  }

  public getApplicableItems(node: IHL7v2TreeNode, items: IProfileComponentItem[]): IProfileComponentItem[] {
    const pathId: string = this.pathService.pathToString(node.data.rootPath);
    return items.filter((item) => {
      return item.path === pathId;
    });
  }

}
