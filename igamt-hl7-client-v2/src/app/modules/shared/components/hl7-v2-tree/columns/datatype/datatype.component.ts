import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IDisplayElement } from '../../../../models/display-element.interface';
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

  filter(opts: IDisplayElement[], selected: IDisplayElement): GroupOptions {
    const same_base = opts.filter((opt) => {
      return opt.fixedName === selected.fixedName;
    });

    const different_base = opts.filter((opt) => {
      return opt.fixedName !== selected.fixedName && (selected.leaf ? true : !opt.leaf);
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
}
