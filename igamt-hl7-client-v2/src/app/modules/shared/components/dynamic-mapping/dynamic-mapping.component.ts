import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as _ from 'lodash';
import {filter, take, tap} from 'rxjs/operators';
import {IgEditTocAddResource} from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import {Scope} from '../../constants/scope.enum';
import {Type} from '../../constants/type.enum';
import {IDisplayElement} from '../../models/display-element.interface';
import {ChangeType, IChange, PropertyType} from '../../models/save-change';
import {
  IDynamicMappingInfo,
  IDynamicMappingItem,
  IDynamicMappingMap,
  IDynamicMappingNaming,
} from '../../models/segment.interface';
import {AddMappingDialgComponent} from './add-mapping-dialg/add-mapping-dialg.component';

@Component({
  selector: 'app-dynamic-mapping',
  templateUrl: './dynamic-mapping.component.html',
  styleUrls: ['./dynamic-mapping.component.css'],
})
export class DynamicMappingComponent implements OnInit, OnDestroy {

  @Input()
  datatypes: IDisplayElement[];
  edit = {};
  @Input()
  hl7Version: string;
  @Input()
  viewOnly: boolean;
  dynamicMapping_: IDynamicMappingInfo;
  @Input()
  set dynamicMapping(mapping) {
    this.dynamicMapping_ = mapping;
    this.init();
  }
  @Input()
  mappingInfo: {display: IDisplayElement, values: string[]};
  @Output()
  mappingChange: EventEmitter<IChange> = new EventEmitter<IChange>();
  @Output()
  addResource: EventEmitter<IDisplayElement> = new EventEmitter<IDisplayElement>();
  map: IDynamicMappingMap = {};
  namingMap: IDynamicMappingNaming = {};
  datatypesOptionsMap = {};
  @Input()
  documentType: Type;
  @Input()
  documentId: string;
  selectedDynamicMappingTable: any[] = [];

  constructor(private dialog: MatDialog,
  ) {
  }

  ngOnInit() {

  }
  init() {
    this.namingMap = _.groupBy(this.datatypes, 'fixedName');
    if (this.dynamicMapping_ !== null && this.dynamicMapping_.items !== null) {
      this.selectedDynamicMappingTable = this.dynamicMapping_.items
        .map((x) => {
          return this.generate(x); });
    }
    this.map = {};
    this.selectedDynamicMappingTable.forEach( (x) => this.map[x.value] = x.display);
  }
  getOptions(name) {
    this.datatypesOptionsMap[name] = this.namingMap[name].filter((x) => x.domainInfo && x.domainInfo.scope !== Scope.HL7STANDARD);
  }
  select(value: string, display: IDisplayElement) {
    let changeType: ChangeType = ChangeType.ADD;
    let previous = null;
    if (this.map[value]) {
      changeType = ChangeType.UPDATE;
      previous = Object.assign(this.map[value], {});
    }
    this.map[value] = display;
    this.refresh();
    this.mappingChange.emit(this.getOutput(value, display.id, changeType , previous != null ?  previous.id : null ));
  }
  refresh() {
    this.selectedDynamicMappingTable = [];
    for (const mapKey in this.map) {
      if (this.map[mapKey]) {
        this.selectedDynamicMappingTable.push({value: mapKey, display: this.map[mapKey]});
      }
    }
  }
  modelChange($event) {
    this.mappingChange.emit(this.getOutput($event.value.fixedName, $event.value.id, ChangeType.UPDATE, this.findPrevious($event.value.fixedName)));
  }
  remove(key: string) {
    if (this.map[key]) {
      const previous = Object.assign(this.map[key], {});
      delete this.map[key];
      this.refresh();
      this.mappingChange.emit(this.getOutput(key, null, ChangeType.DELETE, previous.id));
    }
  }
  findPrevious(key): string {
    const entry = this.dynamicMapping_.items.filter((x) => x.value === key);
    if (entry.length) {
      return entry[0].datatypeId;
    }
    return null;
  }
  getOutput(key: string, value: string, changeType: ChangeType, oldValue: string ): IChange {
    return {propertyType: PropertyType.DYNAMICMAPPINGITEM, location: key, propertyValue: value, oldPropertyValue: oldValue, changeType };
  }

  addMapping() {
    const dialogRef = this.dialog.open(AddMappingDialgComponent, {
      data: {
        display: this.mappingInfo ? this.mappingInfo.display : null,
        values: this.mappingInfo ? this.mappingInfo.values.filter((x) => !this.map[x]) : [],
        namingMap: this.namingMap,
        documentId: this.documentId,
        documentType: this.documentType,
      },
    });
    dialogRef.afterClosed().pipe(
      take(1),
      filter((x) => x !== undefined),
      tap((result) => {
        this.select(result.value, result.display);
      }),
    ).subscribe();
  }

  private generate(x: IDynamicMappingItem) {
    const ret: any  = {value: x.value, display: this.datatypes.find((y) => y.id === x.datatypeId) } ;
    if (!ret.display) {
      ret.display = {
        fixedName: x.value, domainInfo: {version: this.hl7Version, scope: Scope.HL7STANDARD}, type: Type.DATATYPE, id: x.datatypeId,
      };
      ret.missing = true;
      this.namingMap[x.value] = [ret.display];
    }
    return ret;
  }

  import(display: IDisplayElement) {
    this.addResource.emit(display);
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
