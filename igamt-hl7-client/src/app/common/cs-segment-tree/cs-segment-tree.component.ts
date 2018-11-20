import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {GeneralConfigurationService} from '../../service/general-configuration/general-configuration.service';


export interface TreeRestrictions {
  primitive: boolean;
  datatypes: string[];
  repeat: boolean;
  usages:  string[];
  types: string[];
}


@Component({
  selector: 'app-cs-segment-tree',
  templateUrl: './cs-segment-tree.component.html',
  styleUrls: ['./cs-segment-tree.component.css']
})
export class CsSegmentTreeComponent implements OnInit {

  _tree: TreeNode[];
  _restrictions: TreeRestrictions;
  selectedNode: TreeNode;
  @Output() select: EventEmitter<any> = new EventEmitter<any>();


  constructor(private configService: GeneralConfigurationService) {}

  @Input() set restrictions(restrictions: TreeRestrictions){
    this._restrictions = restrictions;
    if (this._tree && this._tree.length > 0) {
      this.evaluate(null, this._tree[0], restrictions);
    }
  }

  @Input() set tree(tree: any){
    const node: TreeNode = {
      label: tree.label,
      type: 'root',
      data: {
        id: tree.id.id,
        type: 'SEGMENT',
        version: tree.version,
        scope: tree.scope
      },
      children : this.configService.arraySortByPosition(tree.structure)
    };
    if (this._restrictions) {
      this.evaluate(null, node, this._restrictions);
    }

    this._tree = [node];
  }

  evaluate(parent: TreeNode, node: TreeNode, restrictions: TreeRestrictions) {
    let filter = true;
    node.parent = parent;
    node.data.container = false;
    const node_has_children = !(!node.children || node.children.length === 0);
    const node_has_datatype = node.data.datatypeLabel &&  node.data.datatypeLabel.name && node.data.datatypeLabel.name !== '';
    const node_datatype = node_has_datatype ? node.data.datatypeLabel.name.toUpperCase() : '';
    const node_type = node.data.type.toUpperCase();
    const node_repeats = node.data.max ? (node.data.max === '*' || +node.data.max > 1) : false;
    const node_usage = node.data.usage ? node.data.usage.toUpperCase() : '';

    // --- Primitive Filter
    if (restrictions.primitive !== undefined) {
      filter = filter && (!restrictions.primitive || !node_has_children) && (restrictions.primitive || node_has_children);
    }

    // --- Datatypes Filter
    if (restrictions.datatypes !== undefined && restrictions.datatypes.length > 0) {
      filter = filter && (!node_has_datatype || restrictions.datatypes.indexOf(node_datatype) !== -1);
    }

    // --- Elm type Filter
    if (restrictions.types !== undefined && restrictions.types.length > 0) {
      filter = filter && (restrictions.types.indexOf(node_type) !== -1);
    }

    // --- Repeat Filter
    if (restrictions.repeat !== undefined) {
      filter = filter && (!restrictions.repeat || node_repeats) && (restrictions.repeat || !node_repeats);
    }

    // --- Usage Filter
    if (restrictions.usages !== undefined && restrictions.usages.length > 0 && node.data.usage) {
      filter = filter && (restrictions.usages.indexOf(node_usage) !== -1);
    }
    node.selectable = filter;
    if (filter && parent) {
      parent.data.container = true;
    }
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        this.evaluate(node, child, restrictions);
      }
    }
  }

  markParent(node: TreeNode, b: boolean) {
    if (node.parent) {
      console.log("PARENT");
      node.parent.data.container = b;
      this.markParent(node.parent, b);
    }
  }



  selected(event) {
    this.selectedNode = event.node;
    this.select.emit([event.node, this.processPath(event.node)]);
  }

  processPath(n: TreeNode) {
    return this.pathList(n).reverse().reduce((pV, cV) => {
      cV.child = pV;
      return cV;
    });
  }

  pathList(node: TreeNode) {
    if (node.parent) {
      const parentList = this.pathList(node.parent);
      parentList.push({
        elementId: node.data.id,
        instanceParameter: '*'
      });
      return parentList;
    } else {
      return [
        {
          elementId: node.data.id,
        }
      ];
    }
  }

  ngOnInit() {

  }

}
