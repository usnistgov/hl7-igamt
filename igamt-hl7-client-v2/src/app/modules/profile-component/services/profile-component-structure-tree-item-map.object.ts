import { IItemProperty, IProfileComponentItem, IPropertyBinding, IProfileComponentBinding } from "src/app/modules/shared/models/profile.component";
import { PropertyType } from "src/app/modules/shared/models/save-change";
import { IProfileComponentChange } from "../components/profile-component-structure-tree/profile-component-structure-tree.component";

export class ProfileComponentStructureTreeItemMap {
  public value: Record<string, Record<string, IItemProperty>>;

  constructor(items: IProfileComponentItem[], bindings: IProfileComponentBinding) {
    this.value = {};
    items.forEach((item) => {
      this.value[item.path] = {};
      item.itemProperties.forEach((prop) => this.addItemProperty(prop, item.path));
    });

    if (bindings) {
      bindings.contextBindings.forEach((binding) => {
        this.addItemProperty(binding);
      });
      bindings.itemBindings.forEach((binding) => {
        binding.bindings.forEach((prop) => this.addItemProperty(prop, binding.path));
      });
    }
  }

  has(location: string, ...props: PropertyType[]): boolean {
    if (!this.value) return false;
    if (!this.value[location]) return false;

    return props.map((p) => !!this.value[location][p]).includes(true);
  }

  update(change: IProfileComponentChange) {
    const target = this.getTargetPathByChange(change);
    const value = change.unset ? undefined : change.property;
    this.value[target] = {
      ...this.value[target],
      [change.type]: value,
    }
  }

  addItemProperty(property: IItemProperty, path?: string) {
    const target = this.getTargetPath(path, property);
    this.value[target] = {
      ...this.value[target],
      [property.propertyKey]: property,
    }
  }

  getTargetPath(path: string, property: IItemProperty): string {
    if (ProfileComponentStructureTreeItemMap.isPropertyBinding(property)) {
      return `${path ? `${path}-` : ''}${property.target}`
    } else {
      return path;
    }
  }

  getTargetPathByChange(change: IProfileComponentChange): string {
    if (change.target) {
      return `${change.root ? '' : `${change.path}-`}${change.target}`
    } else {
      return change.path;
    }
  }

  static isPropertyBinding(property: IItemProperty): property is IPropertyBinding {
    return property.propertyKey === PropertyType.PREDICATE ||
      property.propertyKey === PropertyType.VALUESET ||
      property.propertyKey === PropertyType.SINGLECODE;
  }

}
