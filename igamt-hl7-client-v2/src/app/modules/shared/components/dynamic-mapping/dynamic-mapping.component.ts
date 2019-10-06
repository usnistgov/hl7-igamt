import {Component, Input, OnInit} from '@angular/core';
import {IDisplayElement} from '../../models/display-element.interface';
import {IDynamicMappingInfo, IDynamicMappingItem, IDynamicMappingMap} from '../../models/segment.interface';
import {ICodes, IValueSet} from '../../models/value-set.interface';
import {Scope} from '../../constants/scope.enum';

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
  map: IDynamicMappingMap = {};
  datatypesOptionsMap = {};

  constructor() { }

  ngOnInit() {
    for ( const elm of this.dynamicMapping.items ) {
      this.map[elm.value] = this.datatypes.find((x) => x.id === elm.datatypeId);
    }
  }
  getOptions(code: ICodes) {
    this.datatypesOptionsMap[code.value] = this.datatypes.filter((x) => x.fixedName === code.value && x.domainInfo != null && x.domainInfo.scope !== Scope.HL7STANDARD);
  }
}
