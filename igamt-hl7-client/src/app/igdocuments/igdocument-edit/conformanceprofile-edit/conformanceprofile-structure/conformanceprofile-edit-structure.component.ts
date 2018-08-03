/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import { _ } from 'underscore';
import * as __ from 'lodash';
import {ConformanceProfilesService} from "../conformance-profiles.service";
import {HasFroala} from "../../../../configuration/has-froala";
import {ConstraintsService} from "../../../../service/constraints/constraints.service";
import {TocService} from "../../service/toc.service";

@Component({
    templateUrl : './conformanceprofile-edit-structure.component.html',
    styleUrls : ['./conformanceprofile-edit-structure.component.css']
})

export class ConformanceprofileEditStructureComponent extends  HasFroala implements WithSave {
    currentUrl:any;
    conformanceprofileId:any;
    conformanceprofileStructure:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;


    segmentsLinks :any = [];
    segmentsOptions:any = [];
    datatypesLinks :any = [];
    datatypeOptions:any = [];
    valuesetsLinks :any = [];
    valuesetOptions:any = [{label:'Select ValueSet', value:null}];

    constructor(private route: ActivatedRoute, private  router : Router, private conformanceProfilesService : ConformanceProfilesService, private http:HttpClient, private constraintsService : ConstraintsService, private tocService:TocService){
        super();
    }

    ngOnInit() {
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(data =>data.conformanceprofileStructure).subscribe(x=>{
            this.tocService.getSegmentsList().then((segTOCdata) => {
                let listTocSEGs:any = segTOCdata;
                for(let entry of listTocSEGs){
                    var treeObj = entry.data;

                    var segLink:any = {};
                    segLink.id = treeObj.key.id;
                    segLink.label = treeObj.label;
                    segLink.domainInfo = treeObj.domainInfo;
                    var index = treeObj.label.indexOf("_");
                    if(index > -1){
                        segLink.name = treeObj.label.substring(0,index);
                        segLink.ext = treeObj.label.substring(index);;
                    }else {
                        segLink.name = treeObj.label;
                        segLink.ext = null;
                    }

                    this.segmentsLinks.push(segLink);

                    var segOption = {label: segLink.label, value : segLink.id};
                    this.segmentsOptions.push(segOption);
                }

                this.tocService.getDataypeList().then((dtTOCdata) => {
                    let listTocDTs:any = dtTOCdata;
                    for(let entry of listTocDTs){
                        var treeObj = entry.data;

                        var dtLink:any = {};
                        dtLink.id = treeObj.key.id;
                        dtLink.label = treeObj.label;
                        dtLink.domainInfo = treeObj.domainInfo;
                        var index = treeObj.label.indexOf("_");
                        if(index > -1){
                            dtLink.name = treeObj.label.substring(0,index);
                            dtLink.ext = treeObj.label.substring(index);;
                        }else {
                            dtLink.name = treeObj.label;
                            dtLink.ext = null;
                        }

                        if(treeObj.lazyLoading) dtLink.leaf = false;
                        else dtLink.leaf = true;
                        this.datatypesLinks.push(dtLink);

                        var dtOption = {label: dtLink.label, value : dtLink.id};
                        this.datatypeOptions.push(dtOption);
                    }


                    this.tocService.getValueSetList().then((valuesetTOCdata) => {
                        let listTocVSs: any = valuesetTOCdata;

                        for (let entry of listTocVSs) {
                            var treeObj = entry.data;
                            var valuesetLink: any = {};
                            valuesetLink.id = treeObj.key.id;
                            valuesetLink.label = treeObj.label;
                            valuesetLink.domainInfo = treeObj.domainInfo;
                            this.valuesetsLinks.push(valuesetLink);
                            var vsOption = {label: valuesetLink.label, value: valuesetLink.id};
                            this.valuesetOptions.push(vsOption);
                        }
                        this.sortStructure(x);
                        x.treeModel = [];
                        this.genTreeModel(x.treeModel, x.children);
                        console.log(x);

                        this.backup=x;
                        this.conformanceprofileStructure=__.cloneDeep(this.backup);
                    });
                });
            });
        });
    }

    loadNode(event) {
        if (event.node && !event.node.children) {
            if(event.node.data.type === 'GROUP'){
                var group = this.findData(event.node.data.idPath, this.conformanceprofileStructure.children);
                event.node.children = [];
                this.genTreeModel(event.node.children, group.children);

                console.log(this.conformanceprofileStructure.treeModel);
            }

        }
    }

    findData(idPath, list){
        var res = idPath.split(",");
        if(res.length === 1){
            for(let child of list){
                if(child.id === res[0]) return child;
            }

        }else if(res.length > 1){
            for(let child of list){
                if(child.id === res[0]) {
                    res.shift();
                    return this.findData(res.toString(), child.children);
                }
            }

        }

        return null;
    }

    genTreeModel(current, list){
        for(let child of list) {
            if(child.type === 'SEGMENTREF'){
                let data:any = {};
                data.id = child.id;
                data.position = child.position;
                data.type = child.type;
                // data.usage = child.usage;
                // data.text = child.text;
                // data.custom = child.custom;
                // data.min = child.min;
                // data.max = child.max;
                // data.ref = child.ref;
                data.idPath = child.id;
                let treeModel:any = {};
                treeModel.data = data;
                treeModel.leaf = false;
                current.push(treeModel);
            }else if(child.type === 'GROUP'){
                let data:any = {};
                data.id = child.id;
                data.position = child.position;
                data.type = child.type;
                // data.name = child.name;
                // data.usage = child.usage;
                // data.text = child.text;
                // data.custom = child.custom;
                // data.min = child.min;
                // data.max = child.max;
                data.idPath = child.id;
                let treeModel:any = {};
                treeModel.data = data;
                treeModel.leaf = false;
                current.push(treeModel);
            }
        }
    }

    sortStructure(x){
        x.children = _.sortBy(x.children, function(child){ return child.position});
        for (let child of  x.children) {
            if(child.children) this.sortStructure(child);
        }
    }

    reset(){
        this.conformanceprofileStructure=__.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.conformanceprofileStructure;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.conformanceProfilesService.saveConformanceProfileStructure(this.conformanceprofileId, this.conformanceprofileStructure).then(saved => {
                    this.backup = __.cloneDeep(this.conformanceprofileStructure);
                    this.editForm.control.markAsPristine();
                    resolve(true);
                }, error => {
                    console.log("error saving");
                    reject();
                }
            );
        })
    }
}