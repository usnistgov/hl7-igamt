/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import { _ }  from 'underscore';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {ConstraintsService} from "../../service/constraints.service";
import {DatatypesService} from "../datatypes.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {IgErrorService} from "../../ig-error/ig-error.service";
import {TocService} from "../../service/toc.service";

import * as __ from 'lodash';

@Component({
    templateUrl : './datatype-edit-conformancestatements.component.html',
    styleUrls : ['./datatype-edit-conformancestatements.component.css']
})

export class DatatypeEditConformanceStatementsComponent implements WithSave{
    cols:any;
    currentUrl:any;
    datatypeId:any;
    datatypeConformanceStatements:any;
    idMap: any;
    treeData: any[];
    constraintTypes: any = [];
    assertionModes: any = [];
    backup:any;

    selectedConformanceStatement: any = {};

    listTab: boolean = true;
    editorTab: boolean = false;

    valuesetsLinks :any = [];
    datatypesLinks :any = [];
    datatypeOptions:any = [];
    valuesetOptions:any = [{label:'Select ValueSet', value:null}];

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(
        private route: ActivatedRoute,
        private router : Router,
        private datatypesService : DatatypesService,
        private configService : GeneralConfigurationService,
        private constraintsService : ConstraintsService,
        private igErrorService:IgErrorService,
        private tocService:TocService
    ){
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
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.idMap = {};
        this.treeData = [];
        this.datatypeId = this.route.snapshot.params["datatypeId"];

        this.route.data.map(data =>data.datatypeConformanceStatements).subscribe(x=>{
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


                    this.datatypesService.getDatatypeStructure(this.datatypeId).then( dtStructure  => {
                        dtStructure.children = _.sortBy(dtStructure.children, function(child){ return child.data.position});
                        this.idMap[this.datatypeId] = {name:dtStructure.name};
                        var rootData = {elementId:this.datatypeId};
                        for (let child of dtStructure.children) {
                            var childData =  JSON.parse(JSON.stringify(rootData));
                            childData.child = {
                                elementId: child.data.id,
                            };

                            if(child.data.max === '1'){
                                childData.child.instanceParameter = '1';
                            }else{
                                childData.child.instanceParameter = '*';
                            }

                            var data = {
                                id: child.data.id,
                                name: child.data.name,
                                max: child.data.max,
                                position: child.data.position,
                                usage: child.data.usage,
                                dtId: child.data.ref.id,
                                idPath: this.datatypeId + '-' + child.data.id,
                                pathData: childData
                            };

                            var treeNode = {
                                label: child.data.position + '. ' + child.data.name + '[max = ' + child.data.max + ']',
                                data : data,
                                expandedIcon: "fa-folder-open",
                                collapsedIcon: "fa-folder",
                                leaf:false
                            };

                            var dt = this.getDatatypeLink(child.data.ref.id);

                            if(dt.leaf) treeNode.leaf = true;
                            else treeNode.leaf = false;

                            this.idMap[data.idPath] = data;
                            this.treeData.push(treeNode);
                        }

                        this.datatypeConformanceStatements= x;
                        if(!this.datatypeConformanceStatements.conformanceStatements) this.datatypeConformanceStatements.conformanceStatements = [];

                        this.backup=__.cloneDeep(this.datatypeConformanceStatements);
                    });


                });
            });
        });
    }

    reset(){
        this.datatypeConformanceStatements=__.cloneDeep(this.backup);
    }

    getCurrent(){
        return  this.datatypeConformanceStatements;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.datatypesService.saveDatatypeConformanceStatements(this.datatypeId, this.datatypeConformanceStatements).then(saved=>{
                this.backup = __.cloneDeep(this.datatypeConformanceStatements);
                this.editForm.control.markAsPristine();
                resolve(true);
            }, error=>{
                reject(error);
                console.log("error saving");
            });
        });
    }

    getDatatypeLink(id){
        for (let dt of this.datatypesLinks) {
            if(dt.id === id) return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing DT:::" + id);
        return null;
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

    submitCS(){
        if(this.selectedConformanceStatement.type === 'ASSERTION') this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.idMap);
        this.deleteCS(this.selectedConformanceStatement.identifier);
        this.datatypeConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
        this.selectedConformanceStatement = {};
        this.editorTab = false;
        this.listTab = true;
    }

    addNewCS(){
        this.selectedConformanceStatement = {};
        this.editorTab = true;
        this.listTab = false;
    }

    selectCS(cs){
        this.selectedConformanceStatement = JSON.parse(JSON.stringify(cs));
        if(this.selectedConformanceStatement && this.selectedConformanceStatement.type && this.selectedConformanceStatement.assertion && this.selectedConformanceStatement.type === 'ASSERTION'){
            this.constraintsService.generateTreeData(this.selectedConformanceStatement.assertion, this.treeData, this.idMap, this.datatypesLinks);
        }
        this.editorTab = true;
        this.listTab = false;
    }

    deleteCS(identifier){
        this.datatypeConformanceStatements.conformanceStatements = _.without(this.datatypeConformanceStatements.conformanceStatements, _.findWhere(this.datatypeConformanceStatements.conformanceStatements, {identifier: identifier}));
        this.editForm.control.markAsDirty();
    }

    printCS(cs){
        console.log(cs);
    }

    onTabOpen(e) {
        if(e.index === 0) this.selectedConformanceStatement = {};
    }
    hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

    }
}
