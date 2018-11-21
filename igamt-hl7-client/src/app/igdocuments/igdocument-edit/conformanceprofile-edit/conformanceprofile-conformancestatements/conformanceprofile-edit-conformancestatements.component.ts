/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import { _ } from 'underscore';
import * as __ from 'lodash';
import {ConformanceProfilesService} from "../conformance-profiles.service";
import {ConstraintsService} from "../../service/constraints.service";
import {TocService} from "../../service/toc.service";
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {SegmentsService} from "../../segment-edit/segments.service";
import {DatatypesService} from "../../datatype-edit/datatypes.service";

@Component({
    templateUrl : './conformanceprofile-edit-conformancestatements.component.html',
    styleUrls : ['./conformanceprofile-edit-conformancestatements.component.css']
})

export class ConformanceprofileEditConformancestatementsComponent implements WithSave {
    currentUrl:any;
    conformanceprofileId:any;
    conformanceprofileConformanceStatements:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    segmentsLinks :any = [];
    segmentsOptions:any = [];
    datatypesLinks :any = [];
    datatypeOptions:any = [];
    valuesetsLinks :any = [];
    valuesetOptions:any = [{label:'Select ValueSet', value:null}];

    valuesetStrengthOptions:any = [];

    usages:any;
    cUsages:any;

    listTab: boolean = true;
    editorTab: boolean = false;
    selectContextDialog: boolean = false;

    selectedConformanceStatement: any = {};

    constraintTypes: any = [];
    assertionModes: any = [];

    cols:any;

    contextTreeModel:any = [];

    constructor(private route: ActivatedRoute,
                private router : Router,
                private configService : GeneralConfigurationService,
                private conformanceProfilesService : ConformanceProfilesService,
                private segmentsService : SegmentsService,
                private datatypesService : DatatypesService,
                private constraintsService : ConstraintsService,
                private tocService:TocService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });

        this.cols = [
            { field: 'identifier', header: 'ID', colStyle: {width: '20em'}, sort:'identifier'},
            { field: 'description', header: 'Description' }
        ];
    }

    ngOnInit() {
        this.usages = this.configService._usages;
        this.cUsages = this.configService._cUsages;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;

        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(data =>data.conformanceprofileConformanceStatements).subscribe(x=>{
            this.tocService.getSegmentsList().then((segTOCdata) => {
                let listTocSEGs:any = segTOCdata;
                for(let entry of listTocSEGs){
                    var treeObj = entry.data;

                    var segLink:any = {};
                    segLink.id = treeObj.id;
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
                        dtLink.id = treeObj.id;
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
                            valuesetLink.id = treeObj.id;
                            valuesetLink.label = treeObj.label;
                            valuesetLink.domainInfo = treeObj.domainInfo;
                            this.valuesetsLinks.push(valuesetLink);
                            var vsOption = {label: valuesetLink.label, value: valuesetLink.id};
                            this.valuesetOptions.push(vsOption);
                        }
                        this.sortStructure(x);
                        this.backup=x;
                        this.conformanceprofileConformanceStatements=__.cloneDeep(this.backup);
                    });
                });
            });

        });
    }

    sortStructure(x){
        x.children = _.sortBy(x.children, function(child){ return child.position});
        for (let child of  x.children) {
            if(child.children) this.sortStructure(child);
        }
    }

    selectCS(cs){
        this.selectedConformanceStatement = JSON.parse(JSON.stringify(cs));
        this.editorTab = true;
        this.listTab = false;
    }

    deleteCS(identifier){
        this.conformanceprofileConformanceStatements.conformanceStatements = _.without(this.conformanceprofileConformanceStatements.conformanceStatements, _.findWhere(this.conformanceprofileConformanceStatements.conformanceStatements, {identifier: identifier}));
    }

    onTabOpen(e) {
        if(e.index === 0) this.selectedConformanceStatement = {};
    }

    submitCS(){
        // if(this.selectedConformanceStatement.type === 'ASSERTION') this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.idMap);
        this.deleteCS(this.selectedConformanceStatement.identifier);
        this.conformanceprofileConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
        this.selectedConformanceStatement = {};
        this.editorTab = false;
        this.listTab = true;
    }

    changeType(){
        if(this.selectedConformanceStatement.type == 'ASSERTION'){
            this.selectedConformanceStatement.assertion = {};
            this.selectedConformanceStatement.assertion = {mode:"SIMPLE"};
        }else if(this.selectedConformanceStatement.type == 'FREE'){
            this.selectedConformanceStatement.assertion = undefined;
        }else if(this.selectedConformanceStatement.type == 'PREDEFINEDPATTERNS'){
            this.selectedConformanceStatement.assertion = undefined;
        }else if(this.selectedConformanceStatement.type == 'PREDEFINED'){
            this.selectedConformanceStatement.assertion = undefined;
        }
    }

    addNewCS(){
        this.selectedConformanceStatement = {};
        this.editorTab = true;
        this.listTab = false;
    }

    changeAssertionMode(){
        if(this.selectedConformanceStatement.assertion.mode == 'SIMPLE'){
            this.selectedConformanceStatement.assertion = {mode:"SIMPLE"};
        }else if(this.selectedConformanceStatement.assertion.mode === 'ANDOR'){
            this.selectedConformanceStatement.assertion.child = undefined;
            this.selectedConformanceStatement.assertion.ifAssertion = undefined;
            this.selectedConformanceStatement.assertion.thenAssertion = undefined;
            this.selectedConformanceStatement.assertion.operator = 'AND';
            this.selectedConformanceStatement.assertion.assertions = [];
            this.selectedConformanceStatement.assertion.assertions.push({
                "mode": "SIMPLE"
            });

            this.selectedConformanceStatement.assertion.assertions.push({
                "mode": "SIMPLE"
            });
        }else if(this.selectedConformanceStatement.assertion.mode === 'NOT'){
            this.selectedConformanceStatement.assertion.assertions = undefined;
            this.selectedConformanceStatement.assertion.ifAssertion = undefined;
            this.selectedConformanceStatement.assertion.thenAssertion = undefined;
            this.selectedConformanceStatement.assertion.child = {
                "mode": "SIMPLE"
            };
        }else if(this.selectedConformanceStatement.assertion.mode === 'IFTHEN'){
            this.selectedConformanceStatement.assertion.assertions = undefined;
            this.selectedConformanceStatement.assertion.child = undefined;
            this.selectedConformanceStatement.assertion.ifAssertion = {
                "mode": "SIMPLE"
            };
            this.selectedConformanceStatement.assertion.thenAssertion = {
                "mode": "SIMPLE"
            };
        }
    }

    openDialogSelectContext(){
        this.contextTreeModel = [
            {
                "label": this.conformanceprofileConformanceStatements.name,
                "data": {idPath : null, type : 'MESSAGE'},
                "expandedIcon": "fa fa-folder-open",
                "collapsedIcon": "fa fa-folder",
                "children" : []
            }
        ];

        this.popTreeModel(this.contextTreeModel[0], this.conformanceprofileConformanceStatements.children);

        this.selectContextDialog = true;
    }

    selectContext(idPath){
        this.selectedConformanceStatement.contextLocation = idPath;
        this.selectContextDialog = false;
    }

    popTreeModel(parent, list){
        for(let item of list){
            let idPath;
            if(parent.data.idPath) idPath = parent.data.idPath + ',' + item.id;
            else idPath = item.id;
            if(item.type === 'SEGMENTREF'){
                parent.children.push({
                    "label": item.position + '. ' + this.getSegmentElm(item.ref.id).name,
                    "data": {"idPath" : idPath, "type" : 'SEGMENTREF'},
                    "expandedIcon": "fa fa-folder-open",
                    "collapsedIcon": "fa fa-folder"
                });
            }else if(item.type === 'GROUP'){
                let group = {
                    "label": item.position + '. ' + item.name,
                    "data": {idPath : idPath, type : 'GROUP'},
                    "expandedIcon": "fa fa-folder-open",
                    "collapsedIcon": "fa fa-folder",
                    "children" : []
                };
                this.popTreeModel(group, item.children);
                parent.children.push(group);
            }
        }
    }

    showContext(context){
        if(context){
            return this.findContext(context, this.conformanceprofileConformanceStatements.children, this.conformanceprofileConformanceStatements.name);
        }
        return this.conformanceprofileConformanceStatements.name;
    }

    findContext(context, list, result){
        var res = context.split(",");
        for(let item of list){
            if(item.id === res[0]){
                if(res.length === 1){
                    return result + '-' +'[' + item.position + ']' + item.name;
                }else if (res.length > 1){
                    res.shift();
                    return this.findContext(res.toString(), item.children, result + '-' +'[' + item.position + ']' + item.name);
                }
            }
        }
        return "NOT FOUND";
    }

    getSegmentElm(id){
        for(let link of this.segmentsLinks){
            if(link.id === id) return link;
        }
        return null;
    }

    reset(){
        this.conformanceprofileConformanceStatements=__.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.conformanceprofileConformanceStatements;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    hasChanged(){
      return this.editForm&& this.editForm.touched&&this.editForm.dirty;

    }
    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.conformanceProfilesService.saveConformanceProfileConformanceStatements(this.conformanceprofileId, this.conformanceprofileConformanceStatements).then(saved => {
                this.backup = __.cloneDeep(this.conformanceprofileConformanceStatements);
                this.editForm.control.markAsPristine();
                resolve(true);
            }, error => {
                console.log("error saving");
                reject();
            });
        })
    }
}
