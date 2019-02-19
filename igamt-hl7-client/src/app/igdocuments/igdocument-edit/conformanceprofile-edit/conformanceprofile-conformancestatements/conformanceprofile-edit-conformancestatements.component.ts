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
import {ConformanceProfilesService} from "../conformance-profiles.service";


@Component({
    templateUrl : './conformanceprofile-edit-conformancestatements.component.html',
    styleUrls : ['./conformanceprofile-edit-conformancestatements.component.css']
})
export class ConformanceprofileEditConformancestatementsComponent  implements WithSave{
    cols:any;
    aCols:any;
    currentUrl:any;
    messageId:any;
    igId:any;
    messageConformanceStatements:any;
    constraintTypes: any = [];
    assertionModes: any = [];
    backup:any;
    dtKeys : any[] = [];
    segKeys : any[] = [];

    selectedConformanceStatement: any = {};
    messageStructure : any;
    csEditor:boolean = false;
    backupCS:any;
    showContextTree : boolean = false;

    changeItems:any[] = [];

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(
        private route: ActivatedRoute,
        private router : Router,
        private conformanceProfilesService : ConformanceProfilesService,
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
            { field: 'context', header: 'CONTEXT', colStyle: {width: '20em'}},
            { field: 'description', header: 'Description' }
        ];

        this.aCols = [
            { field: 'identifier', header: 'ID', colStyle: {width: '20em'}, sort:'identifier'},
            { field: 'description', header: 'Description' }
        ];
    }

    ngOnInit() {
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.igId = this.router.url.split("/")[2];
        this.messageId = this.route.snapshot.params["conformanceprofileId"];

        this.route.data.subscribe(data => {
            const x = data.conformanceprofileConformanceStatements;
            this.messageConformanceStatements= x;
            if(!this.messageConformanceStatements.conformanceStatements) this.messageConformanceStatements.conformanceStatements = [];
            this.backup=__.cloneDeep(this.messageConformanceStatements);
            this.segKeys = Array.from( new Map(Object.entries(this.messageConformanceStatements.associatedSEGConformanceStatementMap)).keys() );
            this.dtKeys = Array.from( new Map(Object.entries(this.messageConformanceStatements.associatedDTConformanceStatementMap)).keys() );
        });
    }

    reset(){
        this.messageConformanceStatements=__.cloneDeep(this.backup);
        this.changeItems = [];
        this.editForm.control.markAsPristine();
    }

    getCurrent(){
        return  this.messageConformanceStatements;
    }

    getBackup(){
        return this.backup;
    }

    canSave(){
        return true;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.conformanceProfilesService.save(this.messageId, this.changeItems).then(saved=>{
                this.backup = __.cloneDeep(this.messageConformanceStatements);
                this.changeItems = [];
                this.editForm.control.markAsPristine();
                resolve(true);

            }, error=>{


                reject(error);
                console.log("error saving");
            });
        });
    }


    changeType(){
        if(this.selectedConformanceStatement.displayType == 'simple'){
            this.selectedConformanceStatement.assertion = {};
            this.selectedConformanceStatement.type = "ASSERTION";
            this.selectedConformanceStatement.assertion = {mode:"SIMPLE"};
        }else if(this.selectedConformanceStatement.displayType == 'free'){
            this.selectedConformanceStatement.assertion = undefined;
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

    submitCS(){
        this.selectedConformanceStatement.displayType = undefined;
        if(this.deleteCS(this.selectedConformanceStatement.identifier, true)){
            let item:any = {};
            item.location = this.selectedConformanceStatement.identifier;
            item.propertyType = 'STATEMENT';
            item.propertyValue = this.selectedConformanceStatement;
            item.changeType = "UPDATE";
            this.changeItems.push(item);
        }else {
            let item:any = {};
            item.location = this.selectedConformanceStatement.identifier;
            item.propertyType = 'STATEMENT';
            item.propertyValue = this.selectedConformanceStatement;
            item.changeType = "ADD";
            this.changeItems.push(item);
        }

        if(this.selectedConformanceStatement.type === 'ASSERTION') this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.messageStructure, 'D');
        this.messageConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
        this.selectedConformanceStatement = {};
        this.csEditor = false;


    }

    discardEdit(){
        this.selectedConformanceStatement = {};
        this.messageStructure = null;
        this.csEditor = false;
    }

    resetEdit(){
        this.selectedConformanceStatement = __.cloneDeep(this.backupCS);

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

        this.messageStructure = null;
        if(this.selectedConformanceStatement.context && this.selectedConformanceStatement.context.child){
            console.log(this.getIdList(this.selectedConformanceStatement.context.child, null));
            this.conformanceProfilesService.getConformanceProfileContextStructure(this.messageId, this.getIdList(this.selectedConformanceStatement.context.child, null)).then(data => {
                this.messageStructure = data;
                console.log(data);

            }, error => {
            });
        }else {
            this.conformanceProfilesService.getConformanceProfileStructure(this.messageId).then(data => {
                this.messageStructure = data;
                console.log(data);

            }, error => {
            });
        }
    }

    addNewCS(){
        this.selectedConformanceStatement = {};
        this.backupCS = {};
        this.conformanceProfilesService.getConformanceProfileStructure(this.messageId).then(data => {
            this.messageStructure = data;
            console.log(data);

        }, error => {
        });

        this.csEditor = true;
    }

    selectCS(cs){
        this.selectedConformanceStatement = __.cloneDeep(cs);
        this.backupCS = __.cloneDeep(cs);

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

        this.messageStructure = null;
        if(this.selectedConformanceStatement.context && this.selectedConformanceStatement.context.child){
            console.log(this.getIdList(this.selectedConformanceStatement.context.child, null));
            this.conformanceProfilesService.getConformanceProfileContextStructure(this.messageId, this.getIdList(this.selectedConformanceStatement.context.child, null)).then(data => {
                this.messageStructure = data;
                console.log(data);

            }, error => {
            });
        }else {
            this.conformanceProfilesService.getConformanceProfileStructure(this.messageId).then(data => {
                this.messageStructure = data;
                console.log(data);

            }, error => {
            });
        }

        this.csEditor = true;
    }

    deleteCS(identifier, forUpdate){
        var found = _.findWhere(this.messageConformanceStatements.conformanceStatements, {identifier: identifier});
        this.messageConformanceStatements.conformanceStatements = _.without(this.messageConformanceStatements.conformanceStatements, found);
        this.editForm.control.markAsDirty();

        if(!forUpdate){
            let item:any = {};
            item.location = identifier;
            item.propertyType = 'STATEMENT';
            item.propertyValue = null;
            item.changeType = "DELETE";
            this.changeItems.push(item);
        }

        if(found) return true;
        return false;
    }

    copyCS(cs) {
        if(cs){
            this.messageConformanceStatements.conformanceStatements.push(cs);
            this.messageConformanceStatements.availableConformanceStatements = _.without(this.messageConformanceStatements.availableConformanceStatements, cs);
            let item:any = {};
            item.location = cs.identifier;
            item.propertyType = 'STATEMENT';
            item.propertyValue = cs;
            item.changeType = "ADD";
            this.changeItems.push(item);
        }
    }

    printCS(cs){
        console.log(cs);
    }

    print(){
        console.log(this.messageConformanceStatements);
        console.log(this.changeItems);

    }

    onTabOpen(e) {
        if(e.index === 0) this.selectedConformanceStatement = {};
    }

    hasChanged(){
        if(this.changeItems && this.changeItems.length > 0) return true;
        return false;
    }

    editContextTree(){
        this.showContextTree = true;
    }

    selectTargetElementLocationForContext(location){
        this.selectedConformanceStatement = {};
        this.messageStructure = null;
        if(location.child){
            this.selectedConformanceStatement.context = location;

            console.log(this.getIdList(this.selectedConformanceStatement.context.child, null));
            this.conformanceProfilesService.getConformanceProfileContextStructure(this.messageId, this.getIdList(this.selectedConformanceStatement.context.child, null)).then(data => {
                this.messageStructure = data;
                console.log(data);

            }, error => {
            });
        }else {
            this.selectedConformanceStatement.context = null;

            this.conformanceProfilesService.getConformanceProfileStructure(this.messageId).then(data => {
                this.messageStructure = data;
                console.log(data);

            }, error => {
            });
        }
        this.showContextTree = false;

    }

    getIdList(object, result){
        console.log(object.elementId);
        console.log(result);
        if(object.elementId) {
            if(result){
                result = result + '-' + object.elementId;
            }else{
                result = object.elementId;
            }

            if(object.child){
                return this.getIdList(object.child, result)
            }else{
                return result;
            }
        }else {
            return result;
        }
    }

    getLocationLabel(location){
        if(location){
            let result:string = this.messageConformanceStatements.label;
            result = this.getChildLocation(location.child, this.messageConformanceStatements.structure, result, null);
            return result;
        }
        return null;
    }

    getChildLocation(path, list, result, elementName){
        if(path && list){
            for(let item of list){
                if(item.data.id === path.elementId) {
                    if(item.data.type === 'FIELD'){
                        result = result + '-' + item.data.position;
                    }else if(item.data.type === 'COMPONENT' || item.data.type === 'SUBCOMPONENT'){
                        result = result + '.' + item.data.position;
                    }else {
                        result = result + '.' + item.data.name;
                    }
                    elementName = item.data.name;

                    return this.getChildLocation(path.child,item.children, result, elementName);
                }
            }
        }
        return result;
    }
}
