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
  templateUrl : './segment-edit-predef.component.html',
  styleUrls : ['./segment-edit-predef.component.css']
})
export class SegmentEditPredefComponent extends HasFroala implements WithSave {
    currentUrl:any;
    segmentId:any;
    current:any;
    backup:any;
    changeItems: any[]=[];

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService, private http:HttpClient,private igErrorService:IgErrorService){

      super();
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
            this.current=_.cloneDeep(this.backup);
        });
    }

    reset(){

        this.current=_.cloneDeep(this.backup);

    }

    getCurrent(){
        return  this.current;
    }

    getBackup(){
        return this.backup;
    }

    canSave(){

      return true;


    }

    save(): Promise<any> {

      this.createChanges(this.current,this.backup);
      console.log("saving");
      return new Promise((resolve, reject) => {

        this.segmentsService.save(this.segmentId,this.changeItems).then(saved => {

          this.backup = _.cloneDeep(this.current);

          //this.editForm.control.markAsPristine();
          resolve(true);

        }, error => {

          console.log("error saving");
          reject(error);

        });
      });
    }
  hasChanged(){
    return  this.backup.text != this.current.text;
  }

  createChanges(elm, backup){
    this.changeItems=[];
    let obj:any={};
    obj.location=this.segmentId;
    obj.propertyType="PREDEF";
    obj.propertyValue=elm.text;
    obj.oldPropertyValue=backup.text;
    obj.position=-1;
    obj.changeType="UPDATE";
    this.changeItems.push(obj);
  }
}
