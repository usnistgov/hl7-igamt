/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {ConstraintsService} from "../../../../service/constraints/constraints.service";
import { _ } from 'underscore';
import {WithSave, WithNotification} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as __ from 'lodash';
import {TocService} from "../../service/toc.service";
import {SegmentsService} from "../segments.service";
import {DatatypesService} from "../../datatype-edit/datatypes.service";

@Component({
    selector : 'segment-edit',
    templateUrl : './segment-edit-structure.component.html',
    styleUrls : ['./segment-edit-structure.component.css']
})
export class SegmentEditStructureComponent implements WithSave {
    currentUrl:any;
    segmentId:any;
    segmentStructure:any;
    usages:any;
    cUsages:any;

    textDefinitionDialogOpen:boolean = false;
    changeDTDialogOpen:boolean = false;
    valuesetDialogOpen:boolean = false;
    singleCodeDialogOpen:boolean = false;
    constantValueDialogOpen:boolean = false;
    commentDialogOpen:boolean = false;

    selectedNode:any;
    selectedVS:any;
    selectedSingleCode:any;
    selectedConstantValue:any;
    selectedComment:any;
    valuesetStrengthOptions:any = [];

    preciateEditorOpen:boolean = false;
    selectedPredicate: any = {};
    constraintTypes: any = [];
    assertionModes: any = [];
    idMap: any;
    treeData: any[];

    valuesetsLinks :any = [];
    datatypesLinks :any = [];
    datatypeOptions:any = [];
    valuesetOptions:any = [{label:'Select ValueSet', value:null}];

    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private configService : GeneralConfigurationService, private segmentsService : SegmentsService, private datatypesService : DatatypesService,
                private constraintsService : ConstraintsService,
                private tocService:TocService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.segmentId = this.route.snapshot.params["segmentId"];

        this.usages = this.configService._usages;
        this.cUsages = this.configService._cUsages;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;

        this.route.data.map(data =>data.segmentStructure).subscribe(x=>{
            x.children = _.sortBy(x.children, function(child){ return child.data.position});
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

                    this.segmentStructure = {};
                    this.segmentStructure = x;

                    this.updateDatatype(this.segmentStructure, x.children, x.binding, null, null, null, null, null, null);

                    this.backup=__.cloneDeep(this.segmentStructure);
                });
            });

        });
    }

    reset(){
        this.segmentStructure=__.cloneDeep(this.backup);
      this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.segmentStructure;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        // return !this.editForm.invalid;
        return true;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            let saveObj:any = {};
            saveObj.id = this.segmentStructure.id;
            saveObj.label = this.segmentStructure.label;
            saveObj.scope = this.segmentStructure.scope;
            saveObj.version = this.segmentStructure.version;
            saveObj.binding = this.generateBinding(this.segmentStructure);
            saveObj.children = [];

            for(let child of this.segmentStructure.children){
                var clone = __.cloneDeep(child.data);
                clone.displayData = undefined;
                saveObj.children.push({"data":clone});
            }
            this.segmentsService.saveSegmentStructure(this.segmentId, saveObj).then(saved => {

                this.backup = __.cloneDeep(this.segmentStructure);
                this.editForm.control.markAsPristine();
                resolve(true);

            }, error => {
                console.log("error saving");
                reject();
            });
        })
    }

    generateBinding(segmentStructure){
        let result:any = {};
        result.elementId = segmentStructure.id.id;
        if(segmentStructure.binding){
            result.conformanceStatements = segmentStructure.binding.conformanceStatements;
            result.conformanceStatementCrossRefs = segmentStructure.binding.conformanceStatementCrossRefs;
        }
        result.children = [];
        this.travelSegmentStructure(result.children, segmentStructure.children);
        return result;
    }

    travelSegmentStructure(current, children){
        for(let child of children){
            var currentData = child.data;

            let elementBinding:any = {};
            elementBinding.elementId = currentData.id;

            if(currentData.displayData && currentData.displayData.segmentBinding) {
                if(currentData.displayData.segmentBinding.valuesetBindings && currentData.displayData.segmentBinding.valuesetBindings.length > 0){
                    elementBinding.valuesetBindings = [];

                    for(let vsBinding of currentData.displayData.segmentBinding.valuesetBindings){
                        elementBinding.valuesetBindings.push({
                            "valuesetId": vsBinding.valuesetId,
                            "strength": vsBinding.strength,
                            "valuesetLocations": vsBinding.valuesetLocations
                        });
                    }
                }

                if(currentData.displayData.segmentBinding.externalSingleCode){
                    elementBinding.externalSingleCode = currentData.displayData.segmentBinding.externalSingleCode;
                }

                if(currentData.displayData.segmentBinding.constantValue){
                    elementBinding.constantValue = currentData.displayData.segmentBinding.constantValue;
                }

                if(currentData.displayData.segmentBinding.comments && currentData.displayData.segmentBinding.comments.length > 0){
                    elementBinding.comments = [];

                    for(let commentBinding of currentData.displayData.segmentBinding.comments){
                        elementBinding.comments.push({
                            "description": commentBinding.description,
                            "dateupdated": commentBinding.dateupdated
                        });
                    }
                }

                if(currentData.displayData.segmentBinding.predicate){
                    elementBinding.predicate = currentData.displayData.segmentBinding.predicate;
                    if(!elementBinding.predicate.type) elementBinding.predicate.type = 'FREE';
                }
            }

            if(child.children && child.children.length > 0){
                elementBinding.children = [];
                this.travelSegmentStructure(elementBinding.children, child.children);
            }


            current.push(elementBinding);

        }
    }


    updateDatatype(node, children, currentBinding, parentFieldId, fieldDT, segmentBinding, fieldDTbinding, parentDTId, parentDTName){
        for (let entry of children) {
            if(!entry.data.displayData) entry.data.displayData = {};
            entry.data.displayData.datatype = this.getDatatypeLink(entry.data.ref.id);

            console.log(entry.data.displayData);

            entry.data.displayData.valuesetAllowed = this.configService.isValueSetAllow(entry.data.displayData.datatype.name,entry.data.position, parentDTName, this.segmentStructure.name, entry.data.displayData.type);
            entry.data.displayData.valueSetLocationOptions = this.configService.getValuesetLocations(entry.data.displayData.datatype.name, entry.data.displayData.datatype.domainInfo.version);
            if(entry.data.displayData.valuesetAllowed) entry.data.displayData.multipleValuesetAllowed =  this.configService.isMultipleValuseSetAllowed(entry.data.displayData.datatype.name);
            if(entry.data.displayData.datatype.leaf) entry.leaf = true;
            else entry.leaf = false;

            if(parentFieldId === null){
                entry.data.displayData.idPath = entry.data.id;
            }else{
                entry.data.displayData.idPath = parentFieldId + '-' + entry.data.id;
            }

            if(entry.data.displayData.idPath.split("-").length === 1){
                entry.data.displayData.type = 'FIELD';
                entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath, currentBinding);
                if(entry.data.usage === 'C' && !entry.data.displayData.segmentBinding) {
                    entry.data.displayData.segmentBinding = {};
                }
                if(entry.data.usage === 'C' && !entry.data.displayData.segmentBinding.predicate){
                    entry.data.displayData.segmentBinding.predicate = {};
                }
            }else if(entry.data.displayData.idPath.split("-").length === 2){
                entry.data.displayData.type = 'COMPONENT';
                entry.data.displayData.fieldDT = parentDTId;
                entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], segmentBinding);
                entry.data.displayData.fieldDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], currentBinding);
            }else if(entry.data.displayData.idPath.split("-").length === 3){
                entry.data.displayData.type = "SUBCOMPONENT";
                entry.data.displayData.fieldDT = fieldDT;
                entry.data.displayData.componentDT = parentDTId;
                entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], segmentBinding);
                entry.data.displayData.fieldDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], fieldDTbinding);
                entry.data.displayData.componentDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], currentBinding);
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
        this.selectedVS = {newvalue : {}};
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
            var datatypeId = event.node.data.ref.id;
            this.datatypesService.getDatatypeStructure(datatypeId).then(structure  => {
                structure.children = _.sortBy(structure.children, function(child){ return child.data.position});
                this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.displayData.idPath, datatypeId, event.node.data.displayData.segmentBinding, event.node.data.displayData.fieldDTBinding, event.node.data.displayData.fieldDT, event.node.data.displayData.datatype.name);
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

    onDatatypeChangeForDialog(node){
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
        this.changeDTDialogOpen = false;
    }

    makeEditModeForValueSet(node, vs){
        this.selectedNode = node;
        vs.newvalue = {};
        vs.newvalue.valuesetId = vs.valuesetId;
        vs.newvalue.strength = vs.strength;
        vs.newvalue.valuesetLocations = vs.valuesetLocations;
        this.selectedVS = vs;
        this.valuesetDialogOpen = true;
    }

    makeEditModeForComment(node, c){
        this.selectedNode = node;
        this.selectedComment.newComment = {};
        this.selectedComment.newComment.description = c.description;
        this.commentDialogOpen = true;
    }

    addNewComment(node){
        this.selectedNode = node;
        this.selectedComment = {newComment : {description:''}};
        this.commentDialogOpen = true;
    }

    addNewSingleCode(node){
        this.selectedNode = node;
        this.singleCodeDialogOpen = true;
        this.selectedSingleCode = {};
        this.selectedSingleCode.newSingleCode = '';
        this.selectedSingleCode.newSingleCodeSystem = '';
    }

    submitNewSingleCode(node, singleCode){
        if(!node.data.displayData.segmentBinding) node.data.displayData.segmentBinding = {};
        if(!node.data.displayData.segmentBinding.externalSingleCode) node.data.displayData.segmentBinding.externalSingleCode = {};

        node.data.displayData.segmentBinding.externalSingleCode.value = singleCode.newSingleCode;
        node.data.displayData.segmentBinding.externalSingleCode.codeSystem = singleCode.newSingleCodeSystem;

        this.singleCodeDialogOpen = false;
        this.editForm.control.markAsDirty();
    }

    makeEditModeForSingleCode(node){
        this.selectedNode = node;
        this.singleCodeDialogOpen = true;

        node.data.displayData.segmentBinding.externalSingleCode.newSingleCode = node.data.displayData.segmentBinding.externalSingleCode.value;
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem = node.data.displayData.segmentBinding.externalSingleCode.codeSystem;

        this.selectedSingleCode = node.data.displayData.segmentBinding.externalSingleCode;
    }

    deleteSingleCode(node){
        node.data.displayData.segmentBinding.externalSingleCode = null;
        node.data.displayData.hasSingleCode = false;
    }

    addNewConstantValue(node){
        this.selectedNode = node;
        this.selectedConstantValue = {};
        this.selectedConstantValue.newConstantValue = '';
        this.constantValueDialogOpen = true;
    }

    deleteConstantValue(node){
        node.data.displayData.segmentBinding.constantValue = null;
        node.data.displayData.segmentBinding.editConstantValue = false;
    }

    makeEditModeForConstantValue(node){
        this.selectedNode = node;
        this.selectedConstantValue = {};
        this.selectedConstantValue.newConstantValue = node.data.displayData.segmentBinding.constantValue;
        this.constantValueDialogOpen = true;
    }

    submitNewConstantValue(node, constantValue){
        if(!node.data.displayData.segmentBinding) node.data.displayData.segmentBinding = {};
        node.data.displayData.segmentBinding.constantValue = constantValue.newConstantValue;
        this.constantValueDialogOpen = false;

        this.editForm.control.markAsDirty();
    }

    submitNewValueSet(node, vs){
        if(vs.valuesetId){
            var displayValueSetLink = this.getValueSetLink(vs.newvalue.valuesetId);
            vs.bindingIdentifier = displayValueSetLink.displayValueSetLink;
            vs.label = displayValueSetLink.label;
            vs.domainInfo = displayValueSetLink.domainInfo;
            vs.valuesetId = vs.newvalue.valuesetId;
            vs.strength = vs.newvalue.strength;
            vs.valuesetLocations = vs.newvalue.valuesetLocations;
        }else {
            var displayValueSetLink = this.getValueSetLink(vs.newvalue.valuesetId);
            vs.bindingIdentifier = displayValueSetLink.displayValueSetLink;
            vs.label = displayValueSetLink.label;
            vs.domainInfo = displayValueSetLink.domainInfo;
            vs.valuesetId = vs.newvalue.valuesetId;
            vs.strength = vs.newvalue.strength;
            vs.valuesetLocations = vs.newvalue.valuesetLocations;
            node.data.displayData.segmentBinding.valuesetBindings.push(vs);
        }
        this.valuesetDialogOpen = false;
        this.editForm.control.markAsDirty();
    }

    submitNewComment(node, c){
        if(!node.data.displayData.segmentBinding) node.data.displayData.segmentBinding = [];
        if(!node.data.displayData.segmentBinding.comments) node.data.displayData.segmentBinding.comments = [];

        if(c.dateupdated){
            c.description = c.newComment.description;
            c.dateupdated = new Date();
        }else{
            c.description = c.newComment.description;
            c.dateupdated = new Date();
            node.data.displayData.segmentBinding.comments.push(c);
        }

        this.commentDialogOpen = false;
        this.editForm.control.markAsDirty();
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

    editDatatypeForField(node){
        this.selectedNode = node;
        this.changeDTDialogOpen = true;
    }

    editValueSetBinding(node){
        this.selectedNode = node;
        this.addNewValueSet(this.selectedNode);
        this.valuesetDialogOpen = true;
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
        if(this.selectedNode.data.displayData.segmentBinding && this.selectedNode.data.displayData.segmentBinding.predicate) this.selectedPredicate = JSON.parse(JSON.stringify(this.selectedNode.data.displayData.segmentBinding.predicate));
        if(!this.selectedPredicate) this.selectedPredicate = {};

        this.idMap = {};
        this.treeData = [];

        this.idMap[this.segmentId] = {name:this.segmentStructure.name};

        var rootData = {elementId:this.segmentId};

        for (let child of this.segmentStructure.children) {
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
                idPath: this.segmentId + '-' + child.data.id,
                pathData: childData
            };

            var treeNode = {
                label: child.data.position + '. ' + child.data.name + '[max = ' + child.data.max + ']',
                data : data,
                expandedIcon: "fa-folder-open",
                collapsedIcon: "fa-folder",
                leaf:false
            };

            if(child.data.displayData.datatype.leaf) treeNode.leaf = true;
            else treeNode.leaf = false;

            this.idMap[data.idPath] = data;
            this.treeData.push(treeNode);
        }

        this.preciateEditorOpen = true;
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
        this.editForm.control.markAsDirty();
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
        }else if(this.selectedPredicate.assertion.mode === 'ANDOR'){
            this.selectedPredicate.assertion.child = undefined;
            this.selectedPredicate.assertion.ifAssertion = undefined;
            this.selectedPredicate.assertion.thenAssertion = undefined;
            this.selectedPredicate.assertion.operator = 'AND';
            this.selectedPredicate.assertion.assertions = [];
            this.selectedPredicate.assertion.assertions.push({
                "mode": "SIMPLE"
            });

            this.selectedPredicate.assertion.assertions.push({
                "mode": "SIMPLE"
            });
        }else if(this.selectedPredicate.assertion.mode === 'NOT'){
            this.selectedPredicate.assertion.assertions = undefined;
            this.selectedPredicate.assertion.ifAssertion = undefined;
            this.selectedPredicate.assertion.thenAssertion = undefined;
            this.selectedPredicate.assertion.child = {
                "mode": "SIMPLE"
            };
        }else if(this.selectedPredicate.assertion.mode  === 'IFTHEN'){
            this.selectedPredicate.assertion.assertions = undefined;
            this.selectedPredicate.assertion.child = undefined;
            this.selectedPredicate.assertion.ifAssertion = {
                "mode": "SIMPLE"
            };
            this.selectedPredicate.assertion.thenAssertion = {
                "mode": "SIMPLE"
            };
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
