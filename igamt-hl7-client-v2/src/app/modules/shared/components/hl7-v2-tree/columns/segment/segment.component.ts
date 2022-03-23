import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { IDisplayElement } from '../../../../models/display-element.interface';
import { GroupOptions, ReferenceComponent } from '../reference/reference.component';

@Component({
  selector: 'app-segment',
  templateUrl: '../reference/reference.component.html',
  styleUrls: ['../reference/reference.component.html'],
})
export class SegmentComponent extends ReferenceComponent {
  constructor(protected dialog: MatDialog) {
    super(PropertyType.SEGMENTREF, dialog);
  }

  filter(opts: IDisplayElement[], selected: IDisplayElement): GroupOptions {
    const same_base = opts.filter((opt) => {
      return opt.resourceName === selected.resourceName;
    });

    return [
      {
        label: 'Segments',
        items: same_base.map((flavor) => {
          return {
            label: flavor.id,
            value: flavor,
          };
        }),
      },
    ];
  }
}
