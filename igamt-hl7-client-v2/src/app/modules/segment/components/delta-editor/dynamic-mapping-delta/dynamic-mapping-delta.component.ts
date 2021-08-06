import {Component, Input, OnInit} from '@angular/core';
import {DeltaAction, IDynamicMappingItemDelta} from '../../../../shared/models/delta';
import {IDisplayElement} from '../../../../shared/models/display-element.interface';

@Component({
  selector: 'app-dynamic-mapping-delta',
  templateUrl: './dynamic-mapping-delta.component.html',
  styleUrls: ['./dynamic-mapping-delta.component.css'],
})
export class DynamicMappingDeltaComponent implements OnInit {

  items_: IDynamicMappingItemDelta[] = [];
  treeView = false;
  displayed: IDynamicMappingItemDelta[] = [];
  datatypesMap = {};
  @Input()
  set items(items: IDynamicMappingItemDelta[]) {
    this.items_ = items;
    this.displayed = items.filter((x) => x.action !== DeltaAction.UNCHANGED);
  }

  @Input()
  set datatypes(datatypes: IDisplayElement[]) {
   if (datatypes && datatypes.length > 0) {
     datatypes.forEach((x) => this.datatypesMap[x.id] = x);
   }
  }

  constructor() { }

  ngOnInit() {
  }

  toggleTreeView($event: any) {
    if ($event) {
      this.displayed = this.items_;
    } else {
      this.displayed = this.items_.filter((x) => x.action !== DeltaAction.UNCHANGED);
    }
  }
}
