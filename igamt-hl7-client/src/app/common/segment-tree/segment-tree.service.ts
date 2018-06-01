/**
 * Created by hnt5 on 10/1/17.
 */

import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {TreeNode} from "primeng/components/common/treenode";
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";
import * as _ from 'underscore';

@Injectable()
export class SegmentTreeNodeService {

  valueSetAllowedDTs : any[];
  valueSetAllowedComponents : any[];

  constructor(private http: Http, private configService : GeneralConfigurationService) {
    this.valueSetAllowedDTs = this.configService.valueSetAllowedDTs;
    this.valueSetAllowedComponents = this.configService.valueSetAllowedComponents;
  }

  async getFieldsAsTreeNodes(segment) {
    let nodes: TreeNode[] = [];
    let list = segment.fields.sort((x, y) => x.position - y.position);
    for (let field of list) {
      let node = this.lazyNode(field, null, segment);
      nodes.push(node);
    }
    return nodes;
  }

  lazyNode(element, parent, segment) {
    let node: TreeNode = {};

    node.label = element.name;
    node.data = {
      index: element.position,
      obj: element,
      path: (parent && parent.data && parent.data.path) ? parent.data.path + '.' + element.position : element.position + ''
    };

    if(element.datatype){
      this.getDatatypeMetadata(element.datatype.id).subscribe(meta => {
        if(meta){
          element.datatype = meta;
          if(meta.numOfChildren && meta.numOfChildren > 0){
            node.leaf = false;
          }else {
            node.leaf = true;
          }
        }
      });
    }

    if(!parent){
      this.populateSegmentBinding(segment, node);
    }else if(parent && parent.data.obj.type === 'field') {
      node.data.fieldDT = parent.data.obj.datatype;
      this.populateSegmentBinding(segment, node);
      this.populateFieldDTBinding(node.data.fieldDT, node);
    }else if (parent && parent.data.obj.type === 'component') {
      node.data.fieldDT = parent.data.fieldDT;
      node.data.componentDT = parent.data.obj.datatype;
      this.populateSegmentBinding(segment, node);
      this.populateFieldDTBinding(node.data.fieldDT, node);
      this.populateComponentDTBinding(node.data.componentDT, node);
    }

    node.data.isAvailableForValueSet = this.isAvailableForValueSet(node);
    node.selectable = true;
    return node;
  }

  populateSegmentBinding(segment, node){
    node.data.segmentValueSetBindings = [];
    node.data.fieldDTValueSetBindings = [];
    node.data.componentDTValueSetBindings = [];
    if(segment && segment.valueSetBindings){
      for(let binding of segment.valueSetBindings){
        if(node.data.path === binding.location){
          if(binding.type === 'valueset'){
            this.getValueSetMetadata(binding.tableId).subscribe(meta => {
              if(meta) {
                node.data.segmentValueSetBindings.push(meta);
              }
            });
          }else if(binding.type === 'singlecode'){

          }
        }
      }
    }
  }

  populateFieldDTBinding(fieldDT, node){
    node.data.segmentValueSetBindings = [];
    node.data.fieldDTValueSetBindings = [];
    node.data.componentDTValueSetBindings = [];
    this.getDatatype(fieldDT.id).subscribe(fieldDT => {
      if(fieldDT && fieldDT.valueSetBindings) {
        for(let binding of fieldDT.valueSetBindings){
          var pathSplit = node.data.path.split(".");
          if(pathSplit.length === 2){
            if(pathSplit[1] === binding.location){
              if(binding.type === 'valueset'){
                this.getValueSetMetadata(binding.tableId).subscribe(meta => {
                  if(meta) node.data.fieldDTValueSetBindings.push(meta);
                });
              }else if(binding.type === 'singlecode'){

              }
            }
          }else if(pathSplit.length === 3){
            if(pathSplit[1] + '.' +  pathSplit[2] === binding.location){
              if(binding.type === 'valueset'){
                this.getValueSetMetadata(binding.tableId).subscribe(meta => {
                  if(meta) node.data.fieldDTValueSetBindings.push(meta);
                });
              }else if(binding.type === 'singlecode'){

              }
            }
          }
        }
      }
    });
  }

  populateComponentDTBinding(componentDT, node){
    node.data.segmentValueSetBindings = [];
    node.data.fieldDTValueSetBindings = [];
    node.data.componentDTValueSetBindings = [];
    this.getDatatype(componentDT.id).subscribe(componentDT => {
      if(componentDT && componentDT.valueSetBindings) {
        for(let binding of componentDT.valueSetBindings){
          var pathSplit = node.data.path.split(".");
          if(pathSplit[2] === binding.location){
            if(binding.type === 'valueset'){
              this.getValueSetMetadata(binding.tableId).subscribe(meta => {
                if(meta) node.data.componentDTValueSetBindings.push(meta);
              });
            }else if(binding.type === 'singlecode'){

            }
          }
        }
      }
    });
  }

  async getComponentsAsTreeNodes(node, segment) {
    let nodes: TreeNode[] = [];
    this.http.get('api/datatype/'+node.data.obj.datatype.id)
    .map(res => res.json()).subscribe(data => {
      for (let d of data.components) {
        nodes.push(this.lazyNode(d, node, segment));
      }
    });
    return nodes;
  }

  getDatatypeMetadata(id) {
    return this.http.get('api/datatype/metadata/' + id).map(res => res.json());
  }

  getDatatype(id) {
    return this.http.get('api/datatype/' + id).map(res => res.json());
  }

  getValueSetMetadata(id) {
    return this.http.get('api/table/metadata/' + id).map(res => res.json());
  }

  getDatatypes() {
    return this.http.get('api/datatype/').map(res => res.json());
  }

  isAvailableForValueSet(node){
    if(node && node.data.obj.datatype){
      if(_.find(this.valueSetAllowedDTs, function(valueSetAllowedDT){
          return valueSetAllowedDT == node.data.obj.datatype.name;
        })) return true;
    }
    if(node && node.data.obj.fieldDT && !node.data.obj.componentDT){
      var pathSplit = node.data.path.split(".");
      if(_.find(this.valueSetAllowedComponents, function(valueSetAllowedComponent){
          return valueSetAllowedComponent.dtName == node.data.obj.fieldDT.name && valueSetAllowedComponent.location == pathSplit[1];
        })) return true;
    }
    if(node && node.componentDT){
      var pathSplit = node.data.path.split(".");
      if(_.find(this.valueSetAllowedComponents, function(valueSetAllowedComponent){
          return valueSetAllowedComponent.dtName == node.componentDT.name && valueSetAllowedComponent.location == pathSplit[2];
        })) return true;
    }
    return false;
  }
}
