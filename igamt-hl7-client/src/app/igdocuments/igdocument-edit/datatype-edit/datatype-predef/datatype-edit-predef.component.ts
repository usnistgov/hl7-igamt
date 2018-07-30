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
    templateUrl : './datatype-edit-predef.component.html',
    styleUrls : ['./datatype-edit-predef.component.css']
})
export class DatatypeEditPredefComponent implements WithSave  {
    currentUrl:any;
    datatypeId:any;
    datatypePredef:any;
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
        this.route.data.map(data =>data.datatypePredef).subscribe(x=>{
            this.backup=x;
            this.datatypePredef=_.cloneDeep(this.backup);
        });
    }

    reset(){
        this.datatypePredef=_.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.datatypePredef;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.datatypesService.saveDatatypePreDef(this.datatypeId, this.datatypePredef).then(saved => {
                    this.backup = _.cloneDeep(this.datatypePredef);
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
