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
import {DeltaService, DiffableResult} from '../../../../common/delta/service/delta.service';

@Component({
    templateUrl : './conformanceprofile-edit-structure.component.html',
    styleUrls : ['./conformanceprofile-edit-structure.component.css']
})

export class ConformanceprofileEditStructureComponent extends HasFroala implements WithSave {
    currentUrl:any;
    igId:any;
    conformanceprofileId:any;
    conformanceprofileStructure:any;
    changeItems:any[]=[];
    backup:any;
    diff: DiffableResult;
    diffable: boolean;

    @ViewChild('editForm')
    private editForm: NgForm;

    cols= Columns.messageColumns;
    selectedColumns= Columns.messageColumns;

    constructor(private route: ActivatedRoute,
                private router : Router,
                private configService : GeneralConfigurationService,
                private conformanceProfilesService : ConformanceProfilesService,
                private delta: DeltaService) {
        super();
    }

    ngOnInit() {
        this.changeItems = [];
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.igId = this.router.url.split("/")[2];
        this.route.data.map(data =>data.conformanceprofileStructure).subscribe(x=>{
            x.structure = this.configService.arraySortByPosition(x.structure);
            this.backup = x;
            this.delta.diffable('CONFORMANCEPROFILE', this.igId, x.from, this.conformanceprofileId).subscribe(
              diffData => this.diff = diffData
            );
            this.diffable = !!x.origin;
            this.conformanceprofileStructure=__.cloneDeep(this.backup);
        });
    }


    reset(){
        this.conformanceprofileStructure=__.cloneDeep(this.backup);
        this.changeItems = [];

        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.conformanceprofileStructure;
    }

    getBackup(){
        return this.backup;
    }

    canSave(){
        return !this.conformanceprofileStructure.readOnly;
    }
    hasChanged(){
    return this.changeItems!=null&& this.changeItems.length>0;
    }


  save(){
        return new Promise((resolve, reject)=> {
            this.conformanceProfilesService.save(this.conformanceprofileId, this.changeItems).then(saved => {
                this.backup = __.cloneDeep(this.conformanceprofileStructure);
                this.changeItems = [];
                this.editForm.control.markAsPristine();
                resolve(true);

            }, error => {
                reject(error);
            });
        })
    }


    reorderCols(){
        this.selectedColumns= __.sortBy(this.selectedColumns,['position']);
    }


    print(node){
        console.log(node);
    }

    refreshTree(){
        console.log("Refreshing tree");
        this.conformanceprofileStructure.structure = [...this.conformanceprofileStructure.structure];
    }
}
