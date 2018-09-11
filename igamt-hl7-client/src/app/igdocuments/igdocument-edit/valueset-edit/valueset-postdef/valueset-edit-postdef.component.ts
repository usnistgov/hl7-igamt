/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {ValuesetsService} from "../valuesets.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';
import {IgErrorService} from "../../ig-error/ig-error.service";
import {HasFroala} from "../../../../configuration/has-froala";

@Component({
  templateUrl : './valueset-edit-postdef.component.html',
  styleUrls : ['./valueset-edit-postdef.component.css']
})

export class ValuesetEditPostdefComponent extends HasFroala implements WithSave  {
    valuesetId:any;
    valuesetPostdef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private valuesetsService : ValuesetsService, private http:HttpClient, private igErrorService:IgErrorService){
    super();
    }

    ngOnInit() {
        this.valuesetId = this.route.snapshot.params["valuesetId"];
        this.route.data.map(data =>data.valuesetPostdef).subscribe(x=>{
            this.backup=x;
            this.valuesetPostdef=_.cloneDeep(this.backup);
        });
    }

    reset(){
        this.valuesetPostdef=_.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.valuesetPostdef;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.valuesetsService.saveValuesetPostDef(this.valuesetId, this.valuesetPostdef).then(saved => {
                    this.backup = _.cloneDeep(this.valuesetPostdef);
                    this.editForm.control.markAsPristine();
                    resolve(true);
                }, error => {
                    console.log("error saving");
                    reject();
                    this.igErrorService.showError(error);
                }

            );
        })
    }
  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

  }
}
