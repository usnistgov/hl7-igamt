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
    templateUrl : './conformanceprofile-edit-predef.component.html',
    styleUrls : ['./conformanceprofile-edit-predef.component.css']
})

export class ConformanceprofileEditPredefComponent extends  HasFroala implements WithSave {
    currentUrl:any;
    conformanceprofileId:any;
    conformanceprofilePredef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private conformanceProfilesService : ConformanceProfilesService, private http:HttpClient){
        super();
    }

    ngOnInit() {
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(data =>data.conformanceprofilePredef).subscribe(x=>{
            this.backup=x;
            this.conformanceprofilePredef=__.cloneDeep(this.backup);
        });
    }

    reset(){
        this.conformanceprofilePredef=__.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.conformanceprofilePredef;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }
    hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.conformanceProfilesService.saveConformanceProfilePreDef(this.conformanceprofileId, this.conformanceprofilePredef).then(saved => {
                    this.backup = __.cloneDeep(this.conformanceprofilePredef);
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
