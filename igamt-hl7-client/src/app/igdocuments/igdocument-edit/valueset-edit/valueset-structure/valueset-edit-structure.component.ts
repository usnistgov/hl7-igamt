/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {ValuesetsService} from "../valuesets.service";
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import { _ } from 'underscore';
import * as __ from 'lodash';
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {IgErrorService} from "../../ig-error/ig-error.service";

@Component({
  selector : 'valueset-edit',
  templateUrl : './valueset-edit-structure.component.html',
  styleUrls : ['./valueset-edit-structure.component.css']
})
export class ValuesetEditStructureComponent implements WithSave{
    currentUrl:any;
    valuesetId:any;
    valuesetStructure:any;
    extensibilityOptions:any;
    stabilityOptions:any;
    contentDefinitionOptions:any;
    codeUsageOptions:any;

    codeSystemOptions: any = [];

    displayDialog: boolean;
    newCodeSysDialog: boolean;
    newCode :any = {};
    newCodeSys:any = {};

    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private valuesetsService : ValuesetsService, private configService : GeneralConfigurationService, private igErrorService:IgErrorService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.extensibilityOptions = this.configService._extensibilityOptions;
        this.stabilityOptions = this.configService._stabilityOptions;
        this.contentDefinitionOptions = this.configService._contentDefinitionOptions;
        this.codeUsageOptions = this.configService._codeUsageOptions;

        this.valuesetId = this.route.snapshot.params["valuesetId"];
        this.route.data.map(data =>data.valuesetStructure).subscribe(x=>{
            this.valuesetStructure = x;
            this.genCodeSysOption();
            this.backup=__.cloneDeep(this.valuesetStructure);
        });
    }

    reset(){
        this.valuesetStructure=__.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.valuesetStructure;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return true;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.valuesetsService.saveValuesetStructure(this.valuesetId, this.valuesetStructure).then(saved => {
                    this.backup = __.cloneDeep(this.valuesetStructure);
                    this.editForm.control.markAsPristine();
                    resolve(true);
                }, error => {
                    console.log("error saving");
                    reject(error);
                }
            );
        })
    }

    findCodeSysIdentifier(codesys){
        if(codesys){
            for (let entry of this.valuesetStructure.displayCodeSystems) {
                if(entry.codeSysRef === codesys.ref) return entry.identifier;
            }
        }
        return null;
    }

    genCodeSysOption(){
        this.codeSystemOptions = [];
        this.codeSystemOptions.push({"value":null, "label":"Select Code System"});
        for (let entry of this.valuesetStructure.displayCodeSystems) {
            if(entry.codeSystemType === 'INTERNAL'){
                this.codeSystemOptions.push({"value": {"ref": entry.codeSysRef, "codeSystemType": entry.codeSystemType} , "label" : entry.identifier});
            }

        }
    }

    delCode(code){
        let index = this.valuesetStructure.displayCodes.indexOf(code);
        this.valuesetStructure.displayCodes = this.valuesetStructure.displayCodes.filter((val, i) => i != index);
    }

    addNewCode(){
        this.valuesetStructure.displayCodes.push(this.newCode);
        this.displayDialog = false;
    }

    addNewCodeSys(){
        this.newCodeSys.codeSysRef = "" + Math.floor(Math.random() * 1000000000);
        this.valuesetStructure.displayCodeSystems.push(this.newCodeSys);
        this.newCodeSysDialog = false;

        this.genCodeSysOption();
    }

    showDialogToAdd(){
        this.newCode = {};
        this.displayDialog = true;
    }

    showDialogToAddCodeSys(){
        this.newCodeSys = {};
        this.newCodeSys.codeSystemType = "INTERNAL";
        this.newCodeSysDialog = true;
    }
  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

  }
}
