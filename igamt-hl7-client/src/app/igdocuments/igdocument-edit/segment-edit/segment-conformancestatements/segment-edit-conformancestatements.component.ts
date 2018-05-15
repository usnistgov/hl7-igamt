/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {SegmentsService} from "../../../../service/segments/segments.service";
import {DatatypesService} from "../../../../service/datatypes/datatypes.service";
import {HttpClient} from "@angular/common/http";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import { _ } from 'underscore';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";


@Component({
    selector : 'segment-edit',
    templateUrl : './segment-edit-conformancestatements.component.html',
    styleUrls : ['./segment-edit-conformancestatements.component.css']
})
export class SegmentEditConformanceStatementsComponent {
    currentUrl:any;
    segmentId:any;
    segmentConformanceStatements:any;
    idMap: any;
    treeData: any[];
    constraintType: any = [];
    assertionModes: any = [];

    selectedConformanceStatement: any = {};

    listTab: boolean = true;
    editorTab: boolean = false;

    constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private segmentsService : SegmentsService, private datatypesService : DatatypesService, private http:HttpClient, private configService : GeneralConfigurationService){
        this.constraintType = [
            {label: 'Predefined', value: 'PREDEFINED', icon: 'fa fa-fw fa-spinner', disabled: true},
            {label: 'Predefined Patterns', value: 'PREDEFINEDPATTERNS', icon: 'fa fa-fw fa-spinner', disabled: true},
            {label: 'Assertion Builder', value: 'ASSERTION', icon: 'fa fa-fw fa-file-code-o'},
            {label: 'Free Text', value: 'FREE', icon: 'fa fa-fw fa-file-text-o'}
        ];

        this.assertionModes = this.configService._assertionModes;

        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.idMap = {};
        this.treeData = [];
        //TODO temp
        this.indexedDbService.initializeDatabase('5a203e2984ae98b394159cb2');
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.segmentsService.getSegmentConformanceStatements(this.segmentId, conformanceStatementData => {
            this.segmentConformanceStatements = conformanceStatementData;
        });

        console.log("SegmentId:" + this.segmentId);

        this.segmentsService.getSegmentStructure(this.segmentId, segStructure  => {
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
    }

    popChild(id, dtId, parentTreeNode){

        this.datatypesService.getDatatypeStructure(dtId, dtStructure  => {
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

    checkNewConformanceStatement(){
        if(!this.selectedConformanceStatement) return false;
        if(!this.selectedConformanceStatement.identifier || this.selectedConformanceStatement.identifier === '') return false;
        if(!this.selectedConformanceStatement.type) return false;
        if(this.selectedConformanceStatement.type === 'FREE'){
            if(!this.selectedConformanceStatement.freeText || this.selectedConformanceStatement.freeText === ''){
                return false;
            }
        }else if(this.selectedConformanceStatement.type === 'ASSERTION'){
            if(this.selectedConformanceStatement.assertion.mode === 'SIMPLE'){
                if(!this.selectedConformanceStatement.assertion.subject) return false;
                if(!this.selectedConformanceStatement.assertion.verbKey) return false;
                if(!this.selectedConformanceStatement.assertion.complement) return false;
                if(!this.selectedConformanceStatement.assertion.complement.complementKey) return false;
                if(this.selectedConformanceStatement.assertion.complement.complementKey === 'SAMEVALUE'){
                    if(!this.selectedConformanceStatement.assertion.complement.value) return false;
                }else if(this.selectedConformanceStatement.assertion.complement.complementKey === 'LISTVALUE'){
                    if(!this.selectedConformanceStatement.assertion.complement.values) return false;
                }
            }
        }

        return true;
    }

    changeType(){
        if(this.selectedConformanceStatement.type == 'ASSERTION'){
            this.selectedConformanceStatement.assertion = {};
        }else if(this.selectedConformanceStatement.type == 'FREE'){
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

    addCS(){
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

}
