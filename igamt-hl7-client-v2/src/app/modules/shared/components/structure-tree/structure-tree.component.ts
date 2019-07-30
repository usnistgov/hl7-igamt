import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Subscription } from 'rxjs';
import { Type } from '../../constants/type.enum';
import { IPath } from '../../models/cs.interface';
import { IResource } from '../../models/resource.interface';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../services/resource-repository.service';
import { IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';

export interface ITreeRestrictions {
  primitive?: boolean;
  datatypes?: string[];
  repeat?: boolean;
  usages?: string[];
  types?: string[];
}

@Component({
  selector: 'app-structure-tree',
  templateUrl: './structure-tree.component.html',
  styleUrls: ['./structure-tree.component.scss'],
})
export class StructureTreeComponent implements OnInit, OnDestroy {

  type: Type;
  structure: TreeNode[];
  selectedNode: TreeNode;

  @Input()
  configuration: {
    cardinality: boolean,
    usage: boolean,
  };
  @Input()
  repository: AResourceRepositoryService;
  @Output()
  selection = new EventEmitter<{
    node: IHL7v2TreeNode,
    path: IPath,
  }>();
  treeSubscriptions: Subscription[] = [];
  s_resource: Subscription;
  @Input()
  restrictions: ITreeRestrictions = {};

  constructor(private treeService: Hl7V2TreeService) {
    this.configuration = {
      cardinality: true,
      usage: true,
    };
  }

  @Input()
  set resource(resource: IResource) {
    this.type = resource.type;
    this.close(this.s_resource);
    this.s_resource = this.treeService.getTree(resource, this.repository, true, true, (value) => {
      this.structure = [
        {
          data: {
            id: resource.id,
            pathId: resource.id,
            name: resource.name,
            type: resource.type,
          },
          children: [...value.map((node) => this.evaluate(node, this.restrictions))],
          parent: undefined,
        },
      ];
    });
  }

  @Input()
  resourceType(t) {
    this.type = t;
  }

  @Input()
  set tree(str: TreeNode[]) {
    this.structure = str;
  }

  // tslint:disable-next-line: cognitive-complexity
  evaluate(node: IHL7v2TreeNode, restrictions: ITreeRestrictions) {
    let filter = true;
    const node_has_children = !node.leaf;
    const node_has_datatype = node.data.type === Type.FIELD || node.data.type === Type.COMPONENT;
    const node_datatype = node_has_datatype ? node.data.ref.getValue().id : undefined;
    const node_type = node.data.type;
    const node_repeats = node.data.cardinality ? (node.data.cardinality.max === '*' || +node.data.cardinality.max > 1) : false;
    const node_usage = node.data.usage ? node.data.usage.value : undefined;

    // --- Primitive Filter
    if (restrictions.primitive === undefined) {
      filter = filter && (restrictions.primitive || !node_has_children) && (!restrictions.primitive || node_has_children);
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

    return node;
  }

  pathList(node: IHL7v2TreeNode): IPath[] {
    if (node.parent) {
      const parentList = this.pathList(node.parent);
      parentList.push({
        elementId: node.data.id,
        instanceParameter: '*',
      });
      return parentList;
    } else {
      return [
        {
          elementId: node.data.id,
        },
      ];
    }
  }

  processPath(n: IHL7v2TreeNode): IPath {
    return this.pathList(n).reverse().reduce((pV, cV) => {
      cV.child = pV;
      return cV;
    });
  }

  onNodeExpand(event) {
    const subs = this.treeService.resolveReference(event.node, this.repository, true, () => {
      this.structure = [...this.structure];
    }, (nodes: IHL7v2TreeNode[]) => {
      return nodes.map((node) => {
        return this.evaluate(node, this.restrictions);
      });
    });
    if (subs) {
      this.treeSubscriptions.push(subs);
    }
  }

  nodeSelected(event) {
    if (event.node) {
      this.selectedNode = event.node;
      this.selection.emit({
        node: event.node,
        path: this.processPath(event.node),
      });
    }
  }

  ngOnDestroy() {
    for (const sub of this.treeSubscriptions) {
      this.close(sub);
    }
  }

  close(s: Subscription) {
    if (s && !s.closed) {
      s.unsubscribe();
    }
  }

  ngOnInit() {
  }

}
