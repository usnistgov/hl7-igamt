/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import {ConstraintsService} from "../../../../service/constraints/constraints.service";
import { _ } from 'underscore';
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as __ from 'lodash';
import {TocService} from "../../service/toc.service";
import {ConformanceProfilesService} from "../conformance-profiles.service";
import {SegmentsService} from "../../segment-edit/segments.service";
import {DatatypesService} from "../../datatype-edit/datatypes.service";

@Component({
    templateUrl : './conformanceprofile-edit-structure.component.html',
    styleUrls : ['./conformanceprofile-edit-structure.component.css']
})
export class ConformanceprofileEditStructureComponent implements WithSave {
    valuesetColumnWidth:string = '200px';
    currentUrl:any;
    conformanceprofileId:any;
    conformanceprofileStructure:any={};
    usages:any;
    cUsages:any;
    textDefinitionDialogOpen:boolean = false;
    selectedNode:any;
    valuesetStrengthOptions:any = [];

    preciateEditorOpen:boolean = false;

    selectedPredicate: any = {};
    constraintTypes: any = [];
    assertionModes: any = [];
    idMap: any;
    treeData: any[];

    datatypesLinks :any = [];
    datatypesOptions:any = [];
    segmentsLinks :any = [];
    segmentsOptions:any = [];
    valuesetsLinks :any = [];
    valuesetOptions:any = [{label:'Select ValueSet', value:null}];

    backup:any={};

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(public indexedDbService: IndexedDbService,
                private route: ActivatedRoute,
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
    }

    ngOnInit() {
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];

        this.usages = this.configService._usages;
        this.cUsages = this.configService._cUsages;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;

        this.route.data.map(data =>data.conformanceprofileStructure).subscribe(x=>{
            console.log(x);
            this.tocService.getSegmentsList().then((segTOCdata) => {
                let listTocSegs:any = segTOCdata;
                for(let entry of listTocSegs){
                    var treeObj = entry.data;

                    var segLink:any = {};
                    segLink.id = treeObj.key.id;
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

                    if(treeObj.lazyLoading) segLink.leaf = false;
                    else segLink.leaf = true;
                    this.segmentsLinks.push(segLink);

                    var segOption = {label: segLink.label, value : segLink.id};
                    this.segmentsOptions.push(segOption);
                }

                this.tocService.getDataypeList().then((dtTOCdata) => {
                    let listTocDts: any = dtTOCdata[0];
                    for (let entry of listTocDts) {
                        var treeObj = entry.data;

                        var dtLink: any = {};
                        dtLink.id = treeObj.key.id;
                        dtLink.label = treeObj.label;
                        dtLink.domainInfo = treeObj.domainInfo;
                        var index = treeObj.label.indexOf("_");
                        if (index > -1) {
                            dtLink.name = treeObj.label.substring(0, index);
                            dtLink.ext = treeObj.label.substring(index);
                            ;
                        } else {
                            dtLink.name = treeObj.label;
                            dtLink.ext = null;
                        }

                        if (treeObj.lazyLoading) dtLink.leaf = false;
                        else dtLink.leaf = true;
                        this.datatypesLinks.push(dtLink);

                        var dtOption = {label: dtLink.label, value: dtLink.id};
                        this.datatypesOptions.push(dtOption);


                        this.tocService.getValueSetList().then((valuesetTOCdata) => {
                            let listTocVSs: any = valuesetTOCdata[0];

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

                            this.conformanceprofileStructure = {};
                            this.conformanceprofileStructure.name = x.name;

                            this.updateMessage(x.children, x.binding, null);
                            // this.updateDatatype(this.conformanceprofileStructure, x.children, x.binding, null, null, null, null, null, null);

                            this.conformanceprofileStructure.children = x.children;
                            this.backup=__.cloneDeep(this.conformanceprofileStructure);
                        });
                    }
                });
            });
        });
    }

    reset(){
        this.conformanceprofileStructure=__.cloneDeep(this.backup);
    }

    getCurrent(){
        return  this.conformanceprofileStructure;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return true;
    }

    save(): Promise<any>{
        return this.conformanceProfilesService.saveConformanceProfileStructure(this.conformanceprofileId, this.conformanceprofileStructure);
    }

    updateMessage(children, currentBinding, parentFieldId){
        for (let entry of children) {
            if(!entry.data.displayData) entry.data.displayData = {};
            entry.leaf = false;
            if(parentFieldId === null){
                entry.data.displayData.idPath = entry.data.id;
            }else{
                entry.data.displayData.idPath = parentFieldId + '-' + entry.data.id;
            }

            if(entry.data.type === 'GROUP'){
                entry.data.displayData.type = 'GROUP';
                this.updateMessage(entry.children, currentBinding, entry.data.displayData.idPath)
            }else if (entry.data.type === 'SEGMENTREF'){
                entry.data.displayData.type = 'SEGMENT';
                entry.data.displayData.segment = this.getSegmentLink(entry.data.ref.id);
            }
        }
    }

    updateDatatype(node, children, currentBinding, parentFieldId, fieldDT, messageBinding, segmentBinding, fieldDTbinding, parentDTId, parentDTName, segmentName, type){
        for (let entry of children) {
            if(!entry.data.displayData) entry.data.displayData = {};
            entry.data.displayData.datatype = this.getDatatypeLink(entry.data.ref.id);
            entry.data.displayData.valuesetAllowed = this.configService.isValueSetAllow(entry.data.displayData.datatype.name,entry.data.position, parentDTName, segmentName, entry.data.displayData.type);
            entry.data.displayData.valueSetLocationOptions = this.configService.getValuesetLocations(entry.data.displayData.datatype.name, entry.data.displayData.datatype.domainInfo.version);
            if(entry.data.displayData.valuesetAllowed) entry.data.displayData.multipleValuesetAllowed =  this.configService.isMultipleValuseSetAllowed(entry.data.displayData.datatype.name);
            if(entry.data.displayData.datatype.leaf) entry.leaf = true;
            else entry.leaf = false;

            if(parentFieldId === null){
                entry.data.displayData.idPath = entry.data.id;
            }else{
                entry.data.displayData.idPath = parentFieldId + '-' + entry.data.id;
            }

            if(type === 'FIELD'){
                    entry.data.displayData.type = 'FIELD';
                    // entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath, currentBinding);
                    // if(entry.data.usage === 'C' && !entry.data.displayData.segmentBinding) {
                    //     entry.data.displayData.segmentBinding = {};
                    // }
                    // if(entry.data.usage === 'C' && !entry.data.displayData.segmentBinding.predicate){
                    //     entry.data.displayData.segmentBinding.predicate = {};
                    // }
            }else if(type === 'COMPONENT'){
                    entry.data.displayData.type = 'COMPONENT';
                    entry.data.displayData.fieldDT = parentDTId;
                //     entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], segmentBinding);
                //     entry.data.displayData.fieldDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], currentBinding);
            }else if(type === 'SUBCOMPONENT'){
                    entry.data.displayData.type = "SUBCOMPONENT";
                    entry.data.displayData.fieldDT = fieldDT;
                    entry.data.displayData.componentDT = parentDTId;
                    // entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], segmentBinding);
                    // entry.data.displayData.fieldDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], fieldDTbinding);
                    // entry.data.displayData.componentDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], currentBinding);
            }

            this.setHasSingleCode(entry.data.displayData);
            this.setHasValueSet(entry.data.displayData);
        }

        node.children = children;
    }

    setHasSingleCode(displayData){
        if(displayData.segmentBinding || displayData.fieldDTbinding || displayData.componentDTbinding){
            if(displayData.segmentBinding && displayData.segmentBinding.internalSingleCode && displayData.segmentBinding.internalSingleCode !== ''){
                displayData.hasSingleCode = true;
            }else if(displayData.segmentBinding && displayData.segmentBinding.externalSingleCode && displayData.segmentBinding.externalSingleCode !== ''){
                displayData.hasSingleCode = true;
            }else if(displayData.fieldDTbinding && displayData.fieldDTbinding.internalSingleCode && displayData.fieldDTbinding.internalSingleCode !== ''){
                displayData.hasSingleCode = true;
            }else if(displayData.fieldDTbinding && displayData.fieldDTbinding.externalSingleCode && displayData.fieldDTbinding.externalSingleCode !== ''){
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
        if(displayData.segmentBinding || displayData.fieldDTbinding || displayData.componentDTbinding){
            if(displayData.segmentBinding && displayData.segmentBinding.valuesetBindings && displayData.segmentBinding.valuesetBindings.length > 0){
                displayData.hasValueSet = true;
            }else if(displayData.fieldDTbinding && displayData.fieldDTbinding.valuesetBindings && displayData.fieldDTbinding.valuesetBindings.length > 0){
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
        if(!node.data.displayData.segmentBinding) node.data.displayData.segmentBinding = [];
        if(!node.data.displayData.segmentBinding.valuesetBindings) node.data.displayData.segmentBinding.valuesetBindings = [];

        node.data.displayData.segmentBinding.valuesetBindings.push({edit:true, newvalue : {}});
        this.valuesetColumnWidth = '500px';
    }

    updateValueSetBindings(binding){
        var result = JSON.parse(JSON.stringify(binding));
        if(result && result.valuesetBindings){
            for(let vs of result.valuesetBindings){
                var displayValueSetLink = this.getValueSetLink(vs.valuesetId);
                // vs.bindingIdentifier = displayValueSetLink.displayValueSetLink;
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
            if(event.node.data.type === 'SEGMENTREF'){
                var segmentId = event.node.data.ref.id;
                this.segmentsService.getSegmentStructure(segmentId).then(structure  => {
                    this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.displayData.idPath, null, event.node.data.displayData.messageBinding, null, null, null, null, structure.name, 'FIELD');
                });
            }else {
                var datatypeId = event.node.data.ref.id;
                this.datatypesService.getDatatypeStructure(datatypeId).then(structure  => {
                    this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.displayData.idPath, datatypeId, event.node.data.displayData.messageBinding, event.node.data.displayData.segmentBinding, event.node.data.displayData.fieldDTBinding, event.node.data.displayData.fieldDT, event.node.data.displayData.datatype.name, null, event.node.data.displayData.type);
                });
            }
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
        if(!node.data.displayData.segmentBinding) node.data.displayData.segmentBinding = [];
        if(!node.data.displayData.segmentBinding.comments) node.data.displayData.segmentBinding.comments = [];
        node.data.displayData.segmentBinding.comments.push({edit:true, newComment : {description:''}});
    }

    addNewSingleCode(node){
        if(!node.data.displayData.segmentBinding) node.data.displayData.segmentBinding = {};
        if(!node.data.displayData.segmentBinding.externalSingleCode) node.data.displayData.segmentBinding.externalSingleCode = {};
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCode = '';
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem = '';
        node.data.displayData.segmentBinding.externalSingleCode.edit = true;
    }

    submitNewSingleCode(node){
        node.data.displayData.segmentBinding.externalSingleCode.value = node.data.displayData.segmentBinding.externalSingleCode.newSingleCode;
        node.data.displayData.segmentBinding.externalSingleCode.codeSystem = node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem;
        node.data.displayData.segmentBinding.externalSingleCode.edit = false;
    }

    makeEditModeForSingleCode(node){
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCode = node.data.displayData.segmentBinding.externalSingleCode.value;
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem = node.data.displayData.segmentBinding.externalSingleCode.codeSystem;
        node.data.displayData.segmentBinding.externalSingleCode.edit = true;
    }

    deleteSingleCode(node){
        node.data.displayData.segmentBinding.externalSingleCode = null;
        node.data.displayData.hasSingleCode = false;
    }

    addNewConstantValue(node){
        if(!node.data.displayData.segmentBinding) node.data.displayData.segmentBinding = {};
        node.data.displayData.segmentBinding.constantValue = null;
        node.data.displayData.segmentBinding.newConstantValue= '';
        node.data.displayData.segmentBinding.editConstantValue = true;

        console.log(node);
    }

    deleteConstantValue(node){
        node.data.displayData.segmentBinding.constantValue = null;
        node.data.displayData.segmentBinding.editConstantValue = false;
    }

    makeEditModeForConstantValue(node){
        node.data.displayData.segmentBinding.newConstantValue = node.data.displayData.segmentBinding.constantValue;
        node.data.displayData.segmentBinding.editConstantValue = true;
    }

    submitNewConstantValue(node){
        node.data.displayData.segmentBinding.constantValue = node.data.displayData.segmentBinding.newConstantValue;
        node.data.displayData.segmentBinding.editConstantValue = false;
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

    getSegmentLink(id){
        for (let dt of this.segmentsLinks) {
            if(dt.id === id) return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing SEG:::" + id);
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

    submitCP(){
        if(this.selectedPredicate.type === 'ASSERTION') {
            this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedPredicate.assertion, this.idMap);
            this.selectedPredicate.assertion.description = 'If ' + this.selectedPredicate.assertion.description;
            this.selectedPredicate.freeText = undefined;
        }
        if(!this.selectedNode.data.displayData.segmentBinding) this.selectedNode.data.displayData.segmentBinding = {};
        this.selectedNode.data.displayData.segmentBinding.predicate = this.selectedPredicate;
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

    onUsageChange(node){
        if(node.data.usage === 'C') {
            if(!node.data.displayData.segmentBinding) {
                node.data.displayData.segmentBinding = {};
            }
            if(!node.data.displayData.segmentBinding.predicate){
                node.data.displayData.segmentBinding.predicate = {};
            }
        }else if(node.data.usage !== 'C') {
            if(node.data.displayData.segmentBinding && node.data.displayData.segmentBinding.predicate) {
                node.data.displayData.segmentBinding.predicate = undefined;
            }
        }
    }
}
