import {Component, Input, Output, EventEmitter} from "@angular/core";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";
import { _ } from 'underscore';
import * as __ from 'lodash';
import {IgDocumentService} from "../../../igdocuments/igdocument-edit/ig-document.service";

@Component({
  selector : 'valueset-col',
  templateUrl : './valueset-col.component.html',
  styleUrls : ['./valueset-col.component.css']
})

export class ValuesetColComponent {
  @Input() bindings: any[];
  @Input() datatypeLabel: any;
  @Output() bindingsChange = new EventEmitter<any[]>();

  @Input() idPath : string;
  @Input() viewScope: string;
  @Input() sourceId : string;

  valuesetLabels : any[];

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  @Input() igId: string;

  currentBindings: any;
  backup:any;

  valuesetEditDialogOpen:boolean = false;
  valuesetStrengthOptions:any;
  valueSetLocationOptions:any;

  cols: any[];

  constructor(private configService : GeneralConfigurationService, private igDocumentService : IgDocumentService){}

  ngOnInit(){

    this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;
    this.valueSetLocationOptions = this.configService.getValuesetLocations(this.datatypeLabel.name, this.datatypeLabel.domainInfo.version);
    this.initCurrentBinding();

    this.cols = [
      { field: 'label', header: 'Binding Identifier' },
      { field: 'name', header: 'Name' }
    ];
  }

  editValuesetBindings(){
    this.valuesetEditDialogOpen = true;
    if(this.currentBindings) this.backup = __.cloneDeep(this.currentBindings);
    if(!this.currentBindings || this.currentBindings.priority !== 1){
      this.currentBindings = {};
      this.currentBindings.priority = 1;
      this.currentBindings.sourceType = this.viewScope;
      this.currentBindings.sourceId = this.sourceId;
      this.currentBindings.valuesetBindings = [];
    }

    this.igDocumentService.getValuesetLabels(this.igId).then((vData) => {
      this.valuesetLabels = vData;
    });
  }

  deleteVS(vs){
    this.currentBindings.valuesetBindings = _.without(this.currentBindings.valuesetBindings, _.findWhere(this.currentBindings.valuesetBindings, {valuesetId: vs.valuesetId}));
  }

  updateValuesetBinding(){
    if(!this.bindings) this.bindings = [];
    var binding = this.findTargetBinding();
    if(!binding) this.bindings.push(this.currentBindings);
    else binding.valuesetBindings = __.cloneDeep(this.currentBindings.valuesetBindings);
    this.initCurrentBinding();
    this.bindingsChange.emit(this.bindings);


    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'VALUESET';
    item.propertyValue = this.findTargetBinding().valuesetBindings;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.changeItemsChange.emit(this.changeItems);
    this.valuesetLabels = null;
  }

  resetValuesetBinding(){
    this.currentBindings = this.backup;
    this.valuesetLabels = null;
  }

  async initCurrentBinding(){
    this.currentBindings = null;
    if(this.bindings){
      for (var i in this.bindings) {
        if(this.bindings[i].valuesetBindings && this.bindings[i].valuesetBindings.length > 0){
          if(!this.currentBindings) this.currentBindings = __.cloneDeep(this.bindings[i]);
          else {
            if(this.currentBindings.priority > this.bindings[i].priority) this.currentBindings = __.cloneDeep(this.bindings[i]);
          }
        }
      }
    }
  }

  findTargetBinding(){
    if(this.bindings){
      for (var i in this.bindings) {
        if(this.bindings[i].priority === 1) return this.bindings[i];
      }
      return null;
    }
  }

  addVS(rowData){
    if(this.currentBindings && this.currentBindings.valuesetBindings){
      let binding:any = {};
      binding.valuesetId = rowData.id;
      binding.label = rowData.label;
      binding.name = rowData.name;
      this.currentBindings.valuesetBindings.push(binding);
    }
  }
}
