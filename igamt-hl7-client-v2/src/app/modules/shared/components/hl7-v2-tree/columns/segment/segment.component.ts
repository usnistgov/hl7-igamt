import { Component } from '@angular/core';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { IDisplayElement } from '../../../../models/display-element.interface';
import { GroupOptions, ReferenceComponent } from '../reference/reference.component';

@Component({
  selector: 'app-segment',
  templateUrl: '../reference/reference.component.html',
  styleUrls: ['../reference/reference.component.html'],
})
export class SegmentComponent extends ReferenceComponent {
  constructor() {
    super(PropertyType.SEGMENTREF);
  }

  filter(opts: IDisplayElement[], selected: IDisplayElement): GroupOptions {
    const same_base = opts.filter((opt) => {
      return opt.fixedName === selected.fixedName;
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
