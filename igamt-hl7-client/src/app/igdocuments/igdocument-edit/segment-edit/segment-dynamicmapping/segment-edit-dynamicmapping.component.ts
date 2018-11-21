/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as __ from 'lodash';
import { _ } from 'underscore';
import {SegmentsService} from "../segments.service";
import {IgErrorService} from "../../ig-error/ig-error.service";
import {HasFroala} from "../../../../configuration/has-froala";
import {TocService} from "../../service/toc.service";


@Component({
    selector : 'segment-edit-dynamicmapping',
    templateUrl : './segment-edit-dynamicmapping.component.html',
    styleUrls : ['./segment-edit-dynamicmapping.component.css']
})
export class SegmentEditDynamicMappingComponent extends HasFroala implements WithSave {
    currentUrl:any;
    segmentId:any;
    segmentDynamicMapping:any;
    referenceValueOptions:any[] = [{label:"Select Reference", value:null}];
    backup:any;
    datatypeOptions:any[] = [];
    datatypesLinks :any[] = [];

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService, private http:HttpClient,private igErrorService:IgErrorService, private tocService:TocService){
        super();
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.route.data.map(data =>data.segmentDynamicMapping).subscribe(x=>{
            this.tocService.getDataypeList().then((dtTOCdata) => {
                let listTocDTs: any = dtTOCdata;
                for (let entry of listTocDTs) {
                    var treeObj = entry.data;
                    var dtLink: any = {};
                    dtLink.id = treeObj.id;
                    dtLink.label = treeObj.label;
                    dtLink.domainInfo = treeObj.domainInfo;
                    var index = treeObj.label.indexOf("_");
                    if (index > -1) {
                        dtLink.name = treeObj.label.substring(0, index);
                        dtLink.ext = treeObj.label.substring(index);
                    } else {
                        dtLink.name = treeObj.label;
                        dtLink.ext = null;
                    }

                    if(treeObj.ext && treeObj.ext !== ''){
                        dtLink.label = dtLink.label + "_" + treeObj.ext;
                    }

                    if (treeObj.lazyLoading) dtLink.leaf = false;
                    else dtLink.leaf = true;
                    this.datatypesLinks.push(dtLink);

                    var dtOption = {label: dtLink.label, value: dtLink.id};
                    this.datatypeOptions.push(dtOption);
                }

                this.backup=x;
                this.segmentDynamicMapping=__.cloneDeep(this.backup);

                for(let ref of this.segmentDynamicMapping.referenceCodes){
                    this.referenceValueOptions.push({label: ref.code + ' (' +  ref.description + ')', value: ref.code});
                }
            });
        });
    }

    reset(){
        this.segmentDynamicMapping=__.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();
    }

    getCurrent(){
        return  this.segmentDynamicMapping;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any> {
        return new Promise((resolve, reject) => {

            this.segmentsService.saveSegmentDynamicMapping(this.segmentId, this.segmentDynamicMapping).then(saved => {
                this.backup = __.cloneDeep(this.segmentDynamicMapping);
                this.editForm.control.markAsPristine();
                resolve(true);
            }, error => {
                console.log("error saving");
                reject(error);
            });
        });
    }

    findDTOptionsByRef(ref) {
        var result = [{label:"Select Datatype", value:null}];

        for (let option of this.datatypeOptions) {
            if(option.label.startsWith(ref)) result.push(option);
        }

        return result;
    }

    addItem() {
        console.log("ADDD!!!");
        this.segmentDynamicMapping.dynamicMappingInfo.items.push({ "datatypeId": null, "value": null});
    }

    delItem(item){
        this.segmentDynamicMapping.dynamicMappingInfo.items = _.without(this.segmentDynamicMapping.dynamicMappingInfo.items, _.findWhere(this.segmentDynamicMapping.dynamicMappingInfo.items, {value: item.value}));
    }

    isActive(code){
        if(this.segmentDynamicMapping.dynamicMappingInfo.items){
            for(let item of this.segmentDynamicMapping.dynamicMappingInfo.items) {
                if(item.value === code) return false;
            }
        }

        return true;
    }
  hasChanged(){
      //TO DO
    return false;
  }
}
