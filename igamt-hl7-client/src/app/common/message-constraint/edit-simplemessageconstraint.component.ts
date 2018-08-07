/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";
import {DatatypesService} from "../../igdocuments/igdocument-edit/datatype-edit/datatypes.service";
import {SegmentsService} from "../../igdocuments/igdocument-edit/segment-edit/segments.service";
import { _ } from 'underscore';

@Component({
  selector : 'edit-simple-message-constraint',
  templateUrl : './edit-simplemessageconstraint.component.html',
  styleUrls :  ['./edit-simplemessageconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditSimpleMessageConstraintComponent {
  @Input() constraint : any;
  @Input() context : any;
  @Input() structure : any[];
  @Input() ifVerb: boolean;
  @Input() groupName: string;
  @Input() segmentsLinks: any[];
  @Input() datatypesLinks: any[];

  simpleAssertionTypes: any[];
  verbs: any[];
  instanceNums : any[];
  operators: any[];
  formatTypes:any[];


  displayPicker:boolean = false;
  treeModel:any[];

  constructor(
      private configService : GeneralConfigurationService,
      private datatypesService : DatatypesService,
      private segmentsService : SegmentsService){}

  ngOnInit(){
    if(!this.constraint.complement) this.constraint.complement = {};
    if(!this.constraint.subject) this.constraint.subject = {};
    if(this.ifVerb){
      this.verbs = this.configService._ifConstraintVerbs;
    }else{
      this.verbs = this.configService._simpleConstraintVerbs;
    }

    this.instanceNums = this.configService._instanceNums;
    this.operators = this.configService._operators;
    this.formatTypes = this.configService._formatTypes;
    this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
  }

  addValue(){
    if(!this.constraint.complement.values) this.constraint.complement.values = [];
    this.constraint.complement.values.push('');
  }

  generateAssertionScript(constraint){
    constraint.path1 = "OBX-4[" + constraint.instanceNum + "].1[1]";
    constraint.positionPath1 = "4[" + constraint.instanceNum + "].1[1]";
    constraint.assertionScript = "<PlainText Path=\"4[" + constraint.instanceNum + "].1[1]\" Text=\"AAAA\" IgnoreCase=\"false\"/>";
  }

  openPathSelector(){
    if(this.context){

    }else{
      this.treeModel = [];

      this.popTreeModel(this.treeModel, this.structure, null);
    }
    this.displayPicker = true;
  }

  popTreeModel(holderArray, list, parentId){
    for(let item of list){
      if(item.type === 'SEGMENTREF'){
        let idPath;
        if(parentId) idPath = parentId + ',' + item.id;
        else idPath = item.id;

        holderArray.push({
          "label": item.position + '. ' + this.getSegmentElm(item.ref.id).name,
          "data":
              {
                "idPath" : idPath,
                "type" : 'SEGMENTREF',
                "ref" : item.ref,
                "max" : item.max
              },
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder",
          "leaf" : false
        });
      }
      else if(item.type === 'GROUP'){
        let idPath;
        if(parentId) idPath = parentId + ',' + item.id;
        else idPath = item.id;

        let group:any = {
          "label": item.position + '. ' + item.name,
          "data":
              {
                "idPath" : idPath,
                "type" : 'GROUP',
                "max" : item.max
              },
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder",
          "children" : [],
          "leaf" : false
        };
        this.popTreeModel(group.children, item.children, group.data.idPath);
        holderArray.push(group);
      }
      else if(item.data.type === 'FIELD'){
        let idPath;
        if(parentId) idPath = parentId + ',' + item.data.id;
        else idPath = item.data.id;

        let field:any = {
          "label": item.data.position + '. ' + item.data.name,
          "data":
              {
                "idPath" : idPath,
                "ref" : item.data.ref,
                "type" : 'FIELD',
                "max" : item.data.max
              },
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder",
        };

        let datatype = this.getDatatypeLink(field.data.ref.id);
        if(datatype.leaf) field.leaf = true;
        else {
          field.leaf = false;
        }
        holderArray.push(field);
      }
      else if(item.data.type === 'COMPONENT'){
        let idPath;
        if(parentId) idPath = parentId + ',' + item.data.id;
        else idPath = item.data.id;

        let component:any = {
          "label": item.data.position + '. ' + item.data.name,
          "data":
              {
                "idPath" : idPath,
                "ref" : item.data.ref,
                "type" : 'COMPONENT'
              },
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder"
        };

        let datatype = this.getDatatypeLink(component.data.ref.id);
        if(datatype.leaf) component.leaf = true;
        else {
          component.leaf = false;
        }

        holderArray.push(component);
      }
    }
  }

  getDatatypeLink(id){
    for (let dt of this.datatypesLinks) {
      if(dt.id === id) return JSON.parse(JSON.stringify(dt));
    }
    console.log("Missing DT:::" + id);
    return null;
  }

  getSegmentElm(id){
    for(let link of this.segmentsLinks){
      if(link.id === id) return link;
    }
    return null;
  }

  loadNode(node) {
    console.log(node);
    if (node && !node.children) {
      if(node.data.type === 'SEGMENTREF'){
        this.segmentsService.getSegmentStructure(node.data.ref.id).then(structure  => {
          structure.children = _.sortBy(structure.children, function(child){ return child.data.position});
          node.children = [];
          this.popTreeModel(node.children, structure.children, node.data.idPath);
        });
      }else if(node.data.type === 'FIELD'){
        this.datatypesService.getDatatypeStructure(node.data.ref.id).then(structure  => {
          structure.children = _.sortBy(structure.children, function(child){ return child.data.position});
          node.children = [];
          this.popTreeModel(node.children, structure.children, node.data.idPath);
        });
      }else if(node.data.type === 'COMPONENT'){
        this.datatypesService.getDatatypeStructure(node.data.ref.id).then(structure  => {
          structure.children = _.sortBy(structure.children, function(child){ return child.data.position});
          node.children = [];
          this.popTreeModel(node.children, structure.children, node.data.idPath);
        });
      }
    }
  }
}
