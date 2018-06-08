import {Component, Input, OnInit} from '@angular/core';
import {CCSelectorType, CellTemplate} from '../coconstraint.domain';
import {PrimeDialogAdapter} from '../../../../../common/prime-ng-adapters/prime-dialog-adapter';

@Component({
    selector : 'app-cc-header-dialog-dm',
    templateUrl : 'header-dialog-dm.template.html'
})
export class CCHeaderDialogDmComponent extends PrimeDialogAdapter implements OnInit {

    _segment: any = {};
    header = '';
    selectorTypes: any[];
    node: any;
    type: any = null;
    fixed = false;

    constructor() {
        super();
    }

    @Input() set segment(val: any){
        this._segment = val;
    }

    setNode(node) {
        if (node.data.obj.datatype.name.includes('VARIES')) {
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
            id : this.node.path,
            label : this._segment.name + '-' + this.node.path,
            template : this.node.obj.datatype.name.includes('VARIES') ? CellTemplate.VARIES : null,
            content : {
                elmType: this.node.obj.type,
                path: this.node.path,
                type: this.type
            }
        };
        this.dismissWithData(value);
    }

    dismiss() {
        this.dismissWithNoData();
    }

    onDialogOpen() {

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
