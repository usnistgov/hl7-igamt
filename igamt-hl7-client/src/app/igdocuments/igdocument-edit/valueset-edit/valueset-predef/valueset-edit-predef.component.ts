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

@Component({
    templateUrl : './valueset-edit-predef.component.html',
    styleUrls : ['./valueset-edit-predef.component.css']
})

export class ValuesetEditPredefComponent implements WithSave  {
    currentUrl:any;
    valuesetId:any;
    valuesetPredef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private valuesetsService : ValuesetsService, private http:HttpClient, private igErrorService:IgErrorService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.valuesetId = this.route.snapshot.params["valuesetId"];
        this.route.data.map(data =>data.valuesetPredef).subscribe(x=>{
            this.backup=x;
            this.valuesetPredef=_.cloneDeep(this.backup);
        });
    }

    reset(){
        this.valuesetPredef=_.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.valuesetPredef;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.valuesetsService.saveValuesetPreDef(this.valuesetId, this.valuesetPredef).then(saved => {
                    this.backup = _.cloneDeep(this.valuesetPredef);
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