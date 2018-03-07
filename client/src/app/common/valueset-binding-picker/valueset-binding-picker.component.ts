/**
 * Created by hnt5 on 10/4/17.
 */
import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Http} from "@angular/http";
import {PrimeDialogAdapter} from "../prime-ng-adapters/prime-dialog-adapter";
import {VSValue} from "./vsvalue.interface";

@Component({
    selector : 'valueset-binding-picker',
    templateUrl : 'valueset-binding-picker.template.html'
})
export class ValueSetBindingPickerComponent extends PrimeDialogAdapter  {

    public libraryId : string = "";
    tables : any[];
    selectedTables : any[] = [];
    bindingStrength : any[];
    bindingLocation : any[];

    constructor(private $http : Http){
        super();
    }

    select(){
        this.dismissWithData(this.transform(this.selectedTables));
    }

    transform(list){
        let selected : VSValue[] = [];
        for(let vs of list){
            if(vs.hasOwnProperty('bindingStrength') && vs.hasOwnProperty('bindingLocation')){
                selected.push({
                    bindingIdentifier : vs.bindingIdentifier,
                    bindingLocation : vs.bindingLocation,
                    bindingStrength : vs.bindingStrength,
                    hl7Version : vs.hl7Version,
                    name : vs.name,
                    scope : vs.scope
                });
            }
        }
        return selected;
    }

    onDialogOpen(){
        let ctrl = this;
        this.$http.get('api/table-library/' + this.libraryId + '/tables').toPromise().then(function(response) {
            ctrl.tables = response.json();
        });
    }

    ngOnInit(){
        // Load Table
        this.hook(this);
        this.bindingStrength = [
            {
                label : 'R',
                value : 'R'
            },
            {
                label : 'S',
                value : 'S'
            }
        ];
        this.bindingLocation = [
            {
                label : '1',
                value : '1'
            },
            {
                label : '1 or 4',
                value : '1:4'
            }
        ];

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
}
