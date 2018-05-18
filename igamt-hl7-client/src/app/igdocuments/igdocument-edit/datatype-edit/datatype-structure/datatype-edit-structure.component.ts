/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";

import {DatatypesService} from "../../../../service/datatypes/datatypes.service";
import {ConstraintsService} from "../../../../service/constraints/constraints.service";
import { _ } from 'underscore';

@Component({
  selector : 'datatype-edit',
  templateUrl : './datatype-edit-structure.component.html',
  styleUrls : ['./datatype-edit-structure.component.css']
})
export class DatatypeEditStructureComponent {
    valuesetColumnWidth:string = '200px';
    currentUrl:any;
    datatypeId:any;
    datatypeStructure:any;
    usages:any;
    cUsages:any;
    datatypeOptions:any = [];
    valuesetOptions:any = [{label:'Select ValueSet', value:null}];
    textDefinitionDialogOpen:boolean = false;
    selectedNode:any;
    valuesetStrengthOptions:any = [];

    preciateEditorOpen:boolean = false;

    selectedPredicate: any = {};
    constraintTypes: any = [];
    assertionModes: any = [];
    idMap: any;
    treeData: any[];

    valuesetsLinks :any = [
        {
            id:'AAAAA',
            bindingIdentifier: 'HL70001_IZ',
            label:'HL70001',
            domainInfo:{
                scope:'USER',
                version:'2.4'
            }
        },
        {
            id:'BBBBB',
            bindingIdentifier: 'HL70002_IZ',
            label:'HL70002',
            domainInfo:{
                scope:'USER',
                version:'2.4'
            }
        },
        {
            id:'CCCCC',
            bindingIdentifier: 'HL70003_IZ',
            label:'HL70003',
            domainInfo:{
                scope:'USER',
                version:'2.4'
            }
        },
        {
            id:'DDDDD',
            bindingIdentifier: 'HL70004_IZ',
            label:'HL70004',
            domainInfo:{
                scope:'USER',
                version:'2.4'
            }
        }

    ];
    datatypesLinks :any = [
        {
            id:'mock_ARBITRARY_CWE',
            name: 'CWE',
            exe: 'TXT',
            label:'CWE_TXT',
            domainInfo:{
                scope:'USER',
                version:'2.4'
            },
            leaf:false
        },
        {
            id:'mock_ARBITRARY_CWE2',
            name: 'CWE',
            exe: 'TXT2',
            label:'CWE_TXT2',
            domainInfo:{
                scope:'USER',
                version:'2.4'
            },
            leaf:false
        },
        {
            id:'mock_ARBITRARY_ID',
            name: 'ID',
            label:'ID',
            domainInfo:{
                scope:'HL7STANDARD',
                version:'2.4'
            },
            leaf:true
        },
        {
            id:'mock_ARBITRARY_SI',
            name: 'SI',
            label:'SI',
            domainInfo:{
                scope:'HL7STANDARD',
                version:'2.4'
            },
            leaf:true
        },
        {
            id:'mock_ARBITRARY_ST',
            name: 'ST',
            label:'ST',
            domainInfo:{
                scope:'HL7STANDARD',
                version:'2.4'
            },
            leaf:true
        },
        {
            id:'mock_ARBITRARY_XCN',
            name: 'XCN',
            label:'XCN',
            domainInfo:{
                scope:'HL7STANDARD',
                version:'2.4'
            },
            leaf:false
        }
    ];

    constructor(private route: ActivatedRoute, private  router : Router, private configService : GeneralConfigurationService, private datatypesService : DatatypesService, private constraintsService : ConstraintsService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypeStructure(this.datatypeId, structure  => {
            this.datatypeStructure = {};
            this.datatypeStructure.name = structure.name;
            this.datatypeStructure.ext = structure.ext;
            this.datatypeStructure.scope = structure.scope;

            this.updateDatatype(this.datatypeStructure, structure.children, structure.binding, null, null, null, null);
        });

        this.usages = this.configService._usages;
        this.cUsages = this.configService._cUsages;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;
        for (let dt of this.datatypesLinks) {
            var dtOption = {label: dt.label, value : dt.id};
            this.datatypeOptions.push(dtOption);
        }
        for (let vs of this.valuesetsLinks) {
            var vsOption = {label: vs.label, value : vs.id};
            this.valuesetOptions.push(vsOption);
        }

        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
    }

    updateDatatype(node, children, currentBinding, parentComponentId, datatypeBinding, parentDTId, parentDTName){
        for (let entry of children) {
            if(!entry.data.displayData) entry.data.displayData = {};
            entry.data.displayData.datatype = this.getDatatypeLink(entry.data.ref.id);
            entry.data.displayData.valuesetAllowed = this.configService.isValueSetAllow(entry.data.displayData.datatype.name,entry.data.position, parentDTName, null, entry.data.displayData.type);
            entry.data.displayData.valueSetLocationOptions = this.configService.getValuesetLocations(entry.data.displayData.datatype.name, entry.data.displayData.datatype.domainInfo.version);
            if(entry.data.displayData.valuesetAllowed) entry.data.displayData.multipleValuesetAllowed =  this.configService.isMultipleValuseSetAllowed(entry.data.displayData.datatype.name);
            if(entry.data.displayData.datatype.leaf) entry.leaf = true;
            else entry.leaf = false;

            if(parentComponentId === null){
                entry.data.displayData.idPath = entry.data.id;
            }else{
                entry.data.displayData.idPath = parentComponentId + '-' + entry.data.id;
            }

            if(entry.data.displayData.idPath.split("-").length === 1){
                entry.data.displayData.type = 'COMPONENT';
                entry.data.displayData.datatypeBinding = this.findBinding(entry.data.displayData.idPath, currentBinding);

                if(entry.data.usage === 'C' && !entry.data.displayData.datatypeBinding) {
                    entry.data.displayData.datatypeBinding = {};
                    entry.data.displayData.datatypeBinding.predicate = {};
                }
            }else if(entry.data.displayData.idPath.split("-").length === 2){
                entry.data.displayData.type = 'SUBCOMPONENT';
                entry.data.displayData.componentDT = parentDTId;
                entry.data.displayData.datatypeBinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], datatypeBinding);
                entry.data.displayData.componentDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], currentBinding);
                if(entry.data.usage === 'C' && !entry.data.displayData.componentDTbinding) {
                    entry.data.displayData.componentDTbinding = {};
                    entry.data.displayData.segmentBinding.componentDTbinding = {};
                }
            }

            this.setHasSingleCode(entry.data.displayData);
            this.setHasValueSet(entry.data.displayData);
        }

        node.children = children;
    }

    setHasSingleCode(displayData){
        if(displayData.datatypeBinding || displayData.componentDTbinding){
            if(displayData.datatypeBinding && displayData.datatypeBinding.internalSingleCode && displayData.datatypeBinding.internalSingleCode !== ''){
                displayData.hasSingleCode = true;
            }else if(displayData.datatypeBinding && displayData.datatypeBinding.externalSingleCode && displayData.datatypeBinding.externalSingleCode !== ''){
                displayData.hasSingleCode = true;
            }else if(displayData.componentDTbinding && displayData.componentDTbinding.internalSingleCode && displayData.componentDTbinding.internalSingleCode !== ''){
                displayData.hasSingleCode = true;
            }else if(displayData.componentDTbinding && displayData.componentDTbinding.externalSingleCode && displayData.componentDTbinding.externalSingleCode !== ''){
                displayData.hasSingleCode = true;
            }else {
                displayData.hasSingleCode = false;
            }
        }else {
            displayData.hasSingleCode = false;
        }
    }

    setHasValueSet(displayData){
        if(displayData.datatypeBinding || displayData.componentDTbinding){
            if(displayData.datatypeBinding && displayData.datatypeBinding.valuesetBindings && displayData.datatypeBinding.valuesetBindings.length > 0){
                displayData.hasValueSet = true;
            }else if(displayData.componentDTbinding && displayData.componentDTbinding.valuesetBindings && displayData.componentDTbinding.valuesetBindings.length > 0){
                displayData.hasValueSet = true;
            }else {
                displayData.hasValueSet = false;
            }
        }else {
            displayData.hasValueSet = false;
        }
    }

    getValueSetElm(id){
        for(let link of this.valuesetsLinks){
            if(link.id === id) return link;
        }
        return null;
    }

    getDatatypeElm(id){
        for(let link of this.datatypesLinks){
            if(link.id === id) return link;
        }
        return null;
    }

    addNewValueSet(node){
        if(!node.data.displayData.datatypeBinding) node.data.displayData.datatypeBinding = [];
        if(!node.data.displayData.datatypeBinding.valuesetBindings) node.data.displayData.datatypeBinding.valuesetBindings = [];

        node.data.displayData.datatypeBinding.valuesetBindings.push({edit:true, newvalue : {}});
        this.valuesetColumnWidth = '500px';
    }

    updateValueSetBindings(binding){
        var result = JSON.parse(JSON.stringify(binding));
        if(result && result.valuesetBindings){
            for(let vs of result.valuesetBindings){
                var displayValueSetLink = this.getValueSetLink(vs.valuesetId);
                vs.bindingIdentifier = displayValueSetLink.displayValueSetLink;
                vs.label = displayValueSetLink.label;
                vs.domainInfo = displayValueSetLink.domainInfo;
            }
        }
        return result;
    }

    findBinding(id, binding){
        if(binding && binding.children){
            for(let b of binding.children){
                if(b.elementId === id) return this.updateValueSetBindings(b);
            }
        }
        return null;
    }

    delLength(node){
        node.data.minLength = 'NA';
        node.data.maxLength = 'NA';
        node.data.confLength = '';
    }

    delConfLength(node){
        node.data.minLength = '';
        node.data.maxLength = '';
        node.data.confLength = 'NA';
    }

    makeEditModeForDatatype(node){
        node.data.displayData.datatype.edit = true;
        node.data.displayData.datatype.dtOptions = [];

        for (let dt of this.datatypesLinks) {
            if(dt.name === node.data.displayData.datatype.name){
                var dtOption = {label: dt.label, value : dt.id};
                node.data.displayData.datatype.dtOptions.push(dtOption);
            }
        }
        node.data.displayData.datatype.dtOptions.push({label: 'Change Datatype root', value : null});
    }

    loadNode(event) {
        if(event.node && !event.node.children) {
            var datatypeId = event.node.data.ref.id;
            this.datatypesService.getDatatypeStructure(datatypeId, structure  => {
                this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.displayData.idPath, event.node.data.displayData.datatypeBinding, event.node.data.displayData.componentDT, event.node.data.displayData.datatype.name);
            });
        }
    }

    onDatatypeChange(node){
        if(!node.data.displayData.datatype.id) {
            node.data.displayData.datatype.id = node.data.ref.id;
        }
        else node.data.ref.id = node.data.displayData.datatype.id;
        node.data.displayData.datatype = this.getDatatypeLink(node.data.displayData.datatype.id);
        node.children = null;
        node.expanded = false;
        if(node.data.displayData.datatype.leaf) node.leaf = true;
        else node.leaf = false;
        node.data.displayData.datatype.edit = false;


        node.data.displayData.valuesetAllowed = this.configService.isValueSetAllow(node.data.displayData.datatype.name,node.data.position, null, null, node.data.displayData.type);
        node.data.displayData.valueSetLocationOptions = this.configService.getValuesetLocations(node.data.displayData.datatype.name, node.data.displayData.datatype.domainInfo.version);
    }

    makeEditModeForValueSet(vs){
        vs.newvalue = {};
        vs.newvalue.valuesetId = vs.valuesetId;
        vs.newvalue.strength = vs.strength;
        vs.newvalue.valuesetLocations = vs.valuesetLocations;
        vs.edit = true;
        this.valuesetColumnWidth = '500px';
    }

    makeEditModeForComment(c){
        c.newComment = {};
        c.newComment.description = c.description;
        c.edit = true;
    }

    addNewComment(node){
        if(!node.data.displayData.datatypeBinding) node.data.displayData.datatypeBinding = [];
        if(!node.data.displayData.datatypeBinding.comments) node.data.displayData.datatypeBinding.comments = [];
        node.data.displayData.datatypeBinding.comments.push({edit:true, newComment : {description:''}});
    }

    addNewSingleCode(node){
        if(!node.data.displayData.datatypeBinding) node.data.displayData.datatypeBinding = {};
        if(!node.data.displayData.datatypeBinding.externalSingleCode) node.data.displayData.datatypeBinding.externalSingleCode = {};
        node.data.displayData.datatypeBinding.externalSingleCode.newSingleCode = '';
        node.data.displayData.datatypeBinding.externalSingleCode.newSingleCodeSystem = '';
        node.data.displayData.datatypeBinding.externalSingleCode.edit = true;
    }

    submitNewSingleCode(node){
        node.data.displayData.datatypeBinding.externalSingleCode.value = node.data.displayData.datatypeBinding.externalSingleCode.newSingleCode;
        node.data.displayData.datatypeBinding.externalSingleCode.codeSystem = node.data.displayData.datatypeBinding.externalSingleCode.newSingleCodeSystem;
        node.data.displayData.datatypeBinding.externalSingleCode.edit = false;
    }

    makeEditModeForSingleCode(node){
        node.data.displayData.datatypeBinding.externalSingleCode.newSingleCode = node.data.displayData.datatypeBinding.externalSingleCode.value;
        node.data.displayData.datatypeBinding.externalSingleCode.newSingleCodeSystem = node.data.displayData.datatypeBinding.externalSingleCode.codeSystem;
        node.data.displayData.datatypeBinding.externalSingleCode.edit = true;
    }

    deleteSingleCode(node){
        node.data.displayData.datatypeBinding.externalSingleCode = null;
        node.data.displayData.hasSingleCode = false;
    }

    addNewConstantValue(node){
        if(!node.data.displayData.datatypeBinding) node.data.displayData.datatypeBinding = {};
        node.data.displayData.datatypeBinding.constantValue = null;
        node.data.displayData.datatypeBinding.newConstantValue= '';
        node.data.displayData.datatypeBinding.editConstantValue = true;

        console.log(node);
    }

    deleteConstantValue(node){
        node.data.displayData.datatypeBinding.constantValue = null;
        node.data.displayData.datatypeBinding.editConstantValue = false;
    }

    makeEditModeForConstantValue(node){
        node.data.displayData.datatypeBinding.newConstantValue = node.data.displayData.datatypeBinding.constantValue;
        node.data.displayData.datatypeBinding.editConstantValue = true;
    }

    submitNewConstantValue(node){
        node.data.displayData.datatypeBinding.constantValue = node.data.displayData.datatypeBinding.newConstantValue;
        node.data.displayData.datatypeBinding.editConstantValue = false;
    }

    submitNewValueSet(vs){
        var displayValueSetLink = this.getValueSetLink(vs.newvalue.valuesetId);
        vs.bindingIdentifier = displayValueSetLink.displayValueSetLink;
        vs.label = displayValueSetLink.label;
        vs.domainInfo = displayValueSetLink.domainInfo;
        vs.valuesetId = vs.newvalue.valuesetId;
        vs.strength = vs.newvalue.strength;
        vs.valuesetLocations = vs.newvalue.valuesetLocations;
        vs.edit = false;
        this.valuesetColumnWidth = '200px';
    }

    submitNewComment(c){
        c.description = c.newComment.description;
        c.dateupdated = new Date();
        c.edit = false;
    }

    delValueSetBinding(binding, vs, node){
        binding.valuesetBindings = _.without(binding.valuesetBindings, _.findWhere(binding.valuesetBindings, {valuesetId: vs.valuesetId}));
        this.setHasValueSet(node);
    }

    delCommentBinding(binding, c){
        binding.comments = _.without(binding.comments, _.findWhere(binding.comments, c));
    }

    delTextDefinition(node){
        node.data.text = null;
    }

    getDatatypeLink(id){
        for (let dt of this.datatypesLinks) {
            if(dt.id === id) return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing DT:::" + id);
        return null;
    }

    getValueSetLink(id){
        for(let v of this.valuesetsLinks) {
            if(v.id === id) return JSON.parse(JSON.stringify(v));
        }
        console.log("Missing ValueSet:::" + id);
        return null;
    }

    editTextDefinition(node){
        this.selectedNode = node;
        this.textDefinitionDialogOpen = true;
    }

    truncate(txt){
        if(txt.length < 10) return txt;
        else return txt.substring(0,10) + "...";
    }

    print(data){
        console.log(data);
    }

    editPredicate(node){
        this.selectedNode = node;
        if(this.selectedNode.data.displayData.datatypeBinding) this.selectedPredicate = JSON.parse(JSON.stringify(this.selectedNode.data.displayData.datatypeBinding.predicate));
        if(!this.selectedPredicate) this.selectedPredicate = {};

        this.idMap = {};
        this.treeData = [];

        this.datatypesService.getDatatypeStructure(this.datatypeId, dtStructure  => {
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
        this.preciateEditorOpen = true;
    }

    submitCP(){
        if(this.selectedPredicate.type === 'ASSERTION') {
            this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedPredicate.assertion, this.idMap);
            this.selectedPredicate.assertion.description = 'If ' + this.selectedPredicate.assertion.description;
            this.selectedPredicate.freeText = undefined;
        }
        if(!this.selectedNode.data.displayData.datatypeBinding) this.selectedNode.data.displayData.datatypeBinding = {};
        this.selectedNode.data.displayData.datatypeBinding.predicate = this.selectedPredicate;
        this.preciateEditorOpen = false;
        this.selectedPredicate = {};
        this.selectedNode = null;
    }

    changeType(){
        if(this.selectedPredicate.type == 'ASSERTION'){
            this.selectedPredicate.assertion = {};
            this.selectedPredicate.assertion = {mode:"SIMPLE"};
        }else if(this.selectedPredicate.type == 'FREE'){
            this.selectedPredicate.assertion = undefined;
        }else if(this.selectedPredicate.type == 'PREDEFINEDPATTERNS'){
            this.selectedPredicate.assertion = undefined;
        }else if(this.selectedPredicate.type == 'PREDEFINED'){
            this.selectedPredicate.assertion = undefined;
        }
    }

    changeAssertionMode(){
        if(this.selectedPredicate.assertion.mode == 'SIMPLE'){
            this.selectedPredicate.assertion = {mode:"SIMPLE"};
        }else if(this.selectedPredicate.assertion.mode == 'COMPLEX'){
            this.selectedPredicate.assertion = {mode:"COMPLEX"};
        }
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

    onUsageChange(node){
        if(node.data.usage === 'C') {
            if(!node.data.displayData.datatypeBinding) {
                node.data.displayData.datatypeBinding = {};
            }
            if(!node.data.displayData.datatypeBinding.predicate){
                node.data.displayData.datatypeBinding.predicate = {};
            }
        }else if(node.data.usage !== 'C') {
            if(node.data.displayData.datatypeBinding && node.data.displayData.datatypeBinding.predicate) {
                node.data.displayData.datatypeBinding.predicate = undefined;
            }
        }
    }
}
