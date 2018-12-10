/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {LibDatatypesService} from "../lib-datatypes.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';
import {HasFroala} from "../../../../configuration/has-froala";
import {LibErrorService} from "../../lib-error/lib-error.service";


@Component({
  templateUrl : 'lib-datatype-edit-postdef.component.html',
  styleUrls : ['lib-datatype-edit-postdef.component.css']
})
export class LibDatatypeEditPostdefComponent extends HasFroala implements WithSave  {
    currentUrl:any;
    datatypeId:any;
    datatypePostdef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private datatypesService : LibDatatypesService, private http:HttpClient, private errorService:LibErrorService){
        super();
    }

    ngOnInit() {
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.route.data.map(data =>data.datatypePostdef).subscribe(x=>{
            this.backup=x;
            this.datatypePostdef=_.cloneDeep(this.backup);
        });
    }

    reset(){
        this.datatypePostdef=_.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.datatypePostdef;
    }

    getBackup(){
        return this.backup;
    }

    canSave(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.datatypesService.saveDatatypePostDef(this.datatypeId, this.datatypePostdef).then(saved => {
                    this.backup = _.cloneDeep(this.datatypePostdef);
                    this.editForm.control.markAsPristine();
                    resolve(true);
                }, error => {
                    console.log("error saving");
                    reject();
                    this.errorService.showError(error);
                }

            );
        })
    }
  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

  }
}
