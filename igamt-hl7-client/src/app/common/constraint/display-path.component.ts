/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'display-path',
  templateUrl : './display-path.component.html',
  styleUrls : ['./display-path.component.css']
})
export class DisplayPathComponent {
  @Input() parentPath: any;
  @Input() path : any;
  @Input() idMap : any;
  @Input() treeData:any[];
  @Input() pathHolder:any;

  selectedNode:any;
  displayPicker: boolean = false;


  constructor(){
  }
  ngOnInit(){
  }

  getIdPath(){
    if(!this.parentPath) return this.path.elementId;
    else return this.parentPath + "-" + this.path.elementId;
  }

  getDisplayName(){
    if(!this.parentPath) return this.idMap[this.getIdPath()].name;
    else return this.idMap[this.getIdPath()].position;
  }

  needInstanceParameter(){
    if(!this.parentPath) {
      return false;
    }
    else{
      if(this.idMap[this.getIdPath()].max !== "1"){
        return true;
      }else{
        return false;
      }
    }
  }

  label(){
    if(!this.parentPath) {
      return null;
    }else {
      return this.idMap[this.getIdPath()].name;
    }
  }

  nodeSelect(event) {

    this.pathHolder.path = event.node.data;

    this.displayPicker = false;
  }
}
