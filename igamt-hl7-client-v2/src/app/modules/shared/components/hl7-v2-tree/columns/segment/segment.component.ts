import { Component } from '@angular/core';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { ReferenceComponent } from '../reference/reference.component';

@Component({
  selector: 'app-segment',
  templateUrl: '../reference/reference.component.html',
  styleUrls: ['../reference/reference.component.html'],
})
export class SegmentComponent extends ReferenceComponent {
  constructor() {
    super(PropertyType.SEGMENTREF);
  }
}
