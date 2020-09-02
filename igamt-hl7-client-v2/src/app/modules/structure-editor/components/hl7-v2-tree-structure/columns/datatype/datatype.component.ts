import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { PropertyType } from '../../../../../shared/models/save-change';
import { ReferenceComponent } from '../reference/reference.component';

@Component({
  selector: 'app-datatype-simplified',
  templateUrl: '../reference/reference.component.html',
  styleUrls: ['../reference/reference.component.html'],
})
export class DatatypeComponent extends ReferenceComponent {

  constructor(protected dialog: MatDialog) {
    super(PropertyType.DATATYPE, dialog, Type.DATATYPE);
  }

}
