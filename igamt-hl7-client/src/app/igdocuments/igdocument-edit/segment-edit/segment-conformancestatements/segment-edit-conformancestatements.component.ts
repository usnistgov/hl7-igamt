/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import { _ } from 'underscore';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {ConstraintsService} from "../../service/constraints.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as __ from 'lodash';
import {SegmentsService} from "../segments.service";
import {DatatypesService} from "../../datatype-edit/datatypes.service";
import {IgErrorService} from "../../ig-error/ig-error.service";
import {TocService} from "../../service/toc.service";

@Component({
    templateUrl : './segment-edit-conformancestatements.component.html',
    styleUrls : ['./segment-edit-conformancestatements.component.css']
})
export class SegmentEditConformanceStatementsComponent  implements WithSave{
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
    segmentStructure : any;
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
        private segmentsService : SegmentsService,
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
        this.segmentId = this.route.snapshot.params["segmentId"];

        this.route.data.subscribe(data => {
            this.segmentStructure = data.segmentStructure;
            const x = data.segmentConformanceStatements;
            this.segmentConformanceStatements= x;
            if(!this.segmentConformanceStatements.conformanceStatements) this.segmentConformanceStatements.conformanceStatements = [];
            this.backup=__.cloneDeep(this.segmentConformanceStatements);
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
        return new Promise((resolve, reject)=> {

            this.segmentsService.saveSegmentConformanceStatements(this.segmentId, this.segmentConformanceStatements).then(saved=>{

                this.backup = __.cloneDeep(this.segmentConformanceStatements);

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
        if(this.selectedConformanceStatement.displayType == 'simple'){
            this.selectedConformanceStatement.assertion = {};
            this.selectedConformanceStatement.type = "ASSERTION";
            this.selectedConformanceStatement.assertion = {mode:"SIMPLE"};
        }else if(this.selectedConformanceStatement.displayType == 'free'){
            this.selectedConformanceStatement.assertion = {};
            this.selectedConformanceStatement.type = "FREE";
        }else if(this.selectedConformanceStatement.displayType == 'simple-proposition'){
            this.selectedConformanceStatement.assertion = {};
            this.selectedConformanceStatement.type = "ASSERTION";
            this.selectedConformanceStatement.assertion = {mode:"IFTHEN"};
            this.selectedConformanceStatement.assertion.ifAssertion = {mode:"SIMPLE"};
            this.selectedConformanceStatement.assertion.thenAssertion = {mode:"SIMPLE"};
        }else if(this.selectedConformanceStatement.displayType == 'complex'){
            this.selectedConformanceStatement.assertion = {};
            this.selectedConformanceStatement.type = "ASSERTION";
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
        this.deleteCS(this.selectedConformanceStatement.identifier);
        if(this.selectedConformanceStatement.type === 'ASSERTION') this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.segmentStructure);

        this.segmentConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
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

        if(this.selectedConformanceStatement.type === 'FREE'){
            this.selectedConformanceStatement.displayType = 'free';
        }else if(this.selectedConformanceStatement.type === 'ASSERTION' && this.selectedConformanceStatement.assertion && this.selectedConformanceStatement.assertion.mode === 'SIMPLE'){
            this.selectedConformanceStatement.displayType = 'simple';
        }else if(this.selectedConformanceStatement.type === 'ASSERTION' && this.selectedConformanceStatement.assertion && this.selectedConformanceStatement.assertion.mode === 'IFTHEN'
            && this.selectedConformanceStatement.assertion.ifAssertion && this.selectedConformanceStatement.assertion.ifAssertion.mode === 'SIMPLE'
            && this.selectedConformanceStatement.assertion.thenAssertion && this.selectedConformanceStatement.assertion.thenAssertion.mode === 'SIMPLE'){
            this.selectedConformanceStatement.displayType = 'simple-proposition';
        }else {
            this.selectedConformanceStatement.displayType = 'complex';
        }

        this.editorTab = true;
        this.listTab = false;
    }

    deleteCS(identifier){
        this.segmentConformanceStatements.conformanceStatements = _.without(this.segmentConformanceStatements.conformanceStatements, _.findWhere(this.segmentConformanceStatements.conformanceStatements, {identifier: identifier}));
        this.editForm.control.markAsDirty();
    }

    printCS(cs){
        console.log(cs);
    }

    onTabOpen(e) {
        if(e.index === 0) this.selectedConformanceStatement = {};
    }

    hasChanged(){
        return this.editForm && this.editForm.touched && this.editForm.dirty;

    }
}
