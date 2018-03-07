import {Component, Input} from "@angular/core";
import {CCSelectorType} from "../coconstraint.domain";
import {PrimeDialogAdapter} from "../../../../../../common/prime-ng-adapters/prime-dialog-adapter";

@Component({
    selector : 'cc-header-dialog-dm',
    templateUrl : 'header-dialog-dm.template.html'
})
export class CCHeaderDialogDm extends PrimeDialogAdapter {

    _segment : any = {};
    header : string = "";

    selectorTypes : any[];
    node : any;
    type : any = null;
    fixed : boolean = false;

    constructor(){
        super();
    }

    @Input() set segment(val : any){
        this._segment = val;
    }

    setNode(node){
        this.node = node.data;
    }

    addHeader(){
        this.dismissWithData({
            id : this.node.path,
                label : this._segment.name + '-' + this.node.path,
            content : {
                elmType: this.node.obj.type,
                path: this.node.path,
                type: this.type
            }
        });
    }

    dismiss(){
        this.dismissWithNoData();
    }

    onDialogOpen(){

    }

    ngOnInit(){
        this.hook(this);
        this.selectorTypes = [
            {
                label : "Constant",
                value : CCSelectorType.ByValue
            },
            {
                label : "Value Set",
                value : CCSelectorType.ByValueSet
            }
        ];
    }
}
