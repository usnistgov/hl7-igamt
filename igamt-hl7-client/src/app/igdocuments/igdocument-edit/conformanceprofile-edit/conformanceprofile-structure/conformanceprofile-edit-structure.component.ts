/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import { _ } from 'underscore';
import * as __ from 'lodash';
import {ConformanceProfilesService} from "../conformance-profiles.service";
import {HasFroala} from "../../../../configuration/has-froala";
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {Columns} from "../../../../common/constants/columns";

@Component({
    templateUrl : './conformanceprofile-edit-structure.component.html',
    styleUrls : ['./conformanceprofile-edit-structure.component.css']
})

export class ConformanceprofileEditStructureComponent extends HasFroala implements WithSave {
    currentUrl:any;
    igId:any;
    conformanceprofileId:any;
    conformanceprofileStructure:any;
    changeItems:any[];
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    cols= Columns.messageColumns;
    selectedColumns=Columns.messageColumns;

    constructor(private route: ActivatedRoute,
                private router : Router,
                private configService : GeneralConfigurationService,
                private conformanceProfilesService : ConformanceProfilesService) {
        super();
    }

    ngOnInit() {
        this.changeItems = [];
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.igId = this.router.url.split("/")[2];
        this.route.data.map(data =>data.conformanceprofileStructure).subscribe(x=>{
            x.structure = this.configService.arraySortByPosition(x.structure);
            this.backup = x;
            this.conformanceprofileStructure=__.cloneDeep(this.backup);
        });
    }


    reset(){
        this.conformanceprofileStructure=__.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.conformanceprofileStructure;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            let saveObj:any = {};
            saveObj.id = this.conformanceprofileStructure.id;

            this.conformanceProfilesService.saveConformanceProfileStructure(this.conformanceprofileId, saveObj).then(saved => {
                this.backup = __.cloneDeep(this.conformanceprofileStructure);
                this.editForm.control.markAsPristine();
                resolve(true);
            }, error => {
                console.log("error saving");
                reject();
            });
        })
    }

    hasChanged(){
        return this.editForm&& this.editForm.touched&&this.editForm.dirty;
    }

    reorderCols(){
        this.selectedColumns= __.sortBy(this.selectedColumns,['position']);
    }


    print(node){
        console.log(node);
    }
}
