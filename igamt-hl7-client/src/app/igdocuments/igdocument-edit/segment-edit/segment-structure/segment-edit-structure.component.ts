/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import { _ } from 'underscore';
import {WithSave, WithNotification} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as __ from 'lodash';
import {SegmentsService} from "../segments.service";
import {IgDocumentService} from "../../ig-document.service";
import {Columns} from "../../../../common/constants/columns";
import {Types} from "../../../../common/constants/types";

@Component({
    selector : 'segment-edit',
    templateUrl : './segment-edit-structure.component.html',
    styleUrls : ['./segment-edit-structure.component.css']
})
export class SegmentEditStructureComponent implements WithSave {
    currentUrl:any;
    segmentId:any;
    igId:any;
    segmentStructure:any;
    changeItems:any[];
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    cols= Columns.segmentColumns;
    selectedColumns=Columns.segmentColumns;
    documentType=Types.IGDOCUMENT;

    constructor(private route: ActivatedRoute,
                private router : Router,
                private configService : GeneralConfigurationService,
                private segmentsService : SegmentsService,
                private igDocumentService : IgDocumentService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.changeItems = [];
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.igId = this.router.url.split("/")[2];

        this.route.data.map(data =>data.segmentStructure).subscribe(x=>{
            x.structure = this.configService.arraySortByPosition(x.structure);
            this.segmentStructure = {};
            this.segmentStructure = x;
            this.backup=__.cloneDeep(this.segmentStructure);
        });
    }

    reset(){
        this.segmentStructure=__.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();
        this.changeItems = [];
    }

    getCurrent(){
        return  this.segmentStructure;
    }

    getBackup(){
        return this.backup;
    }

    canSave(){
        // return !this.editForm.invalid;
        return true;
    }

    save(){
        return new Promise((resolve, reject)=> {
            this.segmentsService.saveSegment(this.segmentId, this.igId, this.changeItems).then(saved => {
                this.backup = __.cloneDeep(this.segmentStructure);
                this.changeItems = [];
                this.editForm.control.markAsPristine();
                resolve(true);

            }, error => {

                reject(error);
            });
        })
    }

    refreshTree(){
        console.log("Refreshing tree");
        this.segmentStructure.structure = [...this.segmentStructure.structure];
    }

    reorderCols(){
        this.selectedColumns= __.sortBy(this.selectedColumns,['position']);
    }
    hasChanged(){
        if(this.changeItems && this.changeItems.length > 0) return true;
        return false;
    }

    print(node){
        console.log(node);
    }
}
