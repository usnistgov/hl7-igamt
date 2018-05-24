/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {SegmentsService} from "../../../../service/segments/segments.service";
import {DatatypesService} from "../../../../service/datatypes/datatypes.service";
import { _ } from 'underscore';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {ConstraintsService} from "../../../../service/constraints/constraints.service";


@Component({
    templateUrl : './segment-edit-conformancestatements.component.html',
    styleUrls : ['./segment-edit-conformancestatements.component.css']
})
export class SegmentEditConformanceStatementsComponent {
    cols:any;
    currentUrl:any;
    segmentId:any;
    segmentConformanceStatements:any;
    idMap: any;
    treeData: any[];
    constraintTypes: any = [];
    assertionModes: any = [];
    complexAssertionTypes: any[];

    selectedConformanceStatement: any = {};

    listTab: boolean = true;
    editorTab: boolean = false;

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
        this.complexAssertionTypes = this.configService._complexAssertionTypes;
        this.idMap = {};
        this.treeData = [];
        this.segmentId = this.route.snapshot.params["segmentId"];

        this.route.data.map(data =>data.segmentConformanceStatements).subscribe(x=>{
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


                }
            });
        });
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
        }else if(this.selectedConformanceStatement.assertion.mode == 'COMPLEX'){
            this.selectedConformanceStatement.assertion = {mode:"COMPLEX"};
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

    changeComplexAssertionType(constraint){
        if(constraint.complexAssertionType === 'ANDOR'){
            constraint.child = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.operator = 'AND';
            constraint.assertions = [];
            constraint.assertions.push({
                "mode": "SIMPLE"
            });

            constraint.assertions.push({
                "mode": "SIMPLE"
            });
        }else if(constraint.complexAssertionType === 'NOT'){
            constraint.assertions = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.child = {
                "mode": "SIMPLE"
            };
        }else if(constraint.complexAssertionType === 'IFTHEN'){
            constraint.assertions = undefined;
            constraint.child = undefined;
            constraint.ifAssertion = {
                "mode": "SIMPLE"
            };
            constraint.thenAssertion = {
                "mode": "SIMPLE"
            };
        }
    }

}
