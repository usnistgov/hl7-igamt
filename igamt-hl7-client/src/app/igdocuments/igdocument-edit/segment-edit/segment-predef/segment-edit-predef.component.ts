/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {SegmentsService} from "../../../../service/segments/segments.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';



@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-predef.component.html',
  styleUrls : ['./segment-edit-predef.component.css']
})
export class SegmentEditPredefComponent implements WithSave {
    currentUrl:any;
    segmentId:any;
    segmentPredef:any;
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
        this.route.data.map(data =>data.segmentPredef).subscribe(x=>{
            this.backup=x;
            this.segmentPredef=_.cloneDeep(this.backup);
        });
    }

    reset(){
        this.segmentPredef=_.cloneDeep(this.backup);
    }

    getCurrent(){
        return  this.segmentPredef;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return this.segmentsService.saveSegmentPreDef(this.segmentId, this.segmentPredef);
    }
}
