/**
 * Created by hnt5 on 10/1/17.
 */

import {Injectable} from '@angular/core';
import {TreeNode} from 'primeng/components/common/treenode';
import {GeneralConfigurationService} from '../../service/general-configuration/general-configuration.service';
import {TocService} from '../../igdocuments/igdocument-edit/service/toc.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SegmentTreeNodeService {

  valueSetAllowedDTs: any[];
  valueSetAllowedComponents: any[];

  constructor(private http: HttpClient, private configService: GeneralConfigurationService, private tocService: TocService) {
    this.valueSetAllowedDTs = this.configService.valueSetAllowedDTs;
    this.valueSetAllowedComponents = this.configService.valueSetAllowedComponents;
  }

  decorateTree(tree: TreeNode[]) {
    if(tree) {
      for (let node of tree) {
        this.decorateNode(node, null);
      }
    }
  }

  decorateNode(node : TreeNode, parent: TreeNode) {
    node.label = node.data.name;
    node.data.index = node.data.position;
    node.data.obj =   node.data;
    node.data.path = (parent && parent.data && parent.data.path) ? parent.data.path + '.' + node.data.position + '[1]' : node.data.position + '[1]';
    node.leaf = node.data.datatypeLabel.leaf;
    // node.selectable = true;
    node.data.version = node.data.datatypeLabel.domainInfo.version;
    node.data.coded = this.configService.isCodedElement(node.data.datatypeLabel.label);
    node.data.variable = node.data.name === 'VARIES';
    node.data.complex = !node.leaf;

    if(node && node.children) {
      for(let child of node.children){
        this.decorateNode(child, node);
      }
    }
  }

  async getFieldsAsTreeNodes(segment, exclusion: any[]) {
    const nodes: TreeNode[] = [];
    const list = segment.structure.sort((x, y) => x.position - y.position);
    for (const field of list) {
      const node = await this.lazyNode(field.data, null, segment, exclusion);
      nodes.push(node);
    }
    return nodes.sort((a, b) => {
      return a.data.index - b.data.index;
    });
  }

  async lazyNode(element, parent, segment, exclusion) {
    const node: TreeNode = {};

    node.label = element.name;
    node.data = {
      index: element.position,
      obj: element,
      path: (parent && parent.data && parent.data.path) ? parent.data.path + '.' + element.position + '[1]' : element.position + '[1]',
    };

    if (element.ref.id) {
      const dt = await this.tocService.getDatatypeById(element.ref.id);
      node.leaf = !dt.data.lazyLoading;
      node.selectable = true;
      node.data.version = dt.data.domainInfo.version;
      node.data.coded = this.configService.isCodedElement(dt.data.label);
      node.data.variable = dt.data.label === 'VARIES';
      node.data.complex = !node.leaf;
    }

    return node;
  }

  async getComponentsAsTreeNodes(node, segment, exclusion) {
    const nodes: TreeNode[] = [];
    this.http.get('api/datatypes/' + node.data.obj.ref.id + '/structure').subscribe(async result => {
      const data = result as any;
      for (const d of data.children) {
        nodes.push(await this.lazyNode(d.data, node, segment, exclusion));
      }
    });
    return nodes.sort((a,b) => {
      return a.data.index - b.data.index;
    });
  }

}
