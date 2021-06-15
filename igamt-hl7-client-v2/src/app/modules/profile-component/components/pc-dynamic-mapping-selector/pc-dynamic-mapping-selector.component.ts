import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {filter, take, tap} from 'rxjs/operators';
import {AddMappingDialgComponent} from '../../../shared/components/dynamic-mapping/add-mapping-dialg/add-mapping-dialg.component';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {IPropertyDynamicMappingItem} from '../../../shared/models/profile.component';
import {ChangeType, PropertyType} from '../../../shared/models/save-change';
import {IDynamicMappingNaming} from '../../../shared/models/segment.interface';
import {
  DynamicMappingStatus,
  IDynamicMappingItemDisplay,
} from '../segment-context-dynamic-mapping/segment-context-dynamic-mapping.component';

@Component({
  selector: 'app-pc-dynamic-mapping-selector',
  templateUrl: './pc-dynamic-mapping-selector.component.html',
  styleUrls: ['./pc-dynamic-mapping-selector.component.css'],
})
export class PcDynamicMappingSelectorComponent implements OnInit {

  @Input()
  datatypeMap: { [k: string]: IDisplayElement };
  @Input()
  available: IDynamicMappingNaming = {};
  @Input()
  profileComponentDynamicMapping: IDynamicMappingItemDisplay[];
  @Input()
  segmentDynamicMapping: IDynamicMappingItemDisplay[];
  @Input()
  pcVs: IDisplayElement;
  @Input()
  segVs: IDisplayElement;
  @Output()
  update: EventEmitter<IPropertyDynamicMappingItem[]> = new EventEmitter<IPropertyDynamicMappingItem[]>();

  showOrigin = true;
  viewOnly = false;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  deleteFromResource(item: IDynamicMappingItemDisplay) {
    this.profileComponentDynamicMapping.push({...item, changeType: ChangeType.DELETE, status: DynamicMappingStatus.ACTIVE});
    this.update.emit(this.getItemsFromDisplay());

  }

  addMapping() {
    const dialogRef = this.dialog.open(AddMappingDialgComponent, {
      data: {
        values: this.getUnmapped(Object.keys(this.available)),
        namingMap: this.available,
        display: this.pcVs,
      },
    });
    dialogRef.afterClosed().pipe(
      take(1),
      filter((x) => x !== undefined),
      tap((result) => {
        this.profileComponentDynamicMapping.push({
          display: result.display, status: DynamicMappingStatus.ACTIVE, value: result.display.fixedName, changeType: ChangeType.ADD});
        this.update.emit(this.getItemsFromDisplay());

      }),
    ).subscribe();
  }

  toggle() {
    this.showOrigin = !this.showOrigin;
  }

  deleteItem(dyn: IDynamicMappingItemDisplay) {
    const i = this.profileComponentDynamicMapping.indexOf(dyn);
    if (i > -1) {
      this.profileComponentDynamicMapping.splice(i, 1);
      this.update.emit(this.getItemsFromDisplay());
    }
  }

  private getUnmapped(strings: string[]) {
    return strings.filter((x) => this.profileComponentDynamicMapping.length === 0 || this.profileComponentDynamicMapping.filter((y) => y.value === x && y.changeType !== ChangeType.DELETE ).length <= 0);
  }

  modelChange($event: any) {
    this.update.emit(this.getItemsFromDisplay());
  }

  private getItemsFromDisplay(): IPropertyDynamicMappingItem[] {
    return this.profileComponentDynamicMapping.map((x) => ({ payload: {value: x.value, datatypeId: x.display.id}  , change : x.changeType, propertyKey: PropertyType.DYNAMICMAPPINGITEM }));
 }
}
