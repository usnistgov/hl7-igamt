/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';
import {ConformanceProfilesService} from "../conformance-profiles.service";

@Component({
  templateUrl : './conformanceprofile-edit-postdef.component.html',
  styleUrls : ['./conformanceprofile-edit-postdef.component.css']
})

export class ConformanceprofileEditPostdefComponent implements WithSave {
    currentUrl:any;
    conformanceprofileId:any;
    conformanceProfilePostdef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private conformanceProfilesService : ConformanceProfilesService, private http:HttpClient){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(data =>data.conformanceprofilePostdef).subscribe(x=>{
            this.backup=x;
            this.conformanceProfilePostdef=_.cloneDeep(this.backup);
        });
    }

    reset(){
        this.conformanceProfilePostdef=_.cloneDeep(this.backup);
    }

    getCurrent(){
        return  this.conformanceProfilePostdef;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return this.conformanceProfilesService.saveConformanceProfilePostDef(this.conformanceprofileId, this.conformanceProfilePostdef);
    }
}
