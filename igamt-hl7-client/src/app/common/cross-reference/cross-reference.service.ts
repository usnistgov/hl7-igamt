import { Injectable } from '@angular/core';
import {TreeModel, TreeNode} from "angular-tree-component";
import {RelationShip} from "../relationship/relationship";

@Injectable()
export class CrossReferenceService {

  constructor() {
  }

  getReferenceNodes(relations : RelationShip[], treeModel: TreeModel){

    let nodes: TreeNode[] = [];

    for(let i =0; i < relations.length ; i++){

      if(relations[i].child.id){

        let node =treeModel.getNodeById(relations[i].child.id);
        if(node){
          nodes.push(node);
        }
      }

    }
  };






}
