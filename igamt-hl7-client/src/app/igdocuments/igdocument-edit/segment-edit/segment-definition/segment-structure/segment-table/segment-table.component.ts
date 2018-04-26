/**
 * Created by hnt5 on 10/27/17.
 */
import {Component, Input, ViewChild, ElementRef} from "@angular/core";
import {SegmentTreeNodeService} from "../../../../../../common/segment-tree/segment-tree.service";
import {DatatypeBindingPickerComponent} from "../../../../../../common/datatype-binding-picker/datatype-binding-picker.component"
import {GeneralConfigurationService} from "../../../../../../service/general-configuration/general-configuration.service";
import {SelectItem} from 'primeng/primeng';
import * as _ from 'underscore';

declare var jquery:any;
declare var $ :any;

@Component({
  selector : 'segment-table',
  templateUrl : './segment-table.component.html',
  styleUrls : ['./segment-table.component.css']
})
export class SegmentTableComponent {

  @Input() segment;
  @ViewChild(DatatypeBindingPickerComponent) dtPicker: DatatypeBindingPickerComponent;

  usages : any[];
  tree;

  constructor(private treeNodeService : SegmentTreeNodeService, private configService : GeneralConfigurationService){}

  ngOnInit(){
    this.treeNodeService.getFieldsAsTreeNodes(this.segment).then(result => {
      this.tree = result;
      console.log(this.tree);
    });
    this.usages = this.configService.usages;
  }

  loadNode($event){
    if($event.node && !$event.node.children){
      this.treeNodeService.getComponentsAsTreeNodes($event.node, this.segment).then(nodes => {
        $event.node.children = nodes;
      });
    }
  }

  checkStyleClass(){
    console.log("called!!");

    return "error";
  }

  delLength(node){
    node.data.obj.minLength = 'NA';
    node.data.obj.maxLength = 'NA';
    node.data.obj.confLength = '';
  }

  delConfLength(node){
    node.data.obj.minLength = '';
    node.data.obj.maxLength = '';
    node.data.obj.confLength = 'NA';
  }

  delValueSet(binding, node){
    var indexForBinding = -1;
    for(let b of this.segment.valueSetBindings){
      if(node.data.path === b.location && b.type === 'valueset' && b.tableId === binding.id){
        indexForBinding = this.segment.valueSetBindings.indexOf(b);
      }
    }
    if (indexForBinding >= 0) {
      this.segment.valueSetBindings.splice(indexForBinding, 1);
    }
    var index = node.data.segmentValueSetBindings.indexOf(binding);
    if (index >= 0) {
      node.data.segmentValueSetBindings.splice(index, 1);
    }
  }

  makeEditModeDT(node){
    node.data.obj.datatype.options = [];
    node.data.obj.tempDatatype = node.data.obj.datatype;
    this.treeNodeService.getDatatypes().subscribe(datatypes => {
      if(datatypes){
        for(let dt of datatypes){
          if(dt.name === node.data.obj.datatype.name){
            if(node.data.obj.datatype.id === dt.id) {
              let oldOptions = node.data.obj.datatype.options;
              node.data.obj.datatype = dt;
              node.data.obj.datatype.options = oldOptions;
              node.data.obj.datatype.edit = true;
            }
            node.data.obj.datatype.options.push({label:dt.label , value: dt});
          }
        }
      }
      node.data.obj.datatype.options.push({label:'Change Datatype root' , value: null});
    });
  }

  onChange(node){
    if(!node.data.obj.datatype) {
      node.data.obj.datatype = node.data.obj.tempDatatype;
      this.openDTDialog(node);
    }
    node.children = null;
    if(node.data.obj.datatype.numOfChildren > 0)
      this.treeNodeService.getComponentsAsTreeNodes(node, this.segment).then(nodes => node.children = nodes);
  }

  openDTDialog(node) {
    this.dtPicker.open({
      selectedDatatypeId: node.data.obj.datatype.id
    }).subscribe(
      result => {
        if(result){
          node.data.obj.datatype = result;
          node.children = null;
          if(node.data.obj.datatype.numOfChildren > 0){
            this.treeNodeService.getComponentsAsTreeNodes(node, this.segment).then(nodes => node.children = nodes);
          }else {
            node.leaf = true;
          }

        }
      }
    );
  }
}
