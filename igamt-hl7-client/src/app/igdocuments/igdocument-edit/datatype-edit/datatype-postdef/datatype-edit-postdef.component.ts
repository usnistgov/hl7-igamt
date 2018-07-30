/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {DatatypesService} from "../datatypes.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';
import {IgErrorService} from "../../ig-error/ig-error.service";


@Component({
  templateUrl : './datatype-edit-postdef.component.html',
  styleUrls : ['./datatype-edit-postdef.component.css']
})
export class DatatypeEditPostdefComponent implements WithSave  {
    currentUrl:any;
    datatypeId:any;
    datatypePostdef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private datatypesService : DatatypesService, private http:HttpClient, private igErrorService:IgErrorService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
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

    isValid(){
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
                    this.igErrorService.showError(error);
                }

            );
        })
    }
}
