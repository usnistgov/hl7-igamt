/**
 * Created by JyWoo on 12/4/17.
 */
import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Http} from "@angular/http";
import {PrimeDialogAdapter} from "../prime-ng-adapters/prime-dialog-adapter";
import {SelectItem} from 'primeng/primeng';

@Component({
    selector : 'datatype-binding-picker',
    templateUrl : 'datatype-binding-picker.template.html'
})
export class DatatypeBindingPickerComponent extends PrimeDialogAdapter  {
    public selectedDatatypeId : string = "";
    options: SelectItem[];
    selectedDatatype : any;

    constructor(private $http : Http){
        super();
    }

    select(){
        this.dismissWithData(this.selectedDatatype);
    }

    onDialogOpen(){
        let ctrl = this;
        this.options = [];
        this.getDatatypes().subscribe(datatypes => {
            if(datatypes){
                for(let dt of datatypes){
                    this.options.push({label:dt.label , value: dt});
                    if(this.selectedDatatypeId === dt.id) this.selectedDatatype = dt;
                }
            }
        });
    }

    ngOnInit(){
        this.hook(this);
    }

    getScopeLabel(leaf) {
        if (leaf) {
            if (leaf.scope === 'HL7STANDARD') {
                return 'HL7';
            } else if (leaf.scope === 'USER') {
                return 'USR';
            } else if (leaf.scope === 'MASTER') {
                return 'MAS';
            } else if (leaf.scope === 'PRELOADED') {
                return 'PRL';
            } else if (leaf.scope === 'PHINVADS') {
                return 'PVS';
            } else {
                return "";
            }
        }
    }
    hasSameVersion(element) {
        if (element) return element.hl7Version;
        return null;
    }

    getDatatypes() {
        return this.$http.get('api/datatype/').map(res => res.json());
    }
}
