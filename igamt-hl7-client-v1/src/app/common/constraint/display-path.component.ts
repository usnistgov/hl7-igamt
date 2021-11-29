/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import {DatatypesService} from "../../igdocuments/igdocument-edit/datatype-edit/datatypes.service";
import { _ } from 'underscore';
import {TocService} from "../../igdocuments/igdocument-edit/service/toc.service";

@Component({
  selector : 'display-path',
  templateUrl : './display-path.component.html',
  styleUrls : ['./display-path.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class DisplayPathComponent {
  @Input() parentPath: any;
  @Input() path : any;
  @Input() idMap : any;
  @Input() treeData:any[];
  @Input() pathHolder:any;
  @Input() groupName: string;

  selectedNode:any;
  displayPicker: boolean = false;

  datatypesLinks :any = [];
  datatypeOptions:any = [];


  constructor(private datatypesService : DatatypesService, private tocService:TocService){
  }
  ngOnInit(){
    this.tocService.getDataypeList().then((dtTOCdata) => {
      let listTocDTs: any = dtTOCdata;
      for (let entry of listTocDTs) {
        var treeObj = entry.data;

        var dtLink: any = {};
        dtLink.id = treeObj.id;
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
        this.datatypeOptions.push(dtOption);
      }
    });
  }

  getIdPath(){
    if(!this.parentPath) return this.path.elementId;
    else return this.parentPath + "-" + this.path.elementId;
  }

  getDisplayName(){
    if(!this.parentPath) return this.idMap[this.getIdPath()].name;
    else {
      if(this.idMap[this.getIdPath()]) return this.idMap[this.getIdPath()].position;
    }

    return null;
  }

  needInstanceParameter(){
    if(!this.parentPath) {
      return false;
    }
    else{
      if(this.idMap[this.getIdPath()].max){
        if(this.idMap[this.getIdPath()].max !== "1"){
          return true;
        }else return false;
      }else {
        return false;
      }
    }
  }

  label(){
    if(!this.parentPath) {
      return null;
    }else {
      if(this.idMap[this.getIdPath()]) return this.idMap[this.getIdPath()].name;
    }

    return null;
  }

  nodeSelect(event) {
    this.pathHolder.path = JSON.parse(JSON.stringify(event.node.data.pathData));
    this.displayPicker = false;
  }

  loadNode(event) {
    if(event.node && !event.node.children) {

      console.log(event.node.data);

      this.datatypesService.getDatatypeStructure(event.node.data.dtId).then(dtStructure  => {
        dtStructure.children = _.sortBy(dtStructure.children, function(child){ return child.data.position});
        this.idMap[event.node.data.idPath].dtName = dtStructure.name;
        if(dtStructure.children){
          for (let child of dtStructure.children) {
            var childData =  JSON.parse(JSON.stringify(event.node.data.pathData));

            this.makeChild(childData, child.data.id, '1');

            var data = {
              id: child.data.id,
              name: child.data.name,
              max: "1",
              position: child.data.position,
              usage: child.data.usage,
              dtId: child.data.ref.id,
              idPath: event.node.data.idPath + '-' + child.data.id,
              pathData: childData
            };

            var treeNode = {
              label: child.data.position + '. ' + child.data.name,
              data:data,
              expandedIcon: "fa-folder-open",
              collapsedIcon: "fa-folder",
              leaf:false
            };

            var dt = this.getDatatypeLink(child.data.ref.id);

            if(dt.leaf) treeNode.leaf = true;
            else treeNode.leaf = false;

            this.idMap[data.idPath] = data;
            if(!event.node.children) event.node.children = [];
            event.node.children.push(treeNode);

          }
        }
      });
    }
  }

  getDatatypeLink(id){
    for (let dt of this.datatypesLinks) {
      if(dt.id === id) return JSON.parse(JSON.stringify(dt));
    }
    console.log("Missing DT:::" + id);
    return null;
  }

  makeChild(data, id, para){
    if(data.child) this.makeChild(data.child, id, para);
    else data.child = {
      elementId: id,
      instanceParameter: para
    }
  }

}
