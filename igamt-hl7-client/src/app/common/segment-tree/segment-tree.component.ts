/**
 * Created by hnt5 on 10/1/17.
 */
import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {SegmentTreeNodeService} from './segment-tree.service';
import {TreeNode} from 'primeng/components/common/treenode';

@Component({
    selector : 'app-segment-tree',
    templateUrl : 'segment-tree.template.html'
})


export class SegmentTreeComponent implements OnInit {
    _segment: any;
    _excluded: string[];
    @Output() nodeSelect = new EventEmitter();
    tree: TreeNode[];

    constructor(private nodeService: SegmentTreeNodeService) {

    }

    @Input() set excluded(value: any[]){
        this._excluded = value;
        console.log(value);
    }

    @Input() set segment(value: any){
      this._segment = value;
      this.initTree(this._excluded);
    }

    nodeSelected(event){
        if(event.node){
            this.nodeSelect.emit(event.node);
        }
    }

    updateTree(excluded: any[]) {
      this.initTree(excluded);
    }

    loadNode(event) {
        if (event.node) {
            return this.nodeService.getComponentsAsTreeNodes(event.node, this._segment, this._excluded).then(nodes => event.node.children = nodes);
        }
    }

    initTree(l: string[]) {
        if (this._segment) {
            this.nodeService.getFieldsAsTreeNodes(this._segment, l).then(result => {
                this.tree = result;
            });
        }
    }

    ngOnInit() {
        this.initTree(this._excluded);
    }


}
