import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { Type } from '../../../../../shared/constants/type.enum';
import { ReferenceComponent } from '../reference/reference.component';

@Component({
  selector: 'app-segment-simplified',
  templateUrl: '../reference/reference.component.html',
  styleUrls: ['../reference/reference.component.html'],
})
export class SegmentComponent extends ReferenceComponent {
  constructor(protected dialog: MatDialog) {
    super(PropertyType.SEGMENTREF, dialog, Type.SEGMENT);
  }

}
