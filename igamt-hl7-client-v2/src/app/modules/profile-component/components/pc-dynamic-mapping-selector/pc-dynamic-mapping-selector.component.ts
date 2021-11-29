import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {filter, take, tap} from 'rxjs/operators';
import {AddMappingDialgComponent} from '../../../shared/components/dynamic-mapping/add-mapping-dialg/add-mapping-dialg.component';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {DynamicMappingStatus, IPcDynamicMappingItem} from '../../../shared/models/profile.component';
import {ChangeType} from '../../../shared/models/save-change';
import {
  IDynamicMappingInfo,
  IDynamicMappingItem,
  IDynamicMappingNaming,
} from '../../../shared/models/segment.interface';
import {
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
  edit: { [k: string]: boolean } = {};
  @Input()
  available: IDynamicMappingNaming = {};
  @Input()
  profileComponentDynamicMapping: IDynamicMappingItemDisplay[];
  @Input()
  segmentDynamicMapping: IDynamicMappingInfo = {items: [], referenceFieldId: '', variesFieldId: ''};
  @Input()
  pcVs: IDisplayElement;
  @Input()
  segVs: IDisplayElement;
  @Input()
  containsInvalid: boolean;
  @Output()
  update: EventEmitter<IPcDynamicMappingItem[]> = new EventEmitter<IPcDynamicMappingItem[]>();
  showOrigin = true;
  @Input()
  viewOnly = false;
  @Input()
  segmentDisplay: IDisplayElement;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
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
          display: result.display,
          status: DynamicMappingStatus.ACTIVE,
          value: result.display.fixedName,
          changeType: ChangeType.ADD,
        });
        this.update.emit(this.getItemsFromDisplay());

      }),
    ).subscribe();
  }

  toggle() {
    this.showOrigin = !this.showOrigin;
  }

  deleteItem(dyn: IDynamicMappingItemDisplay) {
    dyn.changeType = ChangeType.DELETE;
    this.update.emit(this.getItemsFromDisplay());
  }

  restoreItem(dyn: IDynamicMappingItemDisplay) {
    dyn.changeType = null;
    this.update.emit(this.getItemsFromDisplay());
  }

  editRow(dyn: IDynamicMappingItemDisplay) {
    this.edit[dyn.value] = true;
  }

  hideDropDown(dyn: IDynamicMappingItemDisplay) {
    this.edit[dyn.value] = false;
  }

  remove(dyn: IDynamicMappingItemDisplay) {
    const i = this.profileComponentDynamicMapping.indexOf(dyn);
    if (i > -1) {
      this.profileComponentDynamicMapping.splice(i, 1);
      this.update.emit(this.getItemsFromDisplay());
    }
  }

  private getUnmapped(strings: string[]) {
    return strings.filter((x) => this.profileComponentDynamicMapping.length === 0 || this.profileComponentDynamicMapping.filter((y) => y.value === x).length <= 0);
  }

  modelChange($event: any) {
    const changed: IDynamicMappingItemDisplay = this.profileComponentDynamicMapping.find((x) => x.value === $event.value.fixedName);
    if (changed != null && changed.changeType !== ChangeType.ADD) {
      changed.changeType = ChangeType.UPDATE;
      this.edit[changed.value] = false;
    }
    this.update.emit(this.getItemsFromDisplay());
  }

  private getItemsFromDisplay(): IPcDynamicMappingItem[] {
    return this.profileComponentDynamicMapping.filter((d) => d.changeType != null).map((x) => ({
      datatypeName: x.display.fixedName,
      flavorId: x.display.id,
      change: x.changeType,
    }));
  }

  clean() {
    const invalids = this.profileComponentDynamicMapping.filter((x) => x.status === DynamicMappingStatus.INVALID);
    invalids.forEach((x) => {
      this.cleanOne(x);
      });
    this.update.emit(this.getItemsFromDisplay());
  }

  cleanOne(dyn: IDynamicMappingItemDisplay) {
      const item: IDynamicMappingItem = this.segmentDynamicMapping.items.find((x) => x.value === dyn.value);
      if (item != null && dyn.changeType !== ChangeType.ADD) {
        dyn.changeType = ChangeType.DELETE;
        dyn.status = DynamicMappingStatus.ACTIVE;
      } else {
        const i = this.profileComponentDynamicMapping.indexOf(dyn);
        if (i > -1) {
          this.profileComponentDynamicMapping.splice(i, 1);
        }
      }
      this.update.emit(this.getItemsFromDisplay());
  }

  isSegmentDefined(dyn: IDynamicMappingItemDisplay): boolean {
    const item: IDynamicMappingItem = this.segmentDynamicMapping.items.find((x) => x.value === dyn.value);
    return item != null;
  }
  segmentMustDelete(dyn: IDynamicMappingItemDisplay) {
    return this.isSegmentDefined(dyn) && dyn.changeType === ChangeType.DELETE && !this.available[dyn.value];
  }
}
