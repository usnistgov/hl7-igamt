import { Component } from '@angular/core';
import { PropertyType } from '../../../../models/save-change';
import { ReferenceComponent } from '../reference/reference.component';

@Component({
  selector: 'app-datatype',
  templateUrl: '../reference/reference.component.html',
  styleUrls: ['../reference/reference.component.html'],
})
export class DatatypeComponent extends ReferenceComponent {
  constructor() {
    super(PropertyType.DATATYPE);
  }
}
