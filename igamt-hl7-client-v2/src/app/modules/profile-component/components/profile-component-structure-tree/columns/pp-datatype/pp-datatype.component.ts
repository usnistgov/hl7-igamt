import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { map, take } from 'rxjs/operators';
import { ProfileComponentService } from 'src/app/modules/profile-component/services/profile-component.service';
import { GroupOptions } from 'src/app/modules/shared/components/hl7-v2-tree/columns/reference/reference.component';
import { ActiveStatus } from 'src/app/modules/shared/models/abstract-domain.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IItemProperty, IPropertyDatatype } from 'src/app/modules/shared/models/profile.component';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { AResourceRepositoryService, StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { PpReferenceComponent } from '../pp-reference/pp-reference.component';

@Component({
  selector: 'app-pp-datatype',
  templateUrl: '../pp-reference/pp-reference.component.html',
  styleUrls: ['../pp-reference/pp-reference.component.scss'],
})
export class PpDatatypeComponent extends PpReferenceComponent implements OnInit {

  constructor(dialog: MatDialog, private pcService: ProfileComponentService, private repository: StoreResourceRepositoryService) {
    super(PropertyType.DATATYPE, dialog);
  }

  filter(opts: IDisplayElement[], selected: IDisplayElement): GroupOptions {
    opts = opts.filter((x) => this.filterByActiveInfo(x));
    const same_base = opts.filter((opt) => {
      return opt.fixedName === selected.fixedName && opt.domainInfo.version === selected.domainInfo.version;
    });

    const itemize = (flavor) => {
      return {
        label: flavor.id,
        value: flavor,
      };
    };

    return [
      {
        label: 'Datatypes',
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
    this.onChange<IPropertyDatatype>({
      datatypeId: event.id,
      propertyKey: PropertyType.DATATYPE,
    },
      PropertyType.DATATYPE,
    );
    this.selected = event;
    this.toggleEdit();
  }

  apply(values: Record<PropertyType, IItemProperty>) {
    if (values[PropertyType.DATATYPE]) {
      const dt = values[PropertyType.DATATYPE] as IPropertyDatatype;
      this.pcService.getResourceRef(dt, this.repository).pipe(
        map((ref) => {
          this.applied$.next(ref);
        }),
      ).subscribe();
    }
  }

  activate() {
    this.onChange<IPropertyDatatype>({
      datatypeId: this.selected.id,
      propertyKey: PropertyType.DATATYPE,
    },
      PropertyType.DATATYPE,
    );
  }

  clear() {
    this.onChange<IPropertyDatatype>(undefined, PropertyType.DATATYPE);
    this.applied$.next(undefined);
  }

  ngOnInit() {
  }

}
