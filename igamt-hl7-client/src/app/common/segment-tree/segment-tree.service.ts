/**
 * Created by hnt5 on 10/1/17.
 */

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {TreeNode} from 'primeng/components/common/treenode';
import {GeneralConfigurationService} from '../../service/general-configuration/general-configuration.service';
import {TocService} from '../../igdocuments/igdocument-edit/service/toc.service';
import * as _ from 'lodash';

@Injectable()
export class SegmentTreeNodeService {

  valueSetAllowedDTs: any[];
  valueSetAllowedComponents: any[];

  constructor(private http: Http, private configService: GeneralConfigurationService, private tocService: TocService) {
    this.valueSetAllowedDTs = this.configService.valueSetAllowedDTs;
    this.valueSetAllowedComponents = this.configService.valueSetAllowedComponents;
  }

  async getFieldsAsTreeNodes(segment, exclusion: any[]) {
    const nodes: TreeNode[] = [];
    const list = segment.children.sort((x, y) => x.position - y.position);
    for (const field of list) {
      const node = await this.lazyNode(field.data, null, segment, exclusion);
      nodes.push(node);
    }
    return nodes;
  }

  async lazyNode(element, parent, segment, exclusion) {
    const node: TreeNode = {};

    node.label = element.name;
    node.data = {
      index: element.position,
      obj: element,
      path: (parent && parent.data && parent.data.path) ? parent.data.path + '.' + element.position : element.position + '',
    };

    if (element.ref.id) {
      const dt = await this.tocService.getDatatypeById(element.ref.id);
      node.leaf = !dt.data.lazyLoading;
      node.selectable = true;
      node.data.version = dt.data.domainInfo.version;
      node.data.coded = this.configService.isCodedElement(dt.data.label);
      node.data.variable = element.ref.id.includes('VARIES');
    }

    return node;
  }

  async getComponentsAsTreeNodes(node, segment, exclusion) {
    const nodes: TreeNode[] = [];
    this.http.get('api/datatypes/' + node.data.obj.ref.id + '/structure')
    .map(res => res.json()).subscribe(async data => {
      for (const d of data.children) {
        nodes.push(await this.lazyNode(d.data, node, segment, exclusion));
      }
    });
    return nodes;
  }

}
