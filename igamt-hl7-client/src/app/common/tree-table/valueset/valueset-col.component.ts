import {Component, Input, Output, EventEmitter} from "@angular/core";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'valueset-col',
  templateUrl : './valueset-col.component.html',
  styleUrls : ['./valueset-col.component.css']
})

export class ValuesetColComponent {
  @Input() bindings: any[];
  @Output() bindingsChange = new EventEmitter<any[]>();

  @Input() idPath : string;
  @Input() viewScope: string;

  @Input() valuesetLabels : any[];

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  currentBindings: any;

  valuesetEditDialogOpen:boolean = false;

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    if(this.bindings){
      for (var i in this.bindings) {
        if(this.bindings[i].valuesetBindings && this.bindings[i].valuesetBindings.length > 0){
          if(!this.currentBindings) this.currentBindings = this.bindings[i];
          else {
            if(this.currentBindings.priority > this.bindings[i].priority) this.currentBindings = this.bindings[i];
          }
        }
      }
    }
  }

  getBindingIdentifier(id){
    for (let vs of this.valuesetLabels) {
      if(id === vs.id.id) return vs.label;
    }
    return null;
  }

  getVSName(id){
    for (let vs of this.valuesetLabels) {
      if(id === vs.id.id) return vs.name;
    }
    return null;
  }

  getVS(id){
    for (let vs of this.valuesetLabels) {
      if(id === vs.id.id) return vs;
    }
    return null;
  }

  editValuesetBindings(){
    this.valuesetEditDialogOpen = true;
  }
}