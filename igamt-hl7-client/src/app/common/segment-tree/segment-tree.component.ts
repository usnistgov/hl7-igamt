/**
 * Created by hnt5 on 10/1/17.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core'
import {SegmentTreeNodeService} from "./segment-tree.service";
import {TreeNode} from "primeng/components/common/treenode";

@Component({
    selector : 'segment-tree',
    templateUrl : 'segment-tree.template.html'
})


export class SegmentTreeComponent {
    _segment : any;
    @Output() nodeSelect = new EventEmitter();
    tree : TreeNode[];

    constructor(private nodeService : SegmentTreeNodeService){

    }

    @Input() set segment(value : any){
        this._segment = value;
        this.initTree();
    }

    nodeSelected(event){
        if(event.node){
            this.nodeSelect.emit(event.node);
        }
    }

    loadNode(event){
        if(event.node){
            return this.nodeService.getComponentsAsTreeNodes(event.node, this._segment).then(nodes => event.node.children = nodes);
        }
    }

    initTree(){
        if(this._segment){
            this.nodeService.getFieldsAsTreeNodes(this._segment).then(result => {
                this.tree = result;
            });
        }
    }

    ngOnInit(){
        this.initTree();
    }


}
