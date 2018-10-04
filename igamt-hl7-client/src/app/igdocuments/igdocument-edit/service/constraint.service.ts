/**
 * Created by JYW on 10/2/18.
 */
import {Injectable}  from "@angular/core";
import {DatatypesService} from "../datatype-edit/datatypes.service";
import { _ }  from 'underscore';

@Injectable()
export  class ConstraintService{
  constructor(private datatypesService : DatatypesService,){
  }

  generateTreeData(assertion, treeData, idMap, datatypesLinks){
    if(assertion
        && assertion.subject
        && assertion.subject.path
        && assertion.subject.path.child) this.popTreeData(assertion.subject.path.child, treeData, idMap, datatypesLinks);

    if(assertion
        && assertion.complement
        && assertion.complement.path
        && assertion.complement.path.child) this.popTreeData(assertion.complement.path.child, treeData, idMap, datatypesLinks);

    if(assertion && assertion.ifAssertion) this.generateTreeData(assertion.ifAssertion, treeData, idMap, datatypesLinks);

    if(assertion && assertion.thenAssertion) this.generateTreeData(assertion.thenAssertion, treeData, idMap, datatypesLinks);

    if(assertion && assertion.child) this.generateTreeData(assertion.child, treeData, idMap, datatypesLinks);

    if(assertion && assertion.assertions) {
      for (let a of assertion.assertions) {
        this.generateTreeData(a, treeData, idMap, datatypesLinks);
      }
    }

  }

  popTreeData(currentPath, currentTreeNode, idMap, datatypesLinks){
    if(currentPath.elementId){
      var node = _.find(currentTreeNode, function(child){ return child.data.id === currentPath.elementId; });
      if(!node.leaf){
        this.loadNode(currentPath, node, idMap, datatypesLinks);
      }
    }
  }

  loadNode(currentPath, node, idMap, datatypesLinks) {
    if(node && !node.children) {
      this.datatypesService.getDatatypeStructure(node.data.dtId).then(dtStructure  => {
        dtStructure.children = _.sortBy(dtStructure.children, function(child){ return child.data.position});
        idMap[node.data.idPath].dtName = dtStructure.name;
        if(dtStructure.children){
          for (let child of dtStructure.children) {
            var childData =  JSON.parse(JSON.stringify(node.data.pathData));

            this.makeChild(childData, child.data.id, '1');

            var data = {
              id: child.data.id,
              name: child.data.name,
              max: "1",
              position: child.data.position,
              usage: child.data.usage,
              dtId: child.data.ref.id,
              idPath: node.data.idPath + '-' + child.data.id,
              pathData: childData
            };

            var treeNode = {
              label: child.data.position + '. ' + child.data.name,
              data:data,
              expandedIcon: "fa-folder-open",
              collapsedIcon: "fa-folder",
              leaf:false
            };

            var dt = this.getDatatypeLink(child.data.ref.id, datatypesLinks);

            if(dt.leaf) treeNode.leaf = true;
            else treeNode.leaf = false;

            idMap[data.idPath] = data;
            if(!node.children) node.children = [];
            node.children.push(treeNode);

          }
        }

        if(currentPath.child) this.popTreeData(currentPath.child, node.children, idMap, datatypesLinks);
      });
    }
  }


  makeChild(data, id, para){
    if(data.child) this.makeChild(data.child, id, para);
    else data.child = {
      elementId: id,
      instanceParameter: para
    }
  }

  getDatatypeLink(id, datatypesLinks){
    for (let dt of datatypesLinks) {
      if(dt.id === id) return JSON.parse(JSON.stringify(dt));
    }
    console.log("Missing DT:::" + id);
    return null;
  }
}
