import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActiveStatus } from '../../../../models/abstract-domain.interface';
import { IDisplayElement } from '../../../../models/display-element.interface';
import { IResource } from '../../../../models/resource.interface';
import { PropertyType } from '../../../../models/save-change';
import { GroupOptions, ReferenceComponent } from '../reference/reference.component';

@Component({
  selector: 'app-datatype',
  templateUrl: '../reference/reference.component.html',
  styleUrls: ['../reference/reference.component.html'],
})
export class DatatypeComponent extends ReferenceComponent {

  constructor(protected dialog: MatDialog) {
    super(PropertyType.DATATYPE, dialog);
  }

  filter(opts: IDisplayElement[], selected: IDisplayElement, resource?: IResource): GroupOptions {
    opts = opts.filter((x) => this.filterByActiveInfo(x));
    const same_base = opts.filter((opt) => {
      return opt.resourceName === selected.resourceName && this.notRecursive(opt, resource);
    });

    const different_base = opts.filter((opt) => {
      return opt.resourceName !== selected.resourceName && this.notRecursive(opt, resource);
    });

    const itemize = (flavor) => {
      return {
        label: flavor.id,
        value: flavor,
      };
    };

    return [
      {
        label: 'Same base',
        items: same_base.map(itemize).sort(this.sort),
      },
      {
        label: 'Others',
        items: different_base.map(itemize).sort(this.sort),
      },
    ];
  }

  private notRecursive(option: IDisplayElement, resource: IResource): boolean {
    if (resource) {
      return option.id !== resource.id;
    }
    return true;
  }

  private filterByActiveInfo(opt: IDisplayElement) {
    if (opt.activeInfo && opt.activeInfo.status && opt.activeInfo.status === ActiveStatus.DEPRECATED) {
      return false;
    }
    return true;
  }
}
