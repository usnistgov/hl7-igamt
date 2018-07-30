/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import { _ }  from 'underscore';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {ConstraintsService} from "../../../../service/constraints/constraints.service";
import {DatatypesService} from "../datatypes.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";

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
    @ViewChild('editForm') editForm: NgForm;
    backup:any;
    idMap: any;
    treeData: any[];
    constraintTypes: any = [];
    assertionModes: any = [];

    selectedConformanceStatement: any = {};

    listTab: boolean = true;
    editorTab: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router : Router,
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
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypeConformanceStatements(this.datatypeId).then(conformanceStatementData => {
            this.datatypeConformanceStatements = conformanceStatementData;
            this.backup=__.cloneDeep(this.datatypeConformanceStatements);
        });

        this.datatypesService.getDatatypeStructure(this.datatypeId).then( dtStructure  => {
            this.idMap[this.datatypeId] = {name:dtStructure.name};

            var rootData = {elementId:this.datatypeId};

            for (let child of dtStructure.children) {
                var childData =  JSON.parse(JSON.stringify(rootData));
                childData.child = {
                    elementId: child.data.id,
                };

                if(child.data.max === '1'){
                    childData.child.instanceParameter = '1';
                }else if (child.data.max){
                    childData.child.instanceParameter = '*';
                }else {
                    childData.child.instanceParameter = '1';
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

                this.idMap[this.datatypeId + '-' + data.id] = data;
                this.popChild(this.datatypeId + '-' + data.id, data.dtId, treeNode);
                this.treeData.push(treeNode);
            }
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
        this.selectedConformanceStatement.assertion = {mode:this.selectedConformanceStatement.assertion.mode};
    }

    submitCS(){
        if(this.selectedConformanceStatement.type === 'ASSERTION') this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.idMap);
        this.deleteCS(this.selectedConformanceStatement.identifier);
        this.datatypeConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
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
        this.datatypeConformanceStatements.conformanceStatements = _.without(this.datatypeConformanceStatements.conformanceStatements, _.findWhere(this.datatypeConformanceStatements.conformanceStatements, {identifier: identifier}));
    }

    printCS(cs){
        console.log(cs);
    }

    onTabOpen(e) {
        if(e.index === 0) this.selectedConformanceStatement = {};
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

      console.log("error saving");
      reject();

    });
  })}


}
