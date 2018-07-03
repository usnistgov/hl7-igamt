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
import {SegmentsService} from "../segments.service";

@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-postdef.component.html',
  styleUrls : ['./segment-edit-postdef.component.css']
})

export class SegmentEditPostdefComponent implements WithSave {
    currentUrl:any;
    segmentId:any;
    segmentPostdef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService, private http:HttpClient){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.route.data.map(data =>data.segmentPostdef).subscribe(x=>{
            this.backup=x;
            this.segmentPostdef=_.cloneDeep(this.backup);
        });
    }

    reset(){
        this.segmentPostdef=_.cloneDeep(this.backup);
    }

    getCurrent(){
        return  this.segmentPostdef;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return this.segmentsService.saveSegmentPostDef(this.segmentId, this.segmentPostdef);
    }
}
