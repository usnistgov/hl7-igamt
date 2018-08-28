import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {CCSelectorType, CellTemplate} from '../coconstraint.domain';
import {PrimeDialogAdapter} from '../../../../../common/prime-ng-adapters/prime-dialog-adapter';
import {CCHeaderDialogUserComponent} from './header-dialog-user.component';
import {SegmentTreeComponent} from '../../../../../common/segment-tree/segment-tree.component';
import * as _ from 'lodash';

@Component({
    selector : 'app-cc-header-dialog-dm',
    templateUrl : 'header-dialog-dm.template.html'
})
export class CCHeaderDialogDmComponent extends PrimeDialogAdapter implements OnInit {

    _segment: any = {};
    header = '';
    selectorTypes: any[];
    selectedPaths = [];
    node: any;
    type: any = null;
    fixed = false;
    @ViewChild(SegmentTreeComponent) segmentTree: SegmentTreeComponent;

    constructor() {
        super();
    }

    @Input() set segment(val: any){
        this._segment = val;
    }

    setNode(node) {
        if (node.data.variable) {
            this.type = CCSelectorType.IGNORE;
            this.fixed = true;
        } else {
            this.type = this.type === CCSelectorType.IGNORE ? null : this.type;
            this.fixed = false;
        }
        this.node = node.data;
    }

    addHeader() {
        const value = {
            id : this.node.path + ':' + this.type,
            label : this._segment.name + '-' + this.node.path,
            template : this.node.variable ? CellTemplate.VARIES : null,
            content : {
                elmType: this.node.obj.type,
                path: this.node.path,
                type: this.type,
                version : this.node.version,
                coded : this.node.coded,
                varies : this.node.variable,
                complex : this.node.complex
            }
        };
        this.dismissWithData(value);
    }

    dismiss() {
        this.dismissWithNoData();
    }

    onDialogOpen() {
      this.segmentTree.updateTree(this.selectedPaths);
    }

    validateSelection() {
      const node = this.getSelectedNode(this.node ? this.node.path : '', this.selectedPaths);
      return !node;
    }

    getSelectedNode(path: string, exclusion: any[]): any {
      return _.find(exclusion, function(selected){
        return path.toLowerCase() === selected.path.toLowerCase();
      });
    }

    ngOnInit() {
        super.hook(this);
        this.selectorTypes = [
            {
                label : 'Constant',
                value : CCSelectorType.VALUE
            },
            {
                label : 'Value Set',
                value : CCSelectorType.VALUESET
            }
        ];
    }
}
