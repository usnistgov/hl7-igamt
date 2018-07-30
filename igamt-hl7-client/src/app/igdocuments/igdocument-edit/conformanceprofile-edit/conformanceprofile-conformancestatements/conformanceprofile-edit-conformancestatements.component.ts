/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import { _ } from 'underscore';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {ConstraintsService} from "../../../../service/constraints/constraints.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as __ from 'lodash';
import {SegmentsService} from "../../segment-edit/segments.service";
import {DatatypesService} from "../../datatype-edit/datatypes.service";

@Component({
    templateUrl : './conformanceprofile-edit-conformancestatements.component.html',
    styleUrls : ['./conformanceprofile-edit-conformancestatements.component.css']
})
export class ConformanceprofileEditConformancestatementsComponent  implements WithSave{
    cols:any;
    currentUrl:any;
    segmentId:any;
    segmentConformanceStatements:any;
    idMap: any;
    treeData: any[];
    constraintTypes: any = [];
    assertionModes: any = [];
    backup:any;

    selectedConformanceStatement: any = {};

    listTab: boolean = true;
    editorTab: boolean = false;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(
        private route: ActivatedRoute,
        private router : Router,
        private segmentsService : SegmentsService,
        private datatypesService : DatatypesService,
        private configService : GeneralConfigurationService,
        private constraintsService : ConstraintsService,
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
        this.segmentId = this.route.snapshot.params["segmentId"];

        this.route.data.map(data =>data.conformanceprofileConformanceStatements).subscribe(x=>{
            this.segmentConformanceStatements= x;


            this.segmentsService.getSegmentStructure(this.segmentId).then( segStructure  => {
                this.idMap[this.segmentId] = {name:segStructure.name};

                var rootData = {elementId:this.segmentId};

                for (let child of segStructure.children) {
                    var childData =  JSON.parse(JSON.stringify(rootData));
                    childData.child = {
                        elementId: child.data.id,
                    };

                    if(child.data.max === '1'){
                        childData.child.instanceParameter = '1';
                    }else{
                        childData.child.instanceParameter = '*';
                    }

                    var treeNode = {
                        label: child.data.name,
                        data : childData,
                        expandedIcon: "fa-folder-open",
                        collapsedIcon: "fa-folder",
                    };

                    var data = {
                        id: child.data.id,
                        name: child.data.name,
                        max: child.data.max,
                        position: child.data.position,
                        usage: child.data.usage,
                        dtId: child.data.ref.id
                    };

                    this.idMap[this.segmentId + '-' + data.id] = data;
                    this.popChild(this.segmentId + '-' + data.id, data.dtId, treeNode);
                    this.treeData.push(treeNode);

                    this.backup=__.cloneDeep(this.segmentConformanceStatements);
                }
            });
        });
    }

    reset(){
        this.segmentConformanceStatements=__.cloneDeep(this.backup);
    }

    getCurrent(){
        return  this.segmentConformanceStatements;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return this.segmentsService.saveSegmentConformanceStatements(this.segmentId, this.segmentConformanceStatements);
    }

    popChild(id, dtId, parentTreeNode){

        this.datatypesService.getDatatypeStructure(dtId).then( dtStructure  => {
            this.idMap[id].dtName = dtStructure.name;
            if(dtStructure.children){
                for (let child of dtStructure.children) {
                    var childData =  JSON.parse(JSON.stringify(parentTreeNode.data));

                    this.makeChild(childData, child.data.id, '1');

                    var treeNode = {
                        label: child.data.name,
                        data:childData,
                        expandedIcon: "fa-folder-open",
                        collapsedIcon: "fa-folder",
                    };

                    var data = {
                        id: child.data.id,
                        name: child.data.name,
                        max: "1",
                        position: child.data.position,
                        usage: child.data.usage,
                        dtId: child.data.ref.id
                    };
                    this.idMap[id + '-' + data.id] = data;

                    this.popChild(id + '-' + data.id, data.dtId, treeNode);

                    if(!parentTreeNode.children) parentTreeNode.children = [];
                    parentTreeNode.children.push(treeNode);

                }
            }


        });


    }

    makeChild(data, id, para){
        if(data.child) this.makeChild(data.child, id, para);
        else data.child = {
            elementId: id,
            instanceParameter: para
        }
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
        this.segmentConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
        this.selectedConformanceStatement = {};
        this.editorTab = false;
        this.listTab = true;
    }

    selectCS(cs){
        this.selectedConformanceStatement = JSON.parse(JSON.stringify(cs));
        this.editorTab = true;
        this.listTab = false;
    }

    deleteCS(identifier){
        this.segmentConformanceStatements.conformanceStatements = _.without(this.segmentConformanceStatements.conformanceStatements, _.findWhere(this.segmentConformanceStatements.conformanceStatements, {identifier: identifier}));
    }

    printCS(cs){
        console.log(cs);
    }

    onTabOpen(e) {
        if(e.index === 0) this.selectedConformanceStatement = {};
    }
}
