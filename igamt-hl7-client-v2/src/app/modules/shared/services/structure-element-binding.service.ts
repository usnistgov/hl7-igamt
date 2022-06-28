import { Injectable } from '@angular/core';
import { IHL7v2TreeNode } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { IStructureElementBinding, IStructureElementBindingProperties } from '../models/binding.interface';

export interface IBindingMap {
  [bindingPath: string]: IBindingNode[];
}

export interface IBindingContext {
  resource: Type;
  element?: Type;
}

export interface IBindingProperties {
  context: IBindingContext;
  level: number;
  props: IStructureElementBindingProperties;
}

export interface IBindingNode {
  context: IBindingContext;
  level: number;
  binding: IStructureElementBinding;
}

export interface IElementBinding {
  children: IBindingMap;
  values: IBindingValues;
}

export type IBindingValues = {
  [K in keyof IStructureElementBindingProperties]?: Array<IBinding<IStructureElementBindingProperties[K]>>
};

export interface IBinding<T> {
  context: IBindingContext;
  level: number;
  value: T;
}

@Injectable({
  providedIn: 'root',
})
export class StructureElementBindingService {

  constructor() { }

  getElementBinding(
    elementId: string,
    bindings: IStructureElementBinding[],
    context: IBindingContext,
    level: number,
    parent?: IHL7v2TreeNode,
  ): IElementBinding {
    return this.mergeBindingsForChild(
      parent ? parent.data.bindings.children[elementId] || [] : [],
      elementId,
      context,
      bindings,
      level,
    );
  }

  mergeBindingsForChild(
    fromParent: IBindingNode[],
    elementId: string,
    context: IBindingContext,
    resourceBindings: IStructureElementBinding[],
    childLevel: number,
  ): IElementBinding {

    // Get All Bindings of the current level (Resource)
    const elementBinding = resourceBindings.find((elm) => elm.elementId === elementId);
    const elementChildrenBindingsFromResource: IBindingNode[] = elementBinding ? elementBinding.children.map((elm) => {
      return {
        context,
        level: childLevel,
        binding: elm,
      };
    }) : [];
    // ---

    // Initialize elementBindingProperties with ones from resource
    const elementBindingProperties: IBindingProperties[] = elementBinding ? [{
      props: this.getBindingProperties(elementBinding),
      level: childLevel,
      context,
    }] : [];

    const fromParentChildrenBindings: IBindingNode[] = [];

    // For each binding comming from the parent node
    fromParent.forEach((bindingsNode) => {

      // Add its children to the fromParentChildrenBindings
      bindingsNode.binding.children.forEach((elm) => {
        fromParentChildrenBindings.push({
          context: bindingsNode.context,
          level: bindingsNode.level,
          binding: elm,
        });
      });

      // Add its properties to the elementBindingProperties
      elementBindingProperties.push({
        context: bindingsNode.context,
        level: bindingsNode.level,
        props: this.getBindingProperties(bindingsNode.binding),
      });
    });

    return {
      values: this.bindingValues(elementBindingProperties),
      children: this.formatBindings([...elementChildrenBindingsFromResource, ...fromParentChildrenBindings]),
    };
  }

  // Pick only the relevant properties from the StructureElementBinding
  getBindingProperties(binding: IStructureElementBinding): IStructureElementBindingProperties {
    return {
      valuesetBindings: binding.valuesetBindings,
      predicate: binding.predicate,
      internalSingleCode: binding.internalSingleCode,
      singleCodeBindings: binding.singleCodeBindings,
      changeLog: binding.changeLog,
    };
  }

  // Split List of binding properties into Object with a list of values for each property (ordered by level)
  bindingValues(properties: IBindingProperties[]): IBindingValues {
    const values: IBindingValues = {};

    const pick = (key: string, predicate: (properties: IStructureElementBindingProperties) => boolean) => {
      values[key] = properties.filter((property) => property.props[key] && predicate(property.props)).map((property) => {
        return {
          context: property.context,
          level: property.level,
          value: property.props[key],
        };
      }).sort((a, b) => {
        return a.level - b.level;
      });
    };

    pick('valuesetBindings', (property) => property.valuesetBindings.length > 0);
    pick('singleCodeBindings', (property) => property.singleCodeBindings && property.singleCodeBindings.length > 0);
    // pick('internalSingleCode', (property) => true);
    pick('predicate', (property) => true);
    pick('changeLog', (property) => property.changeLog && Object.keys(property.changeLog).length > 0);
    return values;
  }

  // Group list of binding nodes to map of binding nodes (key is element id, value is list of bindings)
  formatBindings(nodes: IBindingNode[]): IBindingMap {
    const payload: IBindingMap = {};
    nodes.forEach((node) => {
      if (!payload[node.binding.elementId]) {
        payload[node.binding.elementId] = [];
      }
      payload[node.binding.elementId].push({
        context: node.context,
        binding: node.binding,
        level: node.level,
      });
    });
    return payload;
  }

  contextIsEqual(a: IBindingContext, b: IBindingContext): boolean {
    return a.element === b.element && a.resource === b.resource;
  }

  getInEffectBinding<T>(bindingProperty: Array<IBinding<T>>, context: IBindingContext): IBinding<T> {
    const top = bindingProperty[0];
    return this.contextIsEqual(top.context, context) ? top : undefined;
  }

  getFrozenUnderneatBinding<T>(bindingProperty: Array<IBinding<T>>, context: IBindingContext): IBinding<T> {
    for (const binding of bindingProperty) {
      if (!this.contextIsEqual(binding.context, context)) {
        return binding;
      }
    }
    return undefined;
  }

  getActiveAndFrozenBindings<T>(bindingProperty: Array<IBinding<T>>, context: IBindingContext): {
    active: IBinding<T>,
    frozen: IBinding<T>,
  } {
    if (bindingProperty && bindingProperty.length > 0) {
      bindingProperty.sort((a, b) => {
        return a.level - b.level;
      });

      return {
        active: this.getInEffectBinding<T>(bindingProperty, context),
        frozen: this.getFrozenUnderneatBinding<T>(bindingProperty, context),
      };
    }
    return {
      active: undefined,
      frozen: undefined,
    };
  }

}
