import {Component, Input, Output, EventEmitter} from "@angular/core";
import {SegmentsService} from "../../../igdocuments/igdocument-edit/segment-edit/segments.service";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";
import {IgDocumentService} from "../../../igdocuments/igdocument-edit/ig-document.service";
import { _ } from 'underscore';
import * as __ from 'lodash';
import {SelectItemGroup} from "primeng/components/common/selectitemgroup";
import {Types} from "../../constants/types";
import {SegmentColService} from "./segment-col.service";

@Component({
  selector : 'segment-col',
  templateUrl : './segment-col.component.html',
  styleUrls : ['./segment-col.component.css']
})

export class SegmentColComponent {
  @Input() documentId: any;
  @Input() ref: any;
  @Output() refChange = new EventEmitter<any>();
  @Input() segmentLabel: any;
  @Output() segmentLabelChange = new EventEmitter<any>();
  @Input() children: any[];
  @Output() childrenChange = new EventEmitter<any[]>();
  @Input() name: string;
  @Output() nameChange = new EventEmitter<string>();

  @Output() refresh = new EventEmitter<any>();


  @Input() idPath : string;
  @Input() path : string;
  @Input() viewScope : string;
  editing=false;

  changeSegDialogOpen:boolean;
  currentSegLabel:any;
  segmentLabels : any[];

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  cols: any[];

  groupedLabels :SelectItemGroup[]= [];

  constructor(private segmentsService : SegmentsService, private configService : GeneralConfigurationService, private segmentColService:SegmentColService){}

  ngOnInit(){
    this.changeSegDialogOpen = false;

    this.cols = [
      { field: 'scopeversion', header: 'Scope/Version' },
      { field: 'name', header: 'Name' },
      { field: 'ext', header: 'Ext' },
      { field: 'label', header: 'Label' }
    ];
  }

  makeEditModeForSegment(){
    //this.changeSegDialogOpen = true;
    console.log("On show ?")
    this.currentSegLabel = __.cloneDeep(this.segmentLabel);
    this.segmentColService.getSegmentFlavorsOptions(this.documentId, this.viewScope,this.ref.id ).then((data) => {
      this.groupedLabels=data;
      this.editing=true;
    });
  }

  groupLabels(segmentLabels)
  {
    this.initOptions();


    for(let i=0;i<segmentLabels.length;i++){
      if(segmentLabels[i].name==this.currentSegLabel.name){
        this.groupedLabels[0].items.push({label:segmentLabels[i].label,value:segmentLabels[i]});
      }else{
        this.groupedLabels[1].items.push({label:segmentLabels[i].label,value:segmentLabels[i]});
      }
    }
  }

  initOptions=function () {
    this.groupedLabels =[
      {
        label: 'Flavors',
        items: [
        ]
      },
      {
        label: 'Others',
        items: [
        ]
      }
    ];
  };

  update(){
    this.ref.id = this.segmentLabel.id;
    this.refChange.emit(this.ref);
    this.segmentLabelChange.emit(this.segmentLabel);
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'SEGMENTREF';
    item.propertyValue = this.ref;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.changeItemsChange.emit(this.changeItems);
    this.name = this.segmentLabel.name;
    this.nameChange.emit(this.name);

    this.segmentLabels = null;
    this.resetDropDown();

    this.segmentsService.getSegmentStructureByRef(this.ref.id, this.idPath, this.path).then((children) => {
      children = this.configService.arraySortByPosition(children);
      this.children = children;
      this.childrenChange.emit(this.children);
      this.refresh.emit(true);
    });
  }

  resetDropDown(){
    console.log("Closing");
    this.initOptions();
    this.editing=false;
  }

  cancel(){
    this.segmentLabels = null;
    this.currentSegLabel = null;
  }

  useThis(label){
    this.currentSegLabel = this.findSegmentLabelById(label.id);
  }

  private updateChildren(){
    this.segmentsService.getSegmentStructureByRef(this.ref.id, this.idPath, this.path).then((children) => {
      children = this.configService.arraySortByPosition(children);
      this.children = children;
      this.childrenChange.emit(this.children);
      this.refresh.emit(true);
    });
  }

  private findSegmentLabelById(id){
    for(let label of this.segmentLabels){
      if(label.id === id) return label;
    }
    return null;
  }

}
