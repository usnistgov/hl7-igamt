/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/filter';
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import { _ } from 'underscore';
import * as __ from 'lodash';
import {ConformanceProfilesService} from "../conformance-profiles.service";
import {HasFroala} from "../../../../configuration/has-froala";
import {ConstraintsService} from "../../../../service/constraints/constraints.service";
import {TocService} from "../../service/toc.service";
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {SegmentsService} from "../../segment-edit/segments.service";
import {DatatypesService} from "../../datatype-edit/datatypes.service";

@Component({
    templateUrl : './conformanceprofile-edit-structure.component.html',
    styleUrls : ['./conformanceprofile-edit-structure.component.css']
})

export class ConformanceprofileEditStructureComponent extends  HasFroala implements WithSave {
    currentUrl:any;
    conformanceprofileId:any;
    conformanceprofileStructure:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;


    segmentsLinks :any = [];
    segmentsOptions:any = [];
    datatypesLinks :any = [];
    datatypeOptions:any = [];
    valuesetsLinks :any = [];
    valuesetOptions:any = [{label:'Select ValueSet', value:null}];

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

    usages:any;
    cUsages:any;

    constructor(private route: ActivatedRoute,
                private configService : GeneralConfigurationService,
                private conformanceProfilesService : ConformanceProfilesService,
                private segmentsService : SegmentsService,
                private datatypesService : DatatypesService,
                private constraintsService : ConstraintsService,
                private tocService:TocService){
        super();
    }

    ngOnInit() {
        this.usages = this.configService._usages;
        this.cUsages = this.configService._cUsages;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;

        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(data =>data.conformanceprofileStructure).subscribe(x=>{
            this.tocService.getSegmentsList().then((segTOCdata) => {
                let listTocSEGs:any = segTOCdata;
                for(let entry of listTocSEGs){
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

                    this.segmentsLinks.push(segLink);

                    var segOption = {label: segLink.label, value : segLink.id};
                    this.segmentsOptions.push(segOption);
                }

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
                        this.sortStructure(x);
                        x.treeModel = [];
                        this.genTreeModel(x.treeModel, x.children, null, null, null, null, null, null, null, null);

                        this.backup=x;
                        this.conformanceprofileStructure=__.cloneDeep(this.backup);
                    });
                });
            });

        });
    }

    loadNode(node) {
        if (node && !node.children) {
            if(node.data.type === 'SEGMENTREF'){
                this.segmentsService.getSegmentStructure(node.data.ref.id).then(structure  => {
                    structure.children = _.sortBy(structure.children, function(child){ return child.data.position});
                    node.children = [];
                    this.genTreeModel(node.children, structure.children, node.data.idPath, null, structure.name, null, null, structure.binding ,null , null);
                });
            }else if(node.data.type === 'FIELD'){
                this.datatypesService.getDatatypeStructure(node.data.ref.id).then(structure  => {
                    structure.children = _.sortBy(structure.children, function(child){ return child.data.position});
                    node.children = [];
                    this.genTreeModel(node.children, structure.children, node.data.idPath, 'COMPONENT', null, structure.name, node.data.idPathFromSeg, node.data.segmentBinding, structure.binding, null);
                });
            }else if(node.data.type === 'COMPONENT'){
                this.datatypesService.getDatatypeStructure(node.data.ref.id).then(structure  => {
                    structure.children = _.sortBy(structure.children, function(child){ return child.data.position});
                    node.children = [];
                    this.genTreeModel(node.children, structure.children, node.data.idPath, 'SUBCOMPONENT', null, structure.name, node.data.idPathFromSeg, node.data.segmentBinding, node.data.fieldDTbinding, structure.binding);
                });
            }
        }
    }

    genTreeModel(current, list, parentIdPath, dType, segmentName, parentDTName, parentIdPathFromSeg, segmentBinding, fieldDTbinding, componentDTbinding){
        for(let child of list) {
            if(child.type === 'SEGMENTREF'){
                var currentIdPath;
                if(parentIdPath) currentIdPath = parentIdPath + ',' + child.id;
                else currentIdPath = child.id;

                let data:any = {};
                data.id = child.id;
                data.position = child.position;
                data.type = child.type;
                data.usage = child.usage;
                data.text = child.text;
                data.custom = child.custom;
                data.min = child.min;
                data.max = child.max;
                data.ref = child.ref;
                data.idPath = currentIdPath;
                data.name = this.getSegmentElm(child.ref.id).name;
                let treeModel:any = {};
                treeModel.data = data;
                treeModel.leaf = false;
                this.onUsageChange(treeModel);
                current.push(treeModel);
            }
            else if(child.type === 'GROUP'){
                var currentIdPath;
                if(parentIdPath) currentIdPath = parentIdPath + ',' + child.id;
                else currentIdPath = child.id;

                let data:any = {};
                data.id = child.id;
                data.position = child.position;
                data.type = child.type;
                data.name = child.name;
                data.usage = child.usage;
                data.text = child.text;
                data.custom = child.custom;
                data.min = child.min;
                data.max = child.max;
                data.idPath = currentIdPath;
                let treeModel:any = {};
                treeModel.data = data;
                treeModel.leaf = false;
                treeModel.children = [];
                this.onUsageChange(treeModel);
                this.genTreeModel(treeModel.children, child.children, currentIdPath, null, null, null, null, null, null, null);
                current.push(treeModel);
            }
            else if(child.data.type === 'FIELD'){
                var currentIdPath;
                if(parentIdPath) currentIdPath = parentIdPath + ',' + child.data.id;
                else currentIdPath = child.data.id;

                let data:any = {};
                data.id = child.data.id;
                data.position = child.data.position;
                data.type = child.data.type;
                data.usage = child.data.usage;
                data.text = child.data.text;
                data.custom = child.data.custom;
                data.min = child.data.min;
                data.max = child.data.max;
                data.minLength = child.data.minLength;
                data.maxLength = child.data.maxLength;
                data.ref = child.data.ref;
                data.idPath = currentIdPath;
                data.name = child.data.name;
                let treeModel:any = {};
                let datatype = this.getDatatypeLink(data.ref.id);
                data.datatype = datatype;
                if(datatype.leaf) treeModel.leaf = true;
                else treeModel.leaf = false;
                data.valuesetAllowed = this.configService.isValueSetAllow(data.datatype.name, data.position, null, segmentName, data.type);
                data.valueSetLocationOptions = this.configService.getValuesetLocations(data.datatype.name, data.datatype.domainInfo.version);
                if(data.valuesetAllowed) data.multipleValuesetAllowed = this.configService.isMultipleValuseSetAllowed(data.datatype.name)
                data.idPathFromSeg = child.data.id;

                data.messageBinding = this.findMessageBinding(data.idPath, this.conformanceprofileStructure.binding);
                data.segmentBinding = this.findBinding(data.idPathFromSeg, segmentBinding);

                this.setHasSingleCode(data);
                this.setHasValueSet(data);

                treeModel.data = data;
                current.push(treeModel);
            }
            else if(child.data.type === 'COMPONENT'){
                var currentIdPath;
                if(parentIdPath) currentIdPath = parentIdPath + ',' + child.data.id;
                else currentIdPath = child.data.id;

                let data:any = {};
                data.id = child.data.id;
                data.position = child.data.position;
                data.type = dType;
                data.usage = child.data.usage;
                data.text = child.data.text;
                data.custom = child.data.custom;
                data.minLength = child.data.minLength;
                data.maxLength = child.data.maxLength;
                data.ref = child.data.ref;
                data.idPath = currentIdPath;
                data.name = child.data.name;
                let treeModel:any = {};
                let datatype = this.getDatatypeLink(data.ref.id);
                data.datatype = datatype;
                if(datatype.leaf) treeModel.leaf = true;
                else treeModel.leaf = false;
                data.valuesetAllowed = this.configService.isValueSetAllow(data.datatype.name, data.position, parentDTName, null, data.type);
                data.valueSetLocationOptions = this.configService.getValuesetLocations(data.datatype.name, data.datatype.domainInfo.version);
                if(data.valuesetAllowed) data.multipleValuesetAllowed = this.configService.isMultipleValuseSetAllowed(data.datatype.name);

                data.idPathFromSeg = parentIdPathFromSeg + '-' + child.data.id;

                if(dType === 'COMPONENT'){
                    data.messageBinding = this.findMessageBinding(data.idPath, this.conformanceprofileStructure.binding);
                    data.segmentBinding = this.findBinding(data.idPathFromSeg.split("-")[1], segmentBinding);
                    data.fieldDTbinding = this.findBinding(data.idPathFromSeg.split("-")[1], fieldDTbinding);
                }else if(dType === 'SUBCOMPONENT'){
                    data.messageBinding = this.findMessageBinding(data.idPath, this.conformanceprofileStructure.binding);
                    data.segmentBinding = this.findBinding(data.idPathFromSeg.split("-")[2], segmentBinding);
                    data.fieldDTbinding = this.findBinding(data.idPathFromSeg.split("-")[2], fieldDTbinding);
                    data.componentDTbinding = this.findBinding(data.idPathFromSeg.split("-")[2], componentDTbinding);
                }

                this.setHasSingleCode(data);
                this.setHasValueSet(data);

                treeModel.data = data;
                current.push(treeModel);
            }
        }
    }

    findMessageBinding(idPath, binding){
        if(binding && binding.children){
            var res = idPath.split(",");
            for(let b of binding.children){
                if(b.elementId === res[0]) {
                    if (res.length === 1) {
                        return this.updateValueSetBindings(b);
                    }else if (res.length > 1) {
                        res.shift();
                        return this.findMessageBinding(res.toString(), b);
                    }
                }
            }
        }
        return null;
    }

    findBinding(id, binding){
        if(binding && binding.children){
            for(let b of binding.children){
                if(b.elementId === id) return this.updateValueSetBindings(b);
            }
        }
        return null;
    }

    updateValueSetBindings(binding){
        var result = JSON.parse(JSON.stringify(binding));
        if(result && result.valuesetBindings){
            for(let vs of result.valuesetBindings){
                var displayValueSetLink = this.getValueSetLink(vs.valuesetId);
                vs.label = displayValueSetLink.label;
                vs.domainInfo = displayValueSetLink.domainInfo;
            }
        }
        return result;
    }

    sortStructure(x){
        x.children = _.sortBy(x.children, function(child){ return child.position});
        for (let child of  x.children) {
            if(child.children) this.sortStructure(child);
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

    getSegmentElm(id){
        for(let link of this.segmentsLinks){
            if(link.id === id) return link;
        }
        return null;
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

    onUsageChange(node){
        if(node.data.usage === 'C') {
            if(!node.data.messageBinding) {
                node.data.messageBinding = {};
            }
            if(!node.data.messageBinding.predicate){
                node.data.messageBinding.predicate = {};
            }
        }else if(node.data.usage !== 'C') {
            if(node.data.messageBinding && node.data.messageBinding.predicate) {
                node.data.messageBinding.predicate = undefined;
            }
        }
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

    editValueSetBinding(node){
        this.selectedNode = node;
        this.addNewValueSet(this.selectedNode);
        this.valuesetDialogOpen = true;
    }

    addNewValueSet(node){
        if(!node.data.messageBinding) node.data.messageBinding = [];
        if(!node.data.messageBinding.valuesetBindings) node.data.messageBinding.valuesetBindings = [];
        this.selectedVS = {newvalue : {}};
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
            node.data.messageBinding.valuesetBindings.push(vs);
        }
        this.valuesetDialogOpen = false;
        this.editForm.control.markAsDirty();
    }

    delValueSetBinding(binding, vs, node){
        binding.valuesetBindings = _.without(binding.valuesetBindings, _.findWhere(binding.valuesetBindings, {valuesetId: vs.valuesetId}));
        this.setHasValueSet(node);
    }

    makeEditModeForSingleCode(node){
        this.selectedNode = node;
        this.singleCodeDialogOpen = true;

        node.data.messageBinding.externalSingleCode.newSingleCode = node.data.messageBinding.externalSingleCode.value;
        node.data.messageBinding.externalSingleCode.newSingleCodeSystem = node.data.messageBinding.externalSingleCode.codeSystem;

        this.selectedSingleCode = node.data.messageBinding.externalSingleCode;
    }

    deleteSingleCode(node){
        node.data.messageBinding.externalSingleCode = null;
        this.setHasSingleCode(node.data);
    }

    addNewSingleCode(node){
        this.selectedNode = node;
        this.singleCodeDialogOpen = true;
        this.selectedSingleCode = {};
        this.selectedSingleCode.newSingleCode = '';
        this.selectedSingleCode.newSingleCodeSystem = '';
    }

    submitNewSingleCode(node, singleCode){
        if(!node.data.messageBinding) node.data.messageBinding = {};
        if(!node.data.messageBinding.externalSingleCode) node.data.messageBinding.externalSingleCode = {};

        node.data.messageBinding.externalSingleCode.value = singleCode.newSingleCode;
        node.data.messageBinding.externalSingleCode.codeSystem = singleCode.newSingleCodeSystem;

        this.singleCodeDialogOpen = false;
        this.editForm.control.markAsDirty();
    }

    makeEditModeForConstantValue(node){
        this.selectedNode = node;
        this.selectedConstantValue = {};
        this.selectedConstantValue.newConstantValue = node.data.messageBinding.constantValue;
        this.constantValueDialogOpen = true;
    }

    deleteConstantValue(node){
        node.data.messageBinding.constantValue = null;
    }

    addNewConstantValue(node){
        this.selectedNode = node;
        this.selectedConstantValue = {};
        this.selectedConstantValue.newConstantValue = '';
        this.constantValueDialogOpen = true;
    }

    submitNewConstantValue(node, constantValue){
        if(!node.data.messageBinding) node.data.messageBinding = {};
        node.data.messageBinding.constantValue = constantValue.newConstantValue;
        this.constantValueDialogOpen = false;

        this.editForm.control.markAsDirty();
    }

    editTextDefinition(node){
        this.selectedNode = node;
        this.textDefinitionDialogOpen = true;
    }

    delTextDefinition(node){
        node.data.text = null;
    }

    truncate(txt){
        if(txt.length < 10) return txt;
        else return txt.substring(0,10) + "...";
    }

    makeEditModeForComment(node, c){
        this.selectedNode = node;
        this.selectedComment.newComment = {};
        this.selectedComment.newComment.description = c.description;
        this.commentDialogOpen = true;
    }

    delCommentBinding(binding, c){
        binding.comments = _.without(binding.comments, _.findWhere(binding.comments, c));
    }

    addNewComment(node){
        this.selectedNode = node;
        this.selectedComment = {newComment : {description:''}};
        this.commentDialogOpen = true;
    }

    submitNewComment(node, c){
        if(!node.data.messageBinding) node.data.messageBinding = [];
        if(!node.data.messageBinding.comments) node.data.messageBinding.comments = [];

        if(c.dateupdated){
            c.description = c.newComment.description;
            c.dateupdated = new Date();
        }else{
            c.description = c.newComment.description;
            c.dateupdated = new Date();
            node.data.messageBinding.comments.push(c);
        }

        this.commentDialogOpen = false;
        this.editForm.control.markAsDirty();
    }

    setHasSingleCode(node){
        if(node.messageBinding || node.segmentBinding || node.fieldDTbinding || node.componentDTbinding){
            if(node.messageBinding && node.messageBinding.internalSingleCode && node.messageBinding.internalSingleCode !== ''){
                node.hasSingleCode = true;
            }else if(node.messageBinding && node.messageBinding.externalSingleCode && node.messageBinding.externalSingleCode !== ''){
                node.hasSingleCode = true;
            }else if(node.segmentBinding && node.segmentBinding.internalSingleCode && node.segmentBinding.internalSingleCode !== ''){
                node.hasSingleCode = true;
            }else if(node.segmentBinding && node.segmentBinding.externalSingleCode && node.segmentBinding.externalSingleCode !== ''){
                node.hasSingleCode = true;
            }else if(node.fieldDTbinding && node.fieldDTbinding.internalSingleCode && node.fieldDTbinding.internalSingleCode !== ''){
                node.hasSingleCode = true;
            }else if(node.fieldDTbinding && node.fieldDTbinding.externalSingleCode && node.fieldDTbinding.externalSingleCode !== ''){
                node.hasSingleCode = true;
            }else if(node.componentDTbinding && node.componentDTbinding.internalSingleCode && node.componentDTbinding.internalSingleCode !== ''){
                node.hasSingleCode = true;
            }else if(node.componentDTbinding && node.componentDTbinding.externalSingleCode && node.componentDTbinding.externalSingleCode !== ''){
                node.hasSingleCode = true;
            }else {
                node.hasSingleCode = false;
            }
        }else {
            node.hasSingleCode = false;
        }
    }

    setHasValueSet(node){
        if(node.messageBinding || node.segmentBinding || node.fieldDTbinding || node.componentDTbinding){
            if(node.messageBinding && node.messageBinding.valuesetBindings && node.messageBinding.valuesetBindings.length > 0){
                node.hasValueSet = true;
            }else if(node.segmentBinding && node.segmentBinding.valuesetBindings && node.segmentBinding.valuesetBindings.length > 0){
                node.hasValueSet = true;
            }else if(node.fieldDTbinding && node.fieldDTbinding.valuesetBindings && node.fieldDTbinding.valuesetBindings.length > 0){
                node.hasValueSet = true;
            }else if(node.componentDTbinding && node.componentDTbinding.valuesetBindings && node.componentDTbinding.valuesetBindings.length > 0){
                node.hasValueSet = true;
            }else {
                node.hasValueSet = false;
            }
        }else {
            node.hasValueSet = false;
        }
    }

    reset(){
        this.conformanceprofileStructure=__.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();

    }

    getCurrent(){
        return  this.conformanceprofileStructure;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return new Promise((resolve, reject)=> {
            let saveObj:any = {};
            saveObj.id = this.conformanceprofileStructure.id;
            saveObj.binding = this.generateBinding();
            saveObj.children = this.generatesStructure();

            this.conformanceProfilesService.saveConformanceProfileStructure(this.conformanceprofileId, saveObj).then(saved => {
                this.backup = __.cloneDeep(this.conformanceprofileStructure);
                this.editForm.control.markAsPristine();
                resolve(true);
            }, error => {
                console.log("error saving");
                reject();
            });
        })
    }

    generateBinding(){
        let result:any = this.conformanceprofileStructure.binding;
        if(!result) result = {};
        if(!result.children) result.children = [];
        if(!result.elementId) result.elementId = this.conformanceprofileId;
        this.visitTreeModelForBinding(this.conformanceprofileStructure.treeModel, result.children);
        return result;
    }

    visitTreeModelForBinding(list, holder){
        for(let item of list){
            if(item.data.messageBinding){
                let elementBinding:any = {};
                elementBinding.elementId = item.data.id;
                if(item.data.messageBinding.valuesetBindings && item.data.messageBinding.valuesetBindings.length > 0) {
                    elementBinding.valuesetBindings = [];

                    for (let vsBinding of item.data.messageBinding.valuesetBindings) {
                        elementBinding.valuesetBindings.push({
                            "valuesetId": vsBinding.valuesetId,
                            "strength": vsBinding.strength,
                            "valuesetLocations": vsBinding.valuesetLocations
                        });
                    }
                }

                if(item.data.messageBinding.externalSingleCode){
                    elementBinding.externalSingleCode = item.data.messageBinding.externalSingleCode;
                }

                if(item.data.messageBinding.constantValue){
                    elementBinding.constantValue = item.data.messageBinding.constantValue;
                }

                if(item.data.messageBinding.comments && item.data.messageBinding.comments.length > 0){
                    elementBinding.comments = [];

                    for(let commentBinding of item.data.messageBinding.comments){
                        elementBinding.comments.push({
                            "description": commentBinding.description,
                            "dateupdated": commentBinding.dateupdated
                        });
                    }
                }

                if(item.data.messageBinding.predicate){
                    elementBinding.predicate = item.data.messageBinding.predicate;
                    if(!elementBinding.predicate.type) elementBinding.predicate.type = 'FREE';
                }
                this.pushElementBinding(elementBinding, holder, item.data.idPath);
            }

            if(item.children && item.children.length > 0){
                this.visitTreeModelForBinding(item.children, holder);
            }
        }
    }

    pushElementBinding(elementBinding, list, idPath){
        var res = idPath.split(",");
        var found;
        for(let b of list){
            if(b.elementId === res[0]) {
                found = b;
            }
        }

        if(found){
            if (res.length === 1) {
                found.valuesetBindings = elementBinding.valuesetBindings;
                found.externalSingleCode = elementBinding.externalSingleCode;
                found.constantValue = elementBinding.constantValue;
                found.comments = elementBinding.comments;
                found.predicate = elementBinding.predicate;
            }else if (res.length > 1) {
                res.shift();
                if(!found.children) found.children = [];
                this.pushElementBinding(elementBinding, found.children, res.toString());
            }
        }else {
            if (res.length === 1) {
                list.push(elementBinding);
            }else if (res.length > 1) {
                let newBinding:any = {};
                newBinding.elementId = res[0];
                newBinding.children = [];
                list.push(newBinding);
                res.shift();
                this.pushElementBinding(elementBinding, newBinding.children, res.toString());
            }
        }
    }

    generatesStructure(){
        let result:any = [];
        this.visitTreeModel(this.conformanceprofileStructure.treeModel, result);
        return result;
    }

    visitTreeModel(list, holder){
        for(let item of list){
            if(item.data.type === 'SEGMENTREF'){
                let segRef:any = {};
                segRef.custom = item.data.custom;
                segRef.id = item.data.id;
                segRef.max = item.data.max;
                segRef.min = item.data.min;
                segRef.position = item.data.position;
                segRef.ref = item.data.ref;
                segRef.text = item.data.text;
                segRef.usage = item.data.usage;
                segRef.type = item.data.type;
                holder.push(segRef);
            }else if (item.data.type === 'GROUP'){
                let group:any = {};
                group.custom = item.data.custom;
                group.id = item.data.id;
                group.name = item.data.name;
                group.max = item.data.max;
                group.min = item.data.min;
                group.position = item.data.position;
                group.text = item.data.text;
                group.usage = item.data.usage;
                group.type = item.data.type;
                group.children = [];
                this.visitTreeModel(item.children, group.children);
                holder.push(group);
            }
        }
    }
}