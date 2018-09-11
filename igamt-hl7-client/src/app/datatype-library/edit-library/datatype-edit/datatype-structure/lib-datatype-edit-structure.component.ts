/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild, TemplateRef} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {ConstraintsService} from "../../../../service/constraints/constraints.service";
import { _ } from 'underscore';
import * as __ from 'lodash';
import {TocService} from "../../service/toc.service";
import {LibDatatypesService} from "../lib-datatypes.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {Columns} from "../../../../common/constants/columns";

@Component({
  selector : 'datatype-edit',
  templateUrl : 'lib-datatype-edit-structure.component.html',
  styleUrls : ['lib-datatype-edit-structure.component.css']
})

export class LibDatatypeEditStructureComponent implements WithSave{
  currentUrl:any;
  datatypeId:any;
  datatypeStructure:any;
  usages:any;
  cUsages:any;

  @ViewChild('name')
  private name: TemplateRef<any>;
  @ViewChild('usage')
  private usage: TemplateRef<any>;
  @ViewChild('length')
  private length: TemplateRef<any>;
  @ViewChild('confLength')
  private confLength: TemplateRef<any>;
  @ViewChild('datatype')
  private datatype: TemplateRef<any>;
  @ViewChild('constantValue')
  private constantValue: TemplateRef<any>;
  @ViewChild('predicate')
  private predicate: TemplateRef<any>;
  @ViewChild('text')
  private text: TemplateRef<any>;
  @ViewChild('comment')
  private comment: TemplateRef<any>;


  cols= Columns.dataTypeLibraryColumns;
  selectedColumns=Columns.dataTypeLibraryColumns;

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


  constructor(private route: ActivatedRoute, private  router : Router, private configService : GeneralConfigurationService, private datatypesService : LibDatatypesService,
              private constraintsService : ConstraintsService,
              private tocService:TocService){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
    this.datatypeId = this.route.snapshot.params["datatypeId"];

    this.usages = this.configService._usages;
    this.cUsages = this.configService._cUsages;
    this.constraintTypes = this.configService._constraintTypes;
    this.assertionModes = this.configService._assertionModes;

    this.route.data.map(data =>data.datatypeStructure).subscribe(x=>{
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
        this.datatypeStructure = x;

        this.updateDatatype(this.datatypeStructure, x.children, x.binding, null, null, null, null);

        this.backup=__.cloneDeep(this.datatypeStructure);
      });

    });
  };

  getTemplateRef(col,readOnly):TemplateRef<any>{


    switch(col.field) {
      case "name": {
        return this.name;
      }
      case "usage": {
        return this.usage;
      }
      case "length": {
        return this.length;
      }
      case "confLength": {
        return this.confLength;
      }
      case "datatype": {
        return this.datatype;
      }
      case "constantValue": {
        return this.constantValue;
      }
      case "predicate": {
        return this.predicate;
      }    case "text": {
      return this.predicate;
    }
      case "comment": {
        return this.comment;
      }

      default: {
        //statements;
        break;
      }
    }


  }

  reset(){
    this.datatypeStructure=__.cloneDeep(this.backup);
    this.editForm.control.markAsPristine();

  }

  getCurrent(){
    return  this.datatypeStructure;
  }

  getBackup(){
    return this.backup;
  }

  isValid(){
    return true;
  }

  save(): Promise<any>{
    return new Promise((resolve, reject)=> {
      console.log(this.datatypeStructure);

      let saveObj:any = {};
      saveObj.id = this.datatypeStructure.id;
      saveObj.label = this.datatypeStructure.label;
      saveObj.scope = this.datatypeStructure.scope;
      saveObj.version = this.datatypeStructure.version;
      saveObj.binding = this.generateBinding(this.datatypeStructure);
      saveObj.children = [];

      for(let child of this.datatypeStructure.children){
        var clone = __.cloneDeep(child.data);
        clone.displayData = undefined;
        saveObj.children.push({"data":clone});
      }

      console.log(saveObj);

      this.datatypesService.saveDatatypeStructure(this.datatypeId, saveObj).then(saved => {
        this.backup = __.cloneDeep(this.datatypeStructure);
        this.editForm.control.markAsPristine();
        resolve(true);

      }, error => {
        console.log("error saving");
        reject();
      });
    })
  }

  generateBinding(datatypeStructure){
    let result:any = {};
    result.elementId = datatypeStructure.id.id;
    if(datatypeStructure.binding){
      result.conformanceStatements = datatypeStructure.binding.conformanceStatements;
      result.conformanceStatementCrossRefs = datatypeStructure.binding.conformanceStatementCrossRefs;
    }
    result.children = [];
    this.travelDatatypeStructure(result.children, datatypeStructure.children);
    return result;
  }

  travelDatatypeStructure(current, children){
    for(let child of children){
      var currentData = child.data;

      let elementBinding:any = {};
      elementBinding.elementId = currentData.id;

      if(currentData.displayData && currentData.displayData.datatypeBinding) {
        if(currentData.displayData.datatypeBinding.valuesetBindings && currentData.displayData.datatypeBinding.valuesetBindings.length > 0){
          elementBinding.valuesetBindings = [];

          for(let vsBinding of currentData.displayData.datatypeBinding.valuesetBindings){
            elementBinding.valuesetBindings.push({
              "valuesetId": vsBinding.valuesetId,
              "strength": vsBinding.strength,
              "valuesetLocations": vsBinding.valuesetLocations
            });
          }
        }

        if(currentData.displayData.datatypeBinding.externalSingleCode){
          elementBinding.externalSingleCode = currentData.displayData.datatypeBinding.externalSingleCode;
        }

        if(currentData.displayData.datatypeBinding.constantValue){
          elementBinding.constantValue = currentData.displayData.datatypeBinding.constantValue;
        }

        if(currentData.displayData.datatypeBinding.comments && currentData.displayData.datatypeBinding.comments.length > 0){
          elementBinding.comments = [];

          for(let commentBinding of currentData.displayData.datatypeBinding.comments){
            elementBinding.comments.push({
              "description": commentBinding.description,
              "dateupdated": commentBinding.dateupdated
            });
          }
        }

        if(currentData.displayData.datatypeBinding.predicate){
          elementBinding.predicate = currentData.displayData.datatypeBinding.predicate;
          if(!elementBinding.predicate.type) elementBinding.predicate.type = 'FREE';
        }
      }

      if(child.children && child.children.length > 0){
        elementBinding.children = [];
        this.travelDatatypeStructure(elementBinding.children, child.children);
      }


      current.push(elementBinding);

    }
  }
  updateDatatype(node, children, currentBinding, parentComponentId, datatypeBinding, parentDTId, parentDTName){
    for (let entry of children) {
      if(!entry.data.displayData) entry.data.displayData = {};
      entry.data.displayData.datatype = this.getDatatypeLink(entry.data.ref.id);

      if(entry.data.displayData.datatype.leaf) entry.leaf = true;
      else entry.leaf = false;

      if(parentComponentId === null){
        entry.data.displayData.idPath = entry.data.id;
      }else{
        entry.data.displayData.idPath = parentComponentId + '-' + entry.data.id;
      }

      if(entry.data.displayData.idPath.split("-").length === 1){
        entry.data.displayData.type = 'COMPONENT';
        if(entry.data.usage === 'C' && !entry.data.displayData.datatypeBinding) {
          entry.data.displayData.datatypeBinding = {};
        }
        if(entry.data.usage === 'C' && !entry.data.displayData.datatypeBinding.predicate){
          entry.data.displayData.datatypeBinding.predicate = {};
        }
      }else if(entry.data.displayData.idPath.split("-").length === 2){
        entry.data.displayData.type = 'SUBCOMPONENT';
        entry.data.displayData.componentDT = parentDTId;
      }
    }

    node.children = children;
    this.datatypeStructure.children= [...this.datatypeStructure.children];
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
    this.selectedVS = {newvalue : {}};
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
    if(!node.data.displayData.datatypeBinding) node.data.displayData.datatypeBinding = {};
    if(!node.data.displayData.datatypeBinding.externalSingleCode) node.data.displayData.datatypeBinding.externalSingleCode = {};

    node.data.displayData.datatypeBinding.externalSingleCode.value = singleCode.newSingleCode;
    node.data.displayData.datatypeBinding.externalSingleCode.codeSystem = singleCode.newSingleCodeSystem;

    this.singleCodeDialogOpen = false;
    this.editForm.control.markAsDirty();
  }

  makeEditModeForSingleCode(node){
    this.selectedNode = node;
    this.singleCodeDialogOpen = true;

    node.data.displayData.datatypeBinding.externalSingleCode.newSingleCode = node.data.displayData.datatypeBinding.externalSingleCode.value;
    node.data.displayData.datatypeBinding.externalSingleCode.newSingleCodeSystem = node.data.displayData.datatypeBinding.externalSingleCode.codeSystem;

    this.selectedSingleCode = node.data.displayData.datatypeBinding.externalSingleCode;
  }

  deleteSingleCode(node){
    node.data.displayData.datatypeBinding.externalSingleCode = null;
    node.data.displayData.hasSingleCode = false;
  }

  addNewConstantValue(node){
    this.selectedNode = node;
    this.selectedConstantValue = {};
    this.selectedConstantValue.newConstantValue = '';
    this.constantValueDialogOpen = true;
  }

  deleteConstantValue(node){
    node.data.displayData.datatypeBinding.constantValue = null;
    node.data.displayData.datatypeBinding.editConstantValue = false;
  }

  makeEditModeForConstantValue(node){
    this.selectedNode = node;
    this.selectedConstantValue = {};
    this.selectedConstantValue.newConstantValue = node.data.displayData.datatypeBinding.constantValue;
    this.constantValueDialogOpen = true;
  }

  submitNewConstantValue(node, constantValue){
    if(!node.data.displayData.datatypeBinding) node.data.displayData.datatypeBinding = {};
    node.data.displayData.datatypeBinding.constantValue = constantValue.newConstantValue;
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
      node.data.displayData.datatypeBinding.valuesetBindings.push(vs);
    }
    this.valuesetDialogOpen = false;
    this.editForm.control.markAsDirty();
  }

  submitNewComment(node, c){
    if(!node.data.displayData.datatypeBinding) node.data.displayData.datatypeBinding = [];
    if(!node.data.displayData.datatypeBinding.comments) node.data.displayData.datatypeBinding.comments = [];

    if(c.dateupdated){
      c.description = c.newComment.description;
      c.dateupdated = new Date();
    }else{
      c.description = c.newComment.description;
      c.dateupdated = new Date();
      node.data.displayData.datatypeBinding.comments.push(c);
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

  editDatatypeForComponent(node){
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
    if(this.selectedNode.data.displayData.datatypeBinding && this.selectedNode.data.displayData.datatypeBinding.predicate) this.selectedPredicate = JSON.parse(JSON.stringify(this.selectedNode.data.displayData.datatypeBinding.predicate));
    if(!this.selectedPredicate) this.selectedPredicate = {};

    this.idMap = {};
    this.treeData = [];

    this.idMap[this.datatypeId] = {name:this.datatypeStructure.name};

    var rootData = {elementId:this.datatypeId};

    for (let child of this.datatypeStructure.children) {
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
        idPath: this.datatypeId + '-' + child.data.id,
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
    if(!this.selectedNode.data.displayData.datatypeBinding) this.selectedNode.data.displayData.datatypeBinding = {};
    this.selectedNode.data.displayData.datatypeBinding.predicate = this.selectedPredicate;
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


  reorderCols(){
    this.selectedColumns= __.sortBy(this.selectedColumns,['position']);
  }
  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;
  }

}
