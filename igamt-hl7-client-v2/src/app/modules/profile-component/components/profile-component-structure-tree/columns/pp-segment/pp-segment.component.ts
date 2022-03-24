import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { ProfileComponentService } from 'src/app/modules/profile-component/services/profile-component.service';
import { GroupOptions } from 'src/app/modules/shared/components/hl7-v2-tree/columns/reference/reference.component';
import { ActiveStatus } from 'src/app/modules/shared/models/abstract-domain.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IItemProperty, IPropertyRef } from 'src/app/modules/shared/models/profile.component';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { PpReferenceComponent } from '../pp-reference/pp-reference.component';

@Component({
  selector: 'app-pp-segment',
  templateUrl: '../pp-reference/pp-reference.component.html',
  styleUrls: ['../pp-reference/pp-reference.component.scss'],
})
export class PpSegmentComponent extends PpReferenceComponent implements OnInit {

  constructor(dialog: MatDialog, private pcService: ProfileComponentService, private repository: StoreResourceRepositoryService) {
    super(PropertyType.SEGMENTREF, dialog);
  }

  filter(opts: IDisplayElement[], selected: IDisplayElement): GroupOptions {
    opts = opts.filter((x) => this.filterByActiveInfo(x));
    const same_base = opts.filter((opt) => {
      return opt.resourceName === selected.resourceName;
    });

    const itemize = (flavor) => {
      return {
        label: flavor.id,
        value: flavor,
      };
    };

    return [
      {
        label: 'Segments',
        items: same_base.map(itemize).sort(this.sort),
      },
    ];
  }

  private filterByActiveInfo(opt: IDisplayElement) {
    if (opt.activeInfo && opt.activeInfo.status && opt.activeInfo.status === ActiveStatus.DEPRECATED) {
      return false;
    }
    return true;
  }

  referenceChanged(event: IDisplayElement) {
    this.onChange<IPropertyRef>({
      ref: event.id,
      propertyKey: PropertyType.SEGMENTREF,
    },
      PropertyType.SEGMENTREF,
    );
    this.selected = event;
    this.toggleEdit();
  }

  apply(values: Record<PropertyType, IItemProperty>) {
    if (values[PropertyType.SEGMENTREF]) {
      const sref = values[PropertyType.SEGMENTREF] as IPropertyRef;
      this.pcService.getResourceRef(sref, this.repository).pipe(
        map((ref) => {
          this.applied$.next(ref);
        }),
      ).subscribe();
    }
  }

  activate() {
    this.onChange<IPropertyRef>({
      ref: this.selected.id,
      propertyKey: PropertyType.SEGMENTREF,
    },
      PropertyType.SEGMENTREF,
    );
  }

  clear() {
    this.onChange<IPropertyRef>(undefined, PropertyType.SEGMENTREF);
    this.applied$.next(undefined);
  }

  ngOnInit() {
  }

}
