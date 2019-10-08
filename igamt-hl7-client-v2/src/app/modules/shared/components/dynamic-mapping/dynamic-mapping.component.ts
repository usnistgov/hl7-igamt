import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {Scope} from '../../constants/scope.enum';
import {IDisplayElement} from '../../models/display-element.interface';
import {IDynamicMappingInfo, IDynamicMappingMap, IDynamicMappingNaming} from '../../models/segment.interface';
import {ICodes, IValueSet} from '../../models/value-set.interface';

@Component({
  selector: 'app-dynamic-mapping',
  templateUrl: './dynamic-mapping.component.html',
  styleUrls: ['./dynamic-mapping.component.css'],
})
export class DynamicMappingComponent implements OnInit {

  @Input()
  datatypes: IDisplayElement[];
  edit = {};
  @Input()
  dynamicMapping: IDynamicMappingInfo;
  @Input()
  valueSet: IValueSet;

  @Output()
  mappingChange: EventEmitter<IDynamicMappingInfo> = new EventEmitter<IDynamicMappingInfo>();
  map: IDynamicMappingMap = {};
  namingMap: IDynamicMappingNaming = {};
  datatypesOptionsMap = {};
  selectedDynamicMappingTable: any[] = [];

  constructor() {
  }

  ngOnInit() {
    this.namingMap = _.groupBy(this.datatypes, 'fixedName');
    if (this.dynamicMapping !== null && this.dynamicMapping.items !== null) {
      this.selectedDynamicMappingTable = this.dynamicMapping.items
        .map((x) => {
          return {
            value: x.value,
            display: this.datatypes.find((y) => y.id === x.datatypeId),
          }; });
    }
  }

  getOptions(name) {
    this.datatypesOptionsMap[name] = this.namingMap[name].filter((x) => x.domainInfo && x.domainInfo.scope !== Scope.HL7STANDARD);
  }

  getDefaultDisplayElement(code: ICodes): any {
    return {
      fixedName: code.value,
      variableName: null,
      description: code.description,
      domainInfo: this.valueSet.domainInfo,
    };
  }
  select(value: string, display: IDisplayElement) {
    this.map[value] = display;
    this.selectedDynamicMappingTable = [];
    for (const mapKey in this.map) {
      if (this.map[mapKey]) {
        this.selectedDynamicMappingTable.push({value: mapKey, display: this.map[mapKey]});
      }
    }
    this.mappingChange.emit(this.getOutput());

  }
  modelChange() {
    this.mappingChange.emit(this.getOutput());
  }
  remove(key: string) {
    delete this.map[key];
    this.selectedDynamicMappingTable = [];
    for (const mapKey in this.map) {
      if (this.map[mapKey]) {
        this.selectedDynamicMappingTable.push({value: mapKey, display: this.map[mapKey]});
      }
    }
    this.mappingChange.emit(this.getOutput());
  }
  getOutput(): IDynamicMappingInfo {
    return {... this.dynamicMapping, items: this.selectedDynamicMappingTable.map((x) => ({ value: x.value, datatypeId: x.display.id }))};
  }
}
