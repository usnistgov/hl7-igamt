/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as __ from 'lodash';
import {ConformanceProfilesService} from "../conformance-profiles.service";
import {HasFroala} from "../../../../configuration/has-froala";

@Component({
    templateUrl : './conformanceprofile-edit-postdef.component.html',
    styleUrls : ['./conformanceprofile-edit-postdef.component.css']
})

export class ConformanceprofileEditPostdefComponent extends  HasFroala implements WithSave {
    currentUrl:any;
    conformanceprofileId:any;
    conformanceprofilePostdef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private conformanceProfilesService : ConformanceProfilesService, private http:HttpClient){
        super();
    }

    ngOnInit() {
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(data =>data.conformanceprofilePostdef).subscribe(x=>{
            this.backup=x;
            this.conformanceprofilePostdef=__.cloneDeep(this.backup);
        });
    }

    reset(){
        this.conformanceprofilePostdef=__.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.conformanceprofilePostdef;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.conformanceProfilesService.saveConformanceProfilePostDef(this.conformanceprofileId, this.conformanceprofilePostdef).then(saved => {
                    this.backup = __.cloneDeep(this.conformanceprofilePostdef);
                    this.editForm.control.markAsPristine();
                    resolve(true);
                }, error => {
                    console.log("error saving");
                    reject();
                }
            );
        })
    }
}