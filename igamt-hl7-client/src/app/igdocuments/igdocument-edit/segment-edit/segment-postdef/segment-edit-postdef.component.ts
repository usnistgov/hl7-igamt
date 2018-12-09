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
import {IgErrorService} from "../../ig-error/ig-error.service";
import {HasFroala} from "../../../../configuration/has-froala";

@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-postdef.component.html',
  styleUrls : ['./segment-edit-postdef.component.css']
})

export class SegmentEditPostdefComponent extends HasFroala implements WithSave {
    currentUrl:any;
    segmentId:any;
    segmentPostdef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService, private http:HttpClient, private igErrorService:IgErrorService)
    { super();
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
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.segmentPostdef;
    }

    getBackup(){
        return this.backup;
    }

    canSave(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
      return new Promise((resolve, reject)=> {


         this.segmentsService.saveSegmentPostDef(this.segmentId, this.segmentPostdef).then(saved => {

          this.backup = _.cloneDeep(this.segmentPostdef);

          this.editForm.control.markAsPristine();
          resolve(true);

        }, error => {
           reject(error);

         }

        );
    })
    }
  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

  }
}
