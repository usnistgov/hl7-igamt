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

@Component({
    templateUrl : './conformanceprofile-edit-conformancestatements.component.html',
    styleUrls : ['./conformanceprofile-edit-conformancestatements.component.css']
})

export class ConformanceprofileEditConformancestatementsComponent implements WithSave {
    cols:any;
    currentUrl:any;
    conformanceProfileId:any;
    igId:any;
    conformanceProfileConformanceStatements:any;
    constraintTypes: any = [];
    assertionModes: any = [];
    backup:any;

    selectedConformanceStatement: any = {};
    conformanceProfileStructure : any;
    listTab: boolean = true;
    editorTab: boolean = false;

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
            { field: 'description', header: 'Description' }
        ];
    }

    ngOnInit() {
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.igId = this.router.url.split("/")[2];
        this.conformanceProfileId = this.route.snapshot.params["conformanceprofileId"];

        this.route.data.subscribe(data => {
            this.conformanceProfileStructure = data.conformanceProfileStructure;
            const x = data.conformanceProfileConformanceStatements;
            this.conformanceProfileConformanceStatements= x;
            if(!this.conformanceProfileConformanceStatements.conformanceStatements) this.conformanceProfileConformanceStatements.conformanceStatements = [];
            this.backup=__.cloneDeep(this.conformanceProfileConformanceStatements);
        });
    }

    reset(){
        this.conformanceProfileConformanceStatements=__.cloneDeep(this.backup);
        this.changeItems = [];
        this.editForm.control.markAsPristine();
    }

    getCurrent(){
        return  this.conformanceProfileConformanceStatements;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            this.conformanceProfilesService.saveConformanceProfile(this.conformanceProfileId, this.igId, this.changeItems).then(saved=>{
                this.backup = __.cloneDeep(this.conformanceProfileConformanceStatements);
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

        if(this.selectedConformanceStatement.type === 'ASSERTION') this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.conformanceProfileStructure, 'D');
        this.conformanceProfileConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
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

    deleteCS(identifier, forUpdate){
        var found = _.findWhere(this.conformanceProfileConformanceStatements.conformanceStatements, {identifier: identifier});
        this.conformanceProfileConformanceStatements.conformanceStatements = _.without(this.conformanceProfileConformanceStatements.conformanceStatements, found);
        this.editForm.control.markAsDirty();

        if(!forUpdate){
            let item:any = {};
            item.location = this.selectedConformanceStatement.identifier;
            item.propertyType = 'STATEMENT';
            item.propertyValue = null;
            item.changeType = "DELETE";
            this.changeItems.push(item);
        }

        if(found) return true;
        return false;
    }

    printCS(cs){
        console.log(cs);
    }

    print(){
        console.log(this.conformanceProfileConformanceStatements);
        console.log(this.changeItems);

    }

    onTabOpen(e) {
        if(e.index === 0) this.selectedConformanceStatement = {};
    }

    hasChanged(){
        if(this.changeItems && this.changeItems.length > 0) return true;
        return false;
    }
}
