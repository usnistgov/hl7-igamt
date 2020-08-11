import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Subscription } from 'rxjs';
import { Type } from '../../constants/type.enum';
import { IPath } from '../../models/cs.interface';
import { IResource } from '../../models/resource.interface';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../services/resource-repository.service';
import { TreeCloneService } from '../../services/tree-clone.service';
import { IHL7v2TreeFilter, TreeFilterService } from '../../services/tree-filter.service';
import { IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';

@Component({
  selector: 'app-structure-tree',
  templateUrl: './structure-tree.component.html',
  styleUrls: ['./structure-tree.component.scss'],
})
export class StructureTreeComponent implements OnInit, OnDestroy {

  type: Type;
  structure: TreeNode[];
  selectedNode: TreeNode;
  treeSubscriptions: Subscription[] = [];
  s_resource: Subscription;

  @Output()
  selection = new EventEmitter<{
    node: IHL7v2TreeNode,
    path: IPath,
  }>();

  @Input()
  configuration: {
    cardinality: boolean,
    usage: boolean,
  };

  @Input()
  repository: AResourceRepositoryService;

  @Input()
  restrictions: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [],
  };

  @Input()
  set resource(resource: IResource) {
    this.type = resource.type;
    this.close(this.s_resource);
    this.s_resource = this.treeService.getTree(resource, this.repository, true, true, (value) => {
      const tree = [
        {
          data: {
            id: resource.id,
            pathId: resource.id,
            name: resource.name,
            type: resource.type,
          },
          children: [...value],
          parent: undefined,
        },
      ];
      this.doFilter(tree as IHL7v2TreeNode[]);
    });
  }

  doFilter(tree: IHL7v2TreeNode[]) {
    this.structure = [
      ...this.treeFilterService.filterTree(tree, this.restrictions),
    ];
  }

  @Input()
  resourceType(t: Type) {
    this.type = t;
  }

  @Input()
  set tree(str: TreeNode[]) {
    const clone = this.treeCloneService.cloneViewTree(str);
    this.doFilter(clone as IHL7v2TreeNode[]);
  }

  @Input()
  set filter(restrictions: IHL7v2TreeFilter) {
    this.restrictions = {
      ...this.restrictions,
      ...restrictions,
    };

    if (this.structure) {
      this.doFilter(this.structure as IHL7v2TreeNode[]);
    }
  }

  constructor(
    private treeService: Hl7V2TreeService,
    private treeCloneService: TreeCloneService,
    private treeFilterService: TreeFilterService) {
    this.configuration = {
      cardinality: true,
      usage: true,
    };
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

  onNodeExpand(event, then?: (nodes: TreeNode[]) => void) {
    const subs = this.treeService.resolveReference(event.node, this.repository, true, () => {
      this.structure = [...this.structure];
      if (then) {
        then(this.structure);
      }
    }, (nodes: IHL7v2TreeNode[]) => {
      return this.treeFilterService.filterTree(nodes, this.restrictions);
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
